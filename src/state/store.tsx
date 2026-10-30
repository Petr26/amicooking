import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dish, Step } from '../data/dishes';
import { bundledCatalog, Catalog, fetchCatalog, loadCachedCatalog } from '../data/catalog';
import { ui, Lang, UIStrings } from '../data/strings';
import { cancelDailyNudge, scheduleDailyNudge } from '../notifications';
import { pb, isNetworkError, restoreAuth, fetchLimits, defaultLimits, Limits, Plan, planOf, newRecordId, authErrorOf, AuthError } from '../api/pb';
import { enqueueOp, flush, makeCustomDish, mergeOps, pull, LogEntry, Op, Settings } from './sync';

export type { LogEntry } from './sync';

export type Tab = 'tonight' | 'saved' | 'log' | 'you';
export type Mode = 'verdict' | 'committed' | 'optout' | 'cooking' | 'cookdone';

// limit: tried to go past the dish limit. overflow: n dishes from this phone did not fit the account.
// pro: tried a Pro feature without Pro.
export type Notice = { kind: 'limit' } | { kind: 'pro' } | { kind: 'overflow'; n: number } | null;

type PersistedState = {
  saved: string[];
  customDishes: Dish[];
  log: LogEntry[];
  maxTime: number;
  noFish: boolean;
  breakRotation: boolean;
  askEarly: boolean;
  lang: Lang;
  totalRerolls: number;
  totalYeses: number;
  outbox: Op[];
};

const STORAGE_KEY = 'amicooking:v1';

const defaults: PersistedState = {
  saved: ['kimchi'],
  customDishes: [],
  log: [{ seed: 0 }, { seed: 1 }, { seed: 2 }, { seed: 3 }],
  maxTime: 30,
  noFish: false,
  breakRotation: true,
  askEarly: true,
  lang: 'en',
  totalRerolls: 0,
  totalYeses: 0,
  outbox: [],
};

// Custom dish ids used to be 'c' + Date.now() (14 chars); the backend wants 15.
const fixLegacyId = (id: string) => (/^c\d{13}$/.test(id) ? id + '0' : id);

export type Store = {
  hydrated: boolean;
  tab: Tab;
  mode: Mode;
  rolls: number;
  lang: Lang;
  T: UIStrings;
  saved: string[];
  maxTime: number;
  noFish: boolean;
  breakRotation: boolean;
  askEarly: boolean;
  log: LogEntry[];
  stats: { yeses: number; rerolls: number; newDishes: number; acceptPct: number };
  allDishes: Dish[];
  pool: Dish[];
  dish: Dish;
  cookDish: Dish;
  cookSteps: Step[];
  cookStep: number;
  // Account & limits
  user: { id: string; email: string } | null;
  plan: Plan;
  limits: Limits;
  myDishCount: number;
  dishLimit: number;
  notice: Notice;
  authOpen: boolean;
  dishName: (d: Dish) => string;
  dishNote: (d: Dish) => string;
  dishMissing: (d: Dish) => string;
  pans: (d: Dish) => string;
  status: (d: Dish) => string;
  meta: (d: Dish) => string;
  stepsFor: (id: string) => Step[];
  setTab: (tab: Tab) => void;
  setLang: (lang: Lang) => void;
  setMaxTime: (t: number) => void;
  toggleNoFish: () => void;
  toggleBreakRotation: () => void;
  toggleAskEarly: () => void;
  reroll: () => void;
  commit: () => void;
  uncommit: () => void;
  orderIn: () => void;
  backToVerdict: () => void;
  toggleSave: () => void;
  removeSaved: (id: string) => void;
  cookFromSaved: (id: string) => void;
  startCooking: () => void;
  stopCooking: () => void;
  cookNext: () => void;
  cookBack: () => void;
  cookRestart: () => void;
  cookLogIt: () => void;
  isPro: boolean;
  premiumCount: number;
  addCustomDish: (name: string, mins: number, pans2: boolean, note: string, steps: Step[]) => boolean;
  editCustomDish: (id: string, name: string, mins: number, pans2: boolean, note: string, steps: Step[]) => void;
  showPro: () => void;
  checkRoom: () => boolean;
  goToVerdict: () => void;
  openAuth: () => void;
  closeAuth: () => void;
  signIn: (email: string, password: string) => Promise<AuthError | null>;
  signUp: (email: string, password: string) => Promise<AuthError | null>;
  signOut: () => void;
  dismissNotice: () => void;
};

const StoreContext = createContext<Store | null>(null);

// DEV ONLY: EXPO_PUBLIC_SCENARIO="<tab>:<mode>:<lang>" jumps straight to a screen.
const scenario = (__DEV__ && process.env.EXPO_PUBLIC_SCENARIO ? process.env.EXPO_PUBLIC_SCENARIO : '').split(':');

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<Tab>((scenario[0] as Tab) || 'tonight');
  const [mode, setMode] = useState<Mode>((scenario[1] as Mode) || 'verdict');
  const [vIdx, setVIdx] = useState(0);
  const [rolls, setRolls] = useState(0);
  const [saved, setSaved] = useState<string[]>(defaults.saved);
  const [customDishes, setCustomDishes] = useState<Dish[]>([]);
  const [log, setLog] = useState<LogEntry[]>(defaults.log);
  const [maxTime, setMaxTimeState] = useState(defaults.maxTime);
  const [noFish, setNoFish] = useState(defaults.noFish);
  const [breakRotation, setBreakRotation] = useState(defaults.breakRotation);
  const [askEarly, setAskEarly] = useState(defaults.askEarly);
  const [lang, setLangState] = useState<Lang>(defaults.lang);
  const [totalRerolls, setTotalRerolls] = useState(defaults.totalRerolls);
  const [totalYeses, setTotalYeses] = useState(defaults.totalYeses);
  const [outbox, setOutbox] = useState<Op[]>([]);
  const [cookDishId, setCookDishId] = useState('cacio');
  const [cookStep, setCookStep] = useState(0);
  const [catalog, setCatalog] = useState<Catalog>(bundledCatalog);
  const [userRecord, setUserRecord] = useState<Record<string, any> | null>(null);
  const [limits, setLimits] = useState<Limits>(defaultLimits);
  const [notice, setNotice] = useState<Notice>(null);
  const [authOpen, setAuthOpen] = useState(false);

  // The outbox is read by async sync code, so it also lives in a ref. While a batch is
  // being sent it sits in `inflight`; new ops queue up behind it. Both are persisted, so
  // an app kill mid-sync only means a few ops get re-sent.
  const outboxRef = useRef<Op[]>([]);
  const inflight = useRef<Op[]>([]);
  const userIdRef = useRef<string | null>(null);
  const syncing = useRef(false);
  const lastSettings = useRef('');
  const user = userRecord ? { id: userRecord.id as string, email: userRecord.email as string } : null;
  userIdRef.current = user?.id ?? null;

  const setQueue = useCallback((q: Op[]) => {
    outboxRef.current = q;
    setOutbox([...inflight.current, ...q]);
  }, []);

  const applySettings = (s: Settings) => {
    setMaxTimeState(s.maxTime);
    setNoFish(s.noFish);
    setBreakRotation(s.breakRotation);
    setAskEarly(s.askEarly);
    setLangState(s.lang);
  };

  // Flush the outbox, then (once nothing is pending) take the server state as truth.
  const sync = useCallback(async () => {
    const uid = userIdRef.current;
    if (!uid || syncing.current) return;
    syncing.current = true;
    try {
      while (outboxRef.current.length) {
        inflight.current = outboxRef.current;
        outboxRef.current = [];
        const { remaining, limited } = await flush(inflight.current, uid);
        inflight.current = [];
        setQueue([...remaining, ...outboxRef.current]);
        if (limited) setNotice({ kind: 'overflow', n: limited });
        if (remaining.length) return; // offline — try again later
      }
      const r = await pull(uid);
      if (userIdRef.current !== uid || outboxRef.current.length) return;
      setUserRecord(r.user);
      setSaved(r.saved);
      setCustomDishes(r.customDishes);
      setLog(r.log);
      setTotalRerolls(r.totalRerolls);
      setTotalYeses(r.totalYeses);
      if (r.settings) {
        lastSettings.current = JSON.stringify(r.settings);
        applySettings(r.settings);
      }
    } catch (e: any) {
      if (e?.status === 401) endSessionRef.current();
    } finally {
      syncing.current = false;
    }
  }, [setQueue]);

  const endSessionRef = useRef(() => {});
  const queue = useCallback(
    (op: Op) => {
      if (!userIdRef.current) return;
      setQueue(enqueueOp(outboxRef.current, op));
      setTimeout(sync, 0);
    },
    [setQueue, sync]
  );

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(STORAGE_KEY), loadCachedCatalog(), restoreAuth()])
      .then(([raw, cached]) => {
        if (cached) setCatalog(cached);
        if (pb.authStore.isValid && pb.authStore.record) setUserRecord(pb.authStore.record);
        if (raw) {
          const p: Partial<PersistedState> = JSON.parse(raw);
          if (p.saved) setSaved(p.saved.map(fixLegacyId));
          if (p.customDishes) setCustomDishes(p.customDishes.map((d) => ({ ...d, id: fixLegacyId(d.id) })));
          if (p.log) setLog(p.log.map((e) => ('custom' in e ? { ...e, dishId: fixLegacyId(e.dishId) } : e)));
          if (p.maxTime != null) setMaxTimeState(p.maxTime);
          if (p.noFish != null) setNoFish(p.noFish);
          if (p.breakRotation != null) setBreakRotation(p.breakRotation);
          if (p.askEarly != null) setAskEarly(p.askEarly);
          if (p.lang) setLangState((scenario[2] as Lang) || p.lang);
          if (p.totalRerolls != null) setTotalRerolls(p.totalRerolls);
          if (p.totalYeses != null) setTotalYeses(p.totalYeses);
          if (p.outbox) setQueue(p.outbox);
        }
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, [setQueue]);

  // Fresh catalog, limits and account data at launch and whenever the app comes back.
  // Signing out (or losing the session): the account keeps everything; this phone
  // starts over empty (settings stay).
  const endSession = useCallback(() => {
    pb.authStore.clear();
    userIdRef.current = null;
    setUserRecord(null);
    setQueue([]);
    setSaved([]);
    setCustomDishes([]);
    setLog([]);
    setTotalRerolls(0);
    setTotalYeses(0);
  }, [setQueue]);

  // Tokens expire after a week, so each launch / foreground renews the session. A token
  // the server rejects (account deleted, different server) ends the session.
  // The catalog is fetched after the session is renewed: premium steps depend on the plan.
  const refresh = useCallback(async () => {
    fetchLimits().then(setLimits).catch(() => {});
    if (userIdRef.current) {
      try {
        const res = await pb.collection('users').authRefresh();
        setUserRecord(res.record);
      } catch (e) {
        if (!isNetworkError(e)) endSession();
      }
    }
    fetchCatalog().then(setCatalog).catch(() => {});
    sync();
  }, [sync, endSession]);
  endSessionRef.current = endSession;
  useEffect(() => {
    if (!hydrated) return;
    refresh();
    const sub = AppState.addEventListener('change', (s) => s === 'active' && refresh());
    return () => sub.remove();
  }, [hydrated, refresh]);

  // Session expired / cleared elsewhere → back to anonymous.
  useEffect(() => pb.authStore.onChange((token) => !token && setUserRecord(null)), []);

  useEffect(() => {
    if (!hydrated) return;
    const data: PersistedState = {
      saved, customDishes, log, maxTime, noFish, breakRotation, askEarly, lang, totalRerolls, totalYeses, outbox,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [hydrated, saved, customDishes, log, maxTime, noFish, breakRotation, askEarly, lang, totalRerolls, totalYeses, outbox]);

  // Settings follow the account: any local change is queued (pulled values are not echoed back).
  useEffect(() => {
    if (!hydrated || !user) return;
    const settings: Settings = { maxTime, noFish, breakRotation, askEarly, lang };
    const json = JSON.stringify(settings);
    if (json === lastSettings.current) return;
    lastSettings.current = json;
    queue({ k: 'settings', settings });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, user?.id, maxTime, noFish, breakRotation, askEarly, lang]);

  // Keep the 6pm nudge in sync with the toggle. At launch we only (re)schedule
  // if permission was already granted; the permission dialog is shown when the
  // user flips the toggle on themselves.
  const askEarlyTouched = useRef(false);
  useEffect(() => {
    if (!hydrated) return;
    if (askEarly) scheduleDailyNudge(lang, askEarlyTouched.current);
    else cancelDailyNudge();
  }, [hydrated, askEarly, lang]);

  const T = ui[lang];
  const allDishes = useMemo(() => [...catalog.dishes, ...customDishes], [catalog, customDishes]);

  // "My dishes" = saved ∪ custom; one shared limit (10 on this phone, 25 signed in, more with a plan).
  const plan = planOf(userRecord);
  const isPro = !!user && plan === 'pro';
  const premiumCount = catalog.dishes.filter((d) => d.premium).length;
  const dishLimit = user ? limits[plan] : limits.anon;
  const myKeys = useMemo(() => new Set([...saved, ...customDishes.map((d) => d.id)]), [saved, customDishes]);
  const myDishCount = myKeys.size;
  const roomFor = (key?: string) => (key && myKeys.has(key)) || myDishCount < dishLimit;

  // Premium dishes only reach the verdict with Pro.
  const pool = useMemo(() => {
    const open = allDishes.filter((d) => isPro || !d.premium);
    let p = open.filter((d) => d.time <= maxTime && (!noFish || !d.fish));
    if (breakRotation) {
      const fresh = p.filter((d) => d.statusNew);
      if (fresh.length) p = fresh;
    }
    return p.length ? p : open;
  }, [allDishes, isPro, maxTime, noFish, breakRotation]);

  const dish = pool[vIdx % pool.length];
  const cookDish = allDishes.find((d) => d.id === cookDishId) || allDishes[0];

  const stepsFor = useCallback(
    (id: string): Step[] => {
      if (catalog.steps[id]) return catalog.steps[id];
      const own = customDishes.find((d) => d.id === id)?.steps;
      if (own?.length) return own;
      return [{ t: ui.en.customStepT, d: ui.en.customStepD, tc: ui.cs.customStepT, dc: ui.cs.customStepD }];
    },
    [catalog, customDishes]
  );
  const cookSteps = stepsFor(cookDish.id);

  const dishName = useCallback((d: Dish) => (lang === 'cs' ? d.cs.name : d.name), [lang]);
  const dishNote = useCallback((d: Dish) => (lang === 'cs' ? d.cs.dry : d.dry), [lang]);
  const dishMissing = useCallback((d: Dish) => (lang === 'cs' ? d.cs.miss : d.missEn), [lang]);
  const pans = useCallback((d: Dish) => (d.pans2 ? T.pan2 : T.pan1), [T]);
  const status = useCallback((d: Dish) => (d.statusNew ? T.stNew : T.stRotation), [T]);
  const meta = useCallback(
    (d: Dish) => d.time + ' ' + T.minWord + ' · ' + pans(d) + ' · ' + status(d),
    [T, pans, status]
  );

  const advanceRoll = useCallback(() => {
    setVIdx((i) => (i + 1) % pool.length);
    setRolls((r) => r + 1);
    setTotalRerolls((r) => r + 1);
    queue({ k: 'counters', rerolls: 1, yeses: 0 });
  }, [pool.length, queue]);

  const countYes = () => {
    setTotalYeses((y) => y + 1);
    queue({ k: 'counters', rerolls: 0, yeses: 1 });
  };

  const unsave = (id: string) => {
    setSaved((s) => s.filter((x) => x !== id));
    queue({ k: 'unsave', dish: id });
  };

  const stats = useMemo(() => {
    const yeses = totalYeses;
    const rerolls = totalRerolls;
    const newDishes = customDishes.length;
    const acceptPct = yeses + rerolls ? Math.round((yeses / (yeses + rerolls)) * 100) : 0;
    return { yeses, rerolls, newDishes, acceptPct };
  }, [totalYeses, totalRerolls, customDishes.length]);

  // After signing in: push what this phone collected anonymously, then pull the account.
  const afterAuth = async (record: Record<string, any>, fresh: boolean) => {
    const local = { saved, customDishes, log, totalRerolls, totalYeses };
    setUserRecord(record);
    userIdRef.current = record.id;
    let ops = mergeOps(local);
    // A brand-new account takes this phone's settings; an existing one keeps its own.
    if (fresh) ops = [{ k: 'settings', settings: { maxTime, noFish, breakRotation, askEarly, lang } }, ...ops];
    lastSettings.current = '';
    setQueue(ops);
    setAuthOpen(false);
    await sync();
    fetchCatalog().then(setCatalog).catch(() => {});
  };

  const authWith = async (email: string, password: string, create: boolean): Promise<AuthError | null> => {
    try {
      if (create) await pb.collection('users').create({ email, password, passwordConfirm: password });
      const res = await pb.collection('users').authWithPassword(email, password);
      await afterAuth(res.record, create);
      return null;
    } catch (e) {
      return authErrorOf(e);
    }
  };

  const store: Store = {
    hydrated,
    tab,
    mode,
    rolls,
    lang,
    T,
    saved,
    maxTime,
    noFish,
    breakRotation,
    askEarly,
    log,
    stats,
    allDishes,
    pool,
    dish,
    cookDish,
    cookSteps,
    cookStep,
    user,
    plan,
    limits,
    isPro,
    premiumCount,
    myDishCount,
    dishLimit,
    notice,
    authOpen,
    dishName,
    dishNote,
    dishMissing,
    pans,
    status,
    meta,
    stepsFor,
    setTab,
    setLang: setLangState,
    setMaxTime: (t) => {
      setMaxTimeState(t);
      setVIdx(0);
    },
    toggleNoFish: () => {
      setNoFish((v) => !v);
      setVIdx(0);
    },
    toggleBreakRotation: () => {
      setBreakRotation((v) => !v);
      setVIdx(0);
    },
    toggleAskEarly: () => {
      askEarlyTouched.current = true;
      setAskEarly((v) => !v);
    },
    reroll: advanceRoll,
    commit: () => {
      setCookDishId(dish.id);
      setCookStep(0);
      countYes();
      setMode('committed');
    },
    uncommit: () => {
      setMode('verdict');
      advanceRoll();
    },
    orderIn: () => setMode('optout'),
    backToVerdict: () => {
      setMode('verdict');
      advanceRoll();
    },
    toggleSave: () => {
      if (saved.includes(dish.id)) return unsave(dish.id);
      if (!roomFor(dish.id)) return setNotice({ kind: 'limit' });
      setSaved((s) => [...s, dish.id]);
      queue({ k: 'save', dish: dish.id });
    },
    removeSaved: unsave,
    cookFromSaved: (id) => {
      if (!isPro && allDishes.find((d) => d.id === id)?.premium) return setNotice({ kind: 'pro' });
      setCookDishId(id);
      setCookStep(0);
      countYes();
      setMode('committed');
      setTab('tonight');
    },
    startCooking: () => {
      setCookStep(0);
      setMode('cooking');
    },
    stopCooking: () => setMode('committed'),
    cookNext: () => {
      if (cookStep >= cookSteps.length - 1) setMode('cookdone');
      else setCookStep((s) => s + 1);
    },
    cookBack: () => setCookStep((s) => Math.max(0, s - 1)),
    cookRestart: () => {
      setCookStep(0);
      setMode('cooking');
    },
    cookLogIt: () => {
      const at = new Date().toISOString();
      setLog((l) => [{ custom: true, dishId: cookDish.id, at }, ...l]);
      queue({ k: 'log', dish: cookDish.id, at });
      setMode('verdict');
      setCookStep(0);
      setTab('log');
    },
    addCustomDish: (name, mins, pans2, note, steps) => {
      if (!roomFor()) {
        setNotice({ kind: 'limit' });
        return false;
      }
      if (!isPro) steps = [];
      const id = newRecordId();
      setCustomDishes((c) => [...c, makeCustomDish(id, name, mins, pans2, note, steps)]);
      setSaved((s) => [...s, id]);
      queue({ k: 'dish', id, name, time: mins, pans2, note, steps });
      queue({ k: 'save', dish: id });
      return true;
    },
    editCustomDish: (id, name, mins, pans2, note, steps) => {
      const prev = customDishes.find((d) => d.id === id);
      if (!prev) return;
      // Without Pro the steps stay as they were.
      if (!isPro) steps = prev.steps || [];
      setCustomDishes((c) => c.map((d) => (d.id === id ? makeCustomDish(id, name, mins, pans2, note, steps) : d)));
      queue({ k: 'dishEdit', id, name, time: mins, pans2, note, steps });
    },
    showPro: () => setNotice({ kind: 'pro' }),
    checkRoom: () => {
      if (roomFor()) return true;
      setNotice({ kind: 'limit' });
      return false;
    },
    goToVerdict: () => {
      setTab('tonight');
      setMode('verdict');
    },
    openAuth: () => {
      setNotice(null);
      setAuthOpen(true);
    },
    closeAuth: () => setAuthOpen(false),
    signIn: (email, password) => authWith(email, password, false),
    signUp: (email, password) => authWith(email, password, true),
    signOut: () => {
      endSession();
      setTab('tonight');
      setMode('verdict');
    },
    dismissNotice: () => setNotice(null),
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const s = useContext(StoreContext);
  if (!s) throw new Error('useStore outside provider');
  return s;
}

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dishes as baseDishes, steps as baseSteps, Dish, Step } from '../data/dishes';
import { ui, seedLog, Lang, UIStrings } from '../data/strings';
import { cancelDailyNudge, scheduleDailyNudge } from '../notifications';

export type Tab = 'tonight' | 'saved' | 'log' | 'you';
export type Mode = 'verdict' | 'committed' | 'optout' | 'cooking' | 'cookdone';

export type LogEntry = { seed: number } | { custom: true; dishId: string };

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
};

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
  addCustomDish: (name: string, mins: number, pans2: boolean, note: string) => void;
  goToVerdict: () => void;
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
  const [cookDishId, setCookDishId] = useState('cacio');
  const [cookStep, setCookStep] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const p: Partial<PersistedState> = JSON.parse(raw);
          if (p.saved) setSaved(p.saved);
          if (p.customDishes) setCustomDishes(p.customDishes);
          if (p.log) setLog(p.log);
          if (p.maxTime != null) setMaxTimeState(p.maxTime);
          if (p.noFish != null) setNoFish(p.noFish);
          if (p.breakRotation != null) setBreakRotation(p.breakRotation);
          if (p.askEarly != null) setAskEarly(p.askEarly);
          if (p.lang) setLangState((scenario[2] as Lang) || p.lang);
          if (p.totalRerolls != null) setTotalRerolls(p.totalRerolls);
          if (p.totalYeses != null) setTotalYeses(p.totalYeses);
        }
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const data: PersistedState = {
      saved, customDishes, log, maxTime, noFish, breakRotation, askEarly, lang, totalRerolls, totalYeses,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [hydrated, saved, customDishes, log, maxTime, noFish, breakRotation, askEarly, lang, totalRerolls, totalYeses]);

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
  const allDishes = useMemo(() => [...baseDishes, ...customDishes], [customDishes]);

  const pool = useMemo(() => {
    let p = allDishes.filter((d) => d.time <= maxTime && (!noFish || !d.fish));
    if (breakRotation) {
      const fresh = p.filter((d) => d.statusNew);
      if (fresh.length) p = fresh;
    }
    return p.length ? p : allDishes;
  }, [allDishes, maxTime, noFish, breakRotation]);

  const dish = pool[vIdx % pool.length];
  const cookDish = allDishes.find((d) => d.id === cookDishId) || allDishes[0];

  const stepsFor = useCallback(
    (id: string): Step[] => {
      if (baseSteps[id]) return baseSteps[id];
      return [{ t: ui.en.customStepT, d: ui.en.customStepD, tc: ui.cs.customStepT, dc: ui.cs.customStepD }];
    },
    []
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
  }, [pool.length]);

  const stats = useMemo(() => {
    const yeses = totalYeses;
    const rerolls = totalRerolls;
    const newDishes = customDishes.length;
    const acceptPct = yeses + rerolls ? Math.round((yeses / (yeses + rerolls)) * 100) : 0;
    return { yeses, rerolls, newDishes, acceptPct };
  }, [totalYeses, totalRerolls, customDishes.length]);

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
      setTotalYeses((y) => y + 1);
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
      setSaved((s) => (s.includes(dish.id) ? s.filter((x) => x !== dish.id) : [...s, dish.id]));
    },
    removeSaved: (id) => setSaved((s) => s.filter((x) => x !== id)),
    cookFromSaved: (id) => {
      setCookDishId(id);
      setCookStep(0);
      setTotalYeses((y) => y + 1);
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
      setLog((l) => [{ custom: true, dishId: cookDish.id }, ...l]);
      setMode('verdict');
      setCookStep(0);
      setTab('log');
    },
    addCustomDish: (name, mins, pans2, note) => {
      const id = 'c' + Date.now();
      const d: Dish = {
        id,
        name,
        time: mins,
        pans2,
        statusNew: true,
        missKey: null,
        fish: false,
        custom: true,
        dry: note || ui.en.defaultNote,
        plain: note || ui.en.defaultNote,
        cs: { name, dry: note || ui.cs.defaultNote, plain: note || ui.cs.defaultNote, miss: 'Nic nechybí' },
        missEn: 'Nothing missing',
      };
      setCustomDishes((c) => [...c, d]);
      setSaved((s) => [...s, id]);
    },
    goToVerdict: () => {
      setTab('tonight');
      setMode('verdict');
    },
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const s = useContext(StoreContext);
  if (!s) throw new Error('useStore outside provider');
  return s;
}

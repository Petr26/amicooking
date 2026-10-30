import { ClientResponseError } from 'pocketbase';
import { pb, isLimitError, isNetworkError } from '../api/pb';
import { Dish, Step } from '../data/dishes';
import { ui, Lang } from '../data/strings';

// Signed-in users: every change is applied locally first and queued here as an op.
// The queue (outbox) is persisted and flushed in order; the server is the source of
// truth and gets pulled after the queue drains.
export type Op =
  | { k: 'save'; dish: string }
  | { k: 'unsave'; dish: string }
  | { k: 'dish'; id: string; name: string; time: number; pans2: boolean; note: string; steps: Step[] }
  | { k: 'dishEdit'; id: string; name: string; time: number; pans2: boolean; note: string; steps: Step[] }
  | { k: 'log'; dish: string; at: string }
  | { k: 'settings'; settings: Settings }
  | { k: 'counters'; rerolls: number; yeses: number };

export type Settings = { maxTime: number; noFish: boolean; breakRotation: boolean; askEarly: boolean; lang: Lang };

export type LogEntry = { seed: number } | { custom: true; dishId: string; at?: string };

export function makeCustomDish(id: string, name: string, mins: number, pans2: boolean, note: string, steps: Step[] = []): Dish {
  return {
    id,
    steps,
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
}

// Consecutive counter ops collapse into one so a reroll spree is a single request.
export function enqueueOp(queue: Op[], op: Op): Op[] {
  const last = queue[queue.length - 1];
  if (op.k === 'counters' && last?.k === 'counters') {
    return [...queue.slice(0, -1), { k: 'counters', rerolls: last.rerolls + op.rerolls, yeses: last.yeses + op.yeses }];
  }
  if (op.k === 'settings' && last?.k === 'settings') return [...queue.slice(0, -1), op];
  return [...queue, op];
}

async function send(op: Op, userId: string) {
  switch (op.k) {
    case 'save':
      return pb.collection('saved').create({ user: userId, dish: op.dish });
    case 'unsave': {
      const rows = await pb.collection('saved').getFullList({ filter: pb.filter('dish = {:d}', { d: op.dish }) });
      for (const r of rows) await pb.collection('saved').delete(r.id);
      return;
    }
    case 'dish':
      return pb.collection('user_dishes').create({ id: op.id, user: userId, name: op.name, time: op.time, pans2: op.pans2, note: op.note, steps: op.steps });
    case 'dishEdit':
      return pb.collection('user_dishes').update(op.id, { name: op.name, time: op.time, pans2: op.pans2, note: op.note, steps: op.steps });
    case 'log':
      return pb.collection('log_entries').create({ user: userId, dish: op.dish, kind: 'cooked', at: op.at });
    case 'settings':
      return pb.collection('users').update(userId, { settings: op.settings });
    case 'counters':
      return pb.collection('users').update(userId, { 'total_rerolls+': op.rerolls, 'total_yeses+': op.yeses });
  }
}

// Sends queued ops in order. Stops at the first network failure (the rest stays queued);
// ops the server rejects are dropped — the following pull puts local state right again.
export async function flush(queue: Op[], userId: string): Promise<{ remaining: Op[]; limited: number }> {
  let limited = 0;
  for (let i = 0; i < queue.length; i++) {
    try {
      await send(queue[i], userId);
    } catch (e) {
      if (isNetworkError(e)) return { remaining: queue.slice(i), limited };
      if (e instanceof ClientResponseError && e.status === 401) return { remaining: queue.slice(i), limited };
      if (isLimitError(e)) limited++;
      // Duplicate saves (unique index) and other 4xx: nothing to retry.
    }
  }
  return { remaining: [], limited };
}

export type Remote = {
  user: Record<string, any>;
  saved: string[];
  customDishes: Dish[];
  log: LogEntry[];
  settings: Settings | null;
  totalRerolls: number;
  totalYeses: number;
};

export async function pull(userId: string): Promise<Remote> {
  const [user, saved, dishes, log] = await Promise.all([
    pb.collection('users').getOne(userId),
    pb.collection('saved').getFullList({ sort: 'created' }),
    pb.collection('user_dishes').getFullList({ sort: 'created' }),
    pb.collection('log_entries').getFullList({ sort: '-at' }),
  ]);
  const s = user.settings && typeof user.settings === 'object' && 'lang' in user.settings ? (user.settings as Settings) : null;
  return {
    user,
    saved: saved.map((r) => r.dish),
    customDishes: dishes.map((r) => makeCustomDish(r.id, r.name, r.time, r.pans2, r.note, Array.isArray(r.steps) ? r.steps : [])),
    log: log.map((r) => ({ custom: true as const, dishId: r.dish, at: r.at })),
    settings: s,
    totalRerolls: user.total_rerolls || 0,
    totalYeses: user.total_yeses || 0,
  };
}

// First sign-in on this phone: everything collected anonymously goes up to the account.
// Custom dishes go before saves (the server only accepts saves of dishes it knows).
export function mergeOps(local: {
  saved: string[];
  customDishes: Dish[];
  log: LogEntry[];
  totalRerolls: number;
  totalYeses: number;
}): Op[] {
  const ops: Op[] = [];
  for (const d of local.customDishes) {
    ops.push({ k: 'dish', id: d.id, name: d.name, time: d.time, pans2: d.pans2, note: d.dry === ui.en.defaultNote ? '' : d.dry, steps: d.steps || [] });
  }
  for (const id of local.saved) ops.push({ k: 'save', dish: id });
  for (const e of [...local.log].reverse()) {
    if ('custom' in e) ops.push({ k: 'log', dish: e.dishId, at: e.at || new Date().toISOString() });
  }
  if (local.totalRerolls || local.totalYeses) ops.push({ k: 'counters', rerolls: local.totalRerolls, yeses: local.totalYeses });
  return ops;
}

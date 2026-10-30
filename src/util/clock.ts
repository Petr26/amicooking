import type { Lang } from '../data/strings';

export function fmtHM(d: Date = new Date()): string {
  return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
}

const DAYS: Record<Lang, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  cs: ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
};

// Live version of the "Solo · Tue 19:04" header meta.
export function headerMeta(lang: Lang, at: number = Date.now()): string {
  const d = new Date(at);
  const solo = lang === 'cs' ? 'Sólo' : 'Solo';
  return solo + ' · ' + DAYS[lang][d.getDay()] + ' ' + fmtHM(d);
}

export function mmss(totalSecs: number): string {
  const m = Math.floor(totalSecs / 60);
  const r = totalSecs % 60;
  return m + ':' + (r < 10 ? '0' : '') + r;
}

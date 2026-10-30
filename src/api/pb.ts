import PocketBase, { AsyncAuthStore, ClientResponseError } from 'pocketbase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend: PocketBase on the Forpsi VPS (see backend/). Override for local dev with
// EXPO_PUBLIC_API_URL=http://127.0.0.1:8090.
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.amicooking.com';
export const AUTH_KEY = 'amicooking:auth';

export const pb = new PocketBase(
  API_URL,
  new AsyncAuthStore({
    save: (s) => AsyncStorage.setItem(AUTH_KEY, s),
    clear: () => AsyncStorage.removeItem(AUTH_KEY),
  })
);
pb.autoCancellation(false);

// Restores the saved session; the store waits for this before reading pb.authStore.
export async function restoreAuth() {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  if (!raw) return;
  try {
    const { token, record } = JSON.parse(raw);
    if (token) pb.authStore.save(token, record);
  } catch {}
}

export type Limits = { anon: number; free: number; pro: number };
export const defaultLimits: Limits = { anon: 10, free: 25, pro: 500 };

export async function fetchLimits(): Promise<Limits> {
  const res = await pb.send<{ limits: Limits }>('/api/amicooking/config', {});
  return { ...defaultLimits, ...res.limits };
}

export type Plan = 'free' | 'pro';
export function planOf(user: Record<string, any> | null): Plan {
  if (!user || user.plan !== 'pro') return 'free';
  if (!user.plan_expires) return 'pro';
  return new Date(user.plan_expires).getTime() > Date.now() ? 'pro' : 'free';
}

// status 0 = no response (offline, DNS, timeout) — worth retrying later.
export const isNetworkError = (e: unknown) => e instanceof ClientResponseError && e.status === 0;
export const isLimitError = (e: unknown) => e instanceof ClientResponseError && e.status === 403 && e.message === 'dish_limit';

export type AuthError = 'bad' | 'net' | 'taken' | 'short' | 'email';
export function authErrorOf(e: unknown): AuthError {
  if (!(e instanceof ClientResponseError) || e.status === 0) return 'net';
  const data = e.response?.data || {};
  if (data.email?.code === 'validation_not_unique') return 'taken';
  if (data.email) return 'email';
  if (data.password) return 'short';
  return e.status >= 500 ? 'net' : 'bad';
}

// PocketBase record ids: 15 chars of [a-z0-9]. Custom dishes get one up front so the
// same id works locally and on the server.
export function newRecordId() {
  const abc = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 15; i++) id += abc[Math.floor(Math.random() * abc.length)];
  return id;
}

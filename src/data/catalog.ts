import AsyncStorage from '@react-native-async-storage/async-storage';
import { pb } from '../api/pb';
import { dishes as bundledDishes, steps as bundledSteps, Dish, Step } from './dishes';

// Base dishes live in the backend (`dishes` collection). The last good copy is cached
// on the phone; the bundled set is only the first-launch / offline fallback.
export type Catalog = { dishes: Dish[]; steps: Record<string, Step[]> };

const CACHE_KEY = 'amicooking:catalog:v1';

export const bundledCatalog: Catalog = { dishes: bundledDishes, steps: bundledSteps };

export async function loadCachedCatalog(): Promise<Catalog | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    const c: Catalog | null = raw ? JSON.parse(raw) : null;
    return c && c.dishes?.length ? c : null;
  } catch {
    return null;
  }
}

export async function fetchCatalog(): Promise<Catalog> {
  const rows = await pb.collection('dishes').getFullList({ sort: 'sort,name_en' });
  const catalog: Catalog = { dishes: [], steps: {} };
  for (const r of rows) {
    catalog.dishes.push({
      id: r.slug,
      name: r.name_en,
      time: r.time,
      pans2: r.pans2,
      statusNew: r.status_new,
      missKey: null,
      fish: r.fish,
      dry: r.dry_en,
      plain: r.plain_en,
      cs: { name: r.name_cs, dry: r.dry_cs, plain: r.plain_cs, miss: r.miss_cs },
      missEn: r.miss_en,
    });
    if (Array.isArray(r.steps) && r.steps.length) catalog.steps[r.slug] = r.steps;
  }
  if (catalog.dishes.length) await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(catalog)).catch(() => {});
  return catalog;
}

import data from '../data/products.json';
import type { Product, Variant } from './types';

export const products = data as Product[];

export interface Collection {
  handle: string;
  title: string;
  intro: string;
  image: string | null;
  filter: (p: Product) => boolean;
}

export const CATEGORIES: Collection[] = [
  { handle: 'hundemaentel', title: 'Hundemäntel', intro: 'Mäntel und Westen für kalte, nasse und windige Tage.', image: 'images/steppjacke-beagle.jpg', filter: (p) => p.category === 'hundemaentel' },
  { handle: 'pfotenschutz', title: 'Pfotenschutz', intro: 'Schuhe, Socken und Pflege für Wege mit Schnee und Streusalz.', image: 'images/pfotenabdruck-schnee.jpg', filter: (p) => p.category === 'pfotenschutz' },
  { handle: 'winter-overalls', title: 'Winter-Overalls', intro: 'Overalls, die auch die Beine bedecken.', image: 'images/ganzkoerperanzug.jpg', filter: (p) => p.category === 'winter-overalls' },
  { handle: 'winterzubehoer', title: 'Winterzubehör', intro: 'Pullover, Licht, Leinen und alles für danach.', image: 'images/strickpullover-yorkies.jpg', filter: (p) => p.category === 'winterzubehoer' },
];

export const collections: Collection[] = [
  { handle: 'all', title: 'Winterkollektion', intro: 'Alle Winterbegleiter für deinen Hund auf einen Blick.', image: 'images/hund-schneejacke.jpg', filter: () => true },
  ...CATEGORIES,
];

export const findCollection = (handle: string) => collections.find((c) => c.handle === handle);
export const findProduct = (handle: string) => products.find((p) => p.handle === handle);
export const categoryTitle = (handle: string) => CATEGORIES.find((c) => c.handle === handle)?.title ?? '';

export const isAvailable = (p: Product) => p.variants.some((v) => v.available);
export const firstAvailableVariant = (p: Product): Variant => p.variants.find((v) => v.available) ?? p.variants[0];
export const minPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));
export const minPriceVariant = (p: Product) => p.variants.reduce((a, b) => (b.price < a.price ? b : a));
export const hasPriceRange = (p: Product) => new Set(p.variants.map((v) => v.price)).size > 1;

/** Finds the variant matching the selected option values (one per product option). */
export function findVariant(p: Product, selected: string[]): Variant | undefined {
  return p.variants.find((v) => v.options.every((o, i) => o === selected[i]));
}

export const optionValues = (p: Product, name: string) => p.options.find((o) => o.name === name)?.values ?? [];

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc';
export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Empfohlen' },
  { key: 'price-asc', label: 'Preis aufsteigend' },
  { key: 'price-desc', label: 'Preis absteigend' },
  { key: 'title-asc', label: 'Name A–Z' },
  { key: 'title-desc', label: 'Name Z–A' },
];

export interface Filters {
  inStockOnly: boolean;
  categories: string[];
  colors: string[];
  sizes: string[];
  maxPrice: number | null; // cents
}

export const emptyFilters: Filters = { inStockOnly: false, categories: [], colors: [], sizes: [], maxPrice: null };

export function applyFilters(list: Product[], f: Filters): Product[] {
  return list.filter((p) => {
    if (f.inStockOnly && !isAvailable(p)) return false;
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.maxPrice != null && minPrice(p) > f.maxPrice) return false;
    if (f.colors.length && !f.colors.some((c) => optionValues(p, 'Farbe').includes(c))) return false;
    if (f.sizes.length && !f.sizes.some((s) => optionValues(p, 'Größe').includes(s))) return false;
    return true;
  });
}

export function sortProducts(list: Product[], key: SortKey): Product[] {
  const out = [...list];
  const rank = (p: Product) => p.featuredRank ?? 999;
  switch (key) {
    case 'price-asc':
      return out.sort((a, b) => minPrice(a) - minPrice(b));
    case 'price-desc':
      return out.sort((a, b) => minPrice(b) - minPrice(a));
    case 'title-asc':
      return out.sort((a, b) => a.title.localeCompare(b.title, 'de'));
    case 'title-desc':
      return out.sort((a, b) => b.title.localeCompare(a.title, 'de'));
    default:
      return out.sort((a, b) => rank(a) - rank(b));
  }
}

const normalize = (s: string) =>
  s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ');
const stripHtml = (s: string) => s.replace(/<[^>]+>/g, ' ');

/** Ranked search: every query word must match title, category, tags, options or description. */
export function searchProducts(query: string, list: Product[] = products): Product[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: { p: Product; score: number }[] = [];
  for (const p of list) {
    const title = normalize(p.title);
    const meta = normalize([categoryTitle(p.category), ...p.tags, ...p.options.flatMap((o) => o.values)].join(' '));
    const desc = normalize(`${p.summary} ${stripHtml(p.descriptionHtml)}`);
    let score = 0;
    let ok = true;
    for (const w of words) {
      if (title.includes(w)) score += 10;
      else if (meta.includes(w)) score += 4;
      else if (desc.includes(w)) score += 1;
      else ok = false;
    }
    if (ok) scored.push({ p, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.p);
}

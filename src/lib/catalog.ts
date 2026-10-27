import data from '../data/products.json';
import type { Product, Variant } from './types';

export const products = data as Product[];

export interface Collection {
  handle: string;
  title: string;
  subtitle: string;
  filter: (p: Product) => boolean;
  defaultSort: SortKey;
}

export const collections: Collection[] = [
  { handle: 'all', title: 'Poedagar Watches', subtitle: '2026 Collection', filter: () => true, defaultSort: 'featured' },
  { handle: 'best-sellers', title: 'Best Sellers', subtitle: "Our customers' favorite watches", filter: (p) => p.bestsellerRank != null, defaultSort: 'best-selling' },
];

export const findCollection = (handle: string) => collections.find((c) => c.handle === handle);
export const findProduct = (handle: string) => products.find((p) => p.handle === handle);

export const isAvailable = (p: Product) => p.variants.some((v) => v.available);
export const firstAvailableVariant = (p: Product): Variant => p.variants.find((v) => v.available) ?? p.variants[0];
export const minPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));
export const minPriceVariant = (p: Product) => p.variants.reduce((a, b) => (b.price < a.price ? b : a));
export const discountPercent = (v: Variant) =>
  v.compareAtPrice && v.compareAtPrice > v.price ? Math.round((1 - v.price / v.compareAtPrice) * 100) : 0;

// Colour families are derived from the variant names of the reference data.
export const COLOR_FAMILIES = ['Black', 'Blue', 'Green', 'White', 'Silver', 'Gold', 'Rose Gold', 'Grey'] as const;
export type ColorFamily = (typeof COLOR_FAMILIES)[number];

export function colorFamilies(p: Product): ColorFamily[] {
  const found = new Set<ColorFamily>();
  for (const v of p.variants) {
    const t = v.title.toLowerCase();
    if (/black|noir/.test(t)) found.add('Black');
    if (/blue|bleu/.test(t)) found.add('Blue');
    if (/green|vert/.test(t)) found.add('Green');
    if (/white|blanc/.test(t)) found.add('White');
    if (/silver|argent|money/.test(t)) found.add('Silver');
    if (/rose/.test(t)) found.add('Rose Gold');
    else if (/gold|\bor\b/.test(t)) found.add('Gold');
    if (/gr[ae]y/.test(t)) found.add('Grey');
  }
  if (/rose gold/i.test(p.title)) found.add('Rose Gold');
  return [...found];
}

export type SortKey = 'featured' | 'best-selling' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc' | 'discount';
export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'best-selling', label: 'Best selling' },
  { key: 'price-asc', label: 'Price, low to high' },
  { key: 'price-desc', label: 'Price, high to low' },
  { key: 'title-asc', label: 'Alphabetically, A-Z' },
  { key: 'title-desc', label: 'Alphabetically, Z-A' },
  { key: 'discount', label: 'Biggest discount' },
];

export interface Filters {
  inStockOnly: boolean;
  colors: ColorFamily[];
  maxPrice: number | null; // cents
}

export const emptyFilters: Filters = { inStockOnly: false, colors: [], maxPrice: null };

export function applyFilters(list: Product[], f: Filters): Product[] {
  return list.filter((p) => {
    if (f.inStockOnly && !isAvailable(p)) return false;
    if (f.maxPrice != null && minPrice(p) > f.maxPrice) return false;
    if (f.colors.length) {
      const fam = colorFamilies(p);
      if (!f.colors.some((c) => fam.includes(c))) return false;
    }
    return true;
  });
}

export function sortProducts(list: Product[], key: SortKey): Product[] {
  const out = [...list];
  const rank = (p: Product) => p.bestsellerRank ?? 999;
  switch (key) {
    case 'best-selling':
      return out.sort((a, b) => rank(a) - rank(b));
    case 'price-asc':
      return out.sort((a, b) => minPrice(a) - minPrice(b));
    case 'price-desc':
      return out.sort((a, b) => minPrice(b) - minPrice(a));
    case 'title-asc':
      return out.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return out.sort((a, b) => b.title.localeCompare(a.title));
    case 'discount':
      return out.sort((a, b) => discountPercent(minPriceVariant(b)) - discountPercent(minPriceVariant(a)));
    default:
      return out; // source order of the reference catalogue
  }
}

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ');
const stripHtml = (s: string) => s.replace(/<[^>]+>/g, ' ');

/** Simple ranked search: every query word must match title, variant names or description. */
export function searchProducts(query: string, list: Product[] = products): Product[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: { p: Product; score: number }[] = [];
  for (const p of list) {
    const title = normalize(p.title);
    const variants = normalize(p.variants.map((v) => v.title).join(' '));
    const desc = normalize(stripHtml(p.descriptionHtml));
    let score = 0;
    let ok = true;
    for (const w of words) {
      if (title.includes(w)) score += 10;
      else if (variants.includes(w)) score += 4;
      else if (desc.includes(w)) score += 1;
      else ok = false;
    }
    if (ok) scored.push({ p, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.p);
}

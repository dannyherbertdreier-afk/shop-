import type { CartLine, Product, ResolvedLine } from './types';

/**
 * "Buy 1, Get 1 Free" promotion as advertised by the reference store:
 * all units in the cart are sorted by price and every second (cheaper) unit is free.
 */
export const PROMO_LABEL = 'Buy 1, Get 1 Free';

export function bogoDiscount(unitPrices: number[]): number {
  const sorted = [...unitPrices].sort((a, b) => b - a);
  return sorted.reduce((sum, price, i) => (i % 2 === 1 ? sum + price : sum), 0);
}

export const FREE_SHIPPING = 0;

export function resolveLines(lines: CartLine[], products: Product[]): ResolvedLine[] {
  const byHandle = new Map(products.map((p) => [p.handle, p]));
  const out: ResolvedLine[] = [];
  for (const line of lines) {
    const product = byHandle.get(line.handle);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (!product || !variant || line.quantity < 1) continue;
    out.push({ ...line, product, variant, lineTotal: variant.price * line.quantity });
  }
  return out;
}

export interface Totals {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  compareAtSavings: number;
}

export function computeTotals(lines: ResolvedLine[], shipping = FREE_SHIPPING): Totals {
  const units: number[] = [];
  let compareAtSavings = 0;
  for (const l of lines) {
    for (let i = 0; i < l.quantity; i++) units.push(l.variant.price);
    if (l.variant.compareAtPrice && l.variant.compareAtPrice > l.variant.price) {
      compareAtSavings += (l.variant.compareAtPrice - l.variant.price) * l.quantity;
    }
  }
  const subtotal = units.reduce((a, b) => a + b, 0);
  const discount = bogoDiscount(units);
  const ship = units.length ? shipping : 0;
  return { itemCount: units.length, subtotal, discount, shipping: ship, total: subtotal - discount + ship, compareAtSavings };
}

/** Price of a bundle of variants on its own (used for the offer boxes on the product page). */
export function bundlePrice(prices: number[]) {
  return prices.reduce((a, b) => a + b, 0) - bogoDiscount(prices);
}

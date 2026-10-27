import type { CartLine, Product, ResolvedLine } from './types';

// Shipping costs are not defined yet (no supplier/carrier chosen), so the demo charges none
// and the UI says so explicitly instead of advertising free shipping.
export const SHIPPING_DEFINED = false;

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
}

export function computeTotals(lines: ResolvedLine[]): Totals {
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  return { itemCount, subtotal, discount: 0, shipping: 0, total: subtotal };
}

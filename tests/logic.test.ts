import { describe, expect, it } from 'vitest';
import { bogoDiscount, bundlePrice, computeTotals, resolveLines } from '../src/lib/pricing';
import { applyFilters, emptyFilters, products, searchProducts, sortProducts, minPrice, colorFamilies } from '../src/lib/catalog';
import { validateAddress, validateEmail } from '../src/lib/validation';

describe('Buy 1, Get 1 Free pricing', () => {
  it('makes every second (cheaper) unit free', () => {
    expect(bogoDiscount([]) ).toBe(0);
    expect(bogoDiscount([1000])).toBe(0);
    expect(bogoDiscount([1000, 1000])).toBe(1000);
    expect(bogoDiscount([5000, 3000, 4000])).toBe(4000); // 5000 paid, 4000 free, 3000 paid
    expect(bogoDiscount([100, 200, 300, 400])).toBe(300 + 100);
  });

  it('prices bundles like the reference offers', () => {
    expect(bundlePrice([11995, 11995])).toBe(11995); // "Buy 1, get 1 free" = 119,95 €
    expect(bundlePrice([11995, 11995, 11995, 11995])).toBe(23990); // "Buy 2, get 2 free" = 239,90 €
  });

  it('computes cart totals from real product data', () => {
    const p = products.find((x) => x.handle === 'poedagar-8051')!;
    const v = p.variants[0];
    const lines = resolveLines([{ handle: p.handle, variantId: v.id, quantity: 3 }], products);
    const t = computeTotals(lines);
    expect(t.itemCount).toBe(3);
    expect(t.subtotal).toBe(v.price * 3);
    expect(t.discount).toBe(v.price);
    expect(t.total).toBe(v.price * 2);
  });

  it('drops cart lines whose product or variant no longer exists', () => {
    const lines = resolveLines([{ handle: 'does-not-exist', variantId: '1', quantity: 1 }], products);
    expect(lines).toHaveLength(0);
    expect(computeTotals(lines).total).toBe(0);
  });
});

describe('catalog', () => {
  it('has the 33 imported products with prices', () => {
    expect(products).toHaveLength(33);
    for (const p of products) {
      expect(p.variants.length).toBeGreaterThan(0);
      for (const v of p.variants) expect(v.price).toBeGreaterThan(0);
    }
  });

  it('searches titles, variants and descriptions', () => {
    expect(searchProducts('oak').map((p) => p.handle)).toContain('poedagar-kings-oak');
    expect(searchProducts('8051')[0].handle).toMatch(/8051/);
    expect(searchProducts('zzzz-nothing')).toHaveLength(0);
    expect(searchProducts('   ')).toHaveLength(0);
  });

  it('filters by stock, colour and price', () => {
    expect(applyFilters(products, { ...emptyFilters, inStockOnly: true }).map((p) => p.handle)).not.toContain('armor-dive-s2-watch');
    const green = applyFilters(products, { ...emptyFilters, colors: ['Green'] });
    expect(green.length).toBeGreaterThan(0);
    green.forEach((p) => expect(colorFamilies(p)).toContain('Green'));
    applyFilters(products, { ...emptyFilters, maxPrice: 7000 }).forEach((p) => expect(minPrice(p)).toBeLessThanOrEqual(7000));
  });

  it('sorts by price', () => {
    const asc = sortProducts(products, 'price-asc').map(minPrice);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
  });
});

describe('validation', () => {
  const ok = { firstName: 'Max', lastName: 'Muster', address1: 'Hauptstr. 1', address2: '', zip: '10115', city: 'Berlin', country: 'DE', phone: '' };
  it('accepts a valid German address', () => expect(validateAddress(ok)).toEqual({}));
  it('rejects a bad postal code and missing fields', () => {
    const e = validateAddress({ ...ok, zip: '1011', firstName: ' ' });
    expect(e.zip).toBeDefined();
    expect(e.firstName).toBeDefined();
  });
  it('validates emails', () => {
    expect(validateEmail('a@b.de')).toBeUndefined();
    expect(validateEmail('a@b')).toBeDefined();
    expect(validateEmail('')).toBeDefined();
  });
});

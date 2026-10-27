import { describe, expect, it } from 'vitest';
import { computeTotals, resolveLines } from '../src/lib/pricing';
import { applyFilters, CATEGORIES, emptyFilters, findVariant, minPrice, optionValues, products, searchProducts, sortProducts } from '../src/lib/catalog';
import { validateAddress, validateEmail } from '../src/lib/validation';

describe('sample catalogue', () => {
  it('contains only marked dog winter sample products', () => {
    expect(products.length).toBeGreaterThanOrEqual(8);
    for (const p of products) {
      expect(p.isExample).toBe(true);
      expect(CATEGORIES.map((c) => c.handle)).toContain(p.category);
      for (const v of p.variants) {
        expect(v.price).toBeGreaterThan(0);
        expect(v.compareAtPrice).toBeNull(); // no strike-through prices
        expect(v.options).toHaveLength(p.options.length);
      }
    }
  });

  it('has products in every category', () => {
    for (const c of CATEGORIES) expect(products.filter(c.filter).length).toBeGreaterThan(0);
  });

  it('has no leftover watch content', () => {
    const text = JSON.stringify(products).toLowerCase();
    expect(text).not.toMatch(/poedagar|uhr|watch/);
  });

  it('finds a variant from option values', () => {
    const p = products.find((x) => x.handle === 'wintermantel-nordwind')!;
    const v = findVariant(p, ['Anthrazit', 'M'])!;
    expect(v.title).toBe('Anthrazit / M');
  });
});

describe('cart totals', () => {
  it('sums line totals without discounts or shipping', () => {
    const p = products[0];
    const lines = resolveLines([{ handle: p.handle, variantId: p.variants[0].id, quantity: 3 }], products);
    const t = computeTotals(lines);
    expect(t.itemCount).toBe(3);
    expect(t.subtotal).toBe(p.variants[0].price * 3);
    expect(t.total).toBe(t.subtotal);
    expect(t.discount).toBe(0);
  });

  it('drops lines whose product or variant no longer exists', () => {
    expect(resolveLines([{ handle: 'gibt-es-nicht', variantId: '1', quantity: 1 }], products)).toHaveLength(0);
  });
});

describe('search, filter, sort', () => {
  it('searches titles, categories, tags and umlauts', () => {
    expect(searchProducts('mantel').map((p) => p.handle)).toContain('wintermantel-nordwind');
    expect(searchProducts('pfotenschutz').length).toBeGreaterThan(0);
    expect(searchProducts('Hundemäntel').length).toBeGreaterThan(0);
    expect(searchProducts('streusalz').map((p) => p.handle)).toContain('pfotenschuhe-trail');
    expect(searchProducts('xyzxyz')).toHaveLength(0);
    expect(searchProducts('  ')).toHaveLength(0);
  });

  it('filters by category, size, colour and price', () => {
    applyFilters(products, { ...emptyFilters, categories: ['pfotenschutz'] }).forEach((p) => expect(p.category).toBe('pfotenschutz'));
    applyFilters(products, { ...emptyFilters, sizes: ['XS'] }).forEach((p) => expect(optionValues(p, 'Größe')).toContain('XS'));
    applyFilters(products, { ...emptyFilters, colors: ['Waldgrün'] }).forEach((p) => expect(optionValues(p, 'Farbe')).toContain('Waldgrün'));
    applyFilters(products, { ...emptyFilters, maxPrice: 3000 }).forEach((p) => expect(minPrice(p)).toBeLessThanOrEqual(3000));
  });

  it('sorts by price', () => {
    const asc = sortProducts(products, 'price-asc').map(minPrice);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
  });
});

describe('validation', () => {
  const ok = { firstName: 'Max', lastName: 'Muster', address1: 'Hauptstr. 1', address2: '', zip: '10115', city: 'Berlin', country: 'DE', phone: '' };
  it('accepts a valid German address', () => expect(validateAddress(ok)).toEqual({}));
  it('rejects a bad postal code and missing fields (German messages)', () => {
    const e = validateAddress({ ...ok, zip: '1011', firstName: ' ' });
    expect(e.zip).toMatch(/Postleitzahl/);
    expect(e.firstName).toBeDefined();
  });
  it('validates emails', () => {
    expect(validateEmail('a@b.de')).toBeUndefined();
    expect(validateEmail('a@b')).toMatch(/gültige/);
  });
});

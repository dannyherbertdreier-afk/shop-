import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../lib/types';
import { applyFilters, COLOR_FAMILIES, colorFamilies, minPrice, SORT_OPTIONS, sortProducts, type ColorFamily, type Filters, type SortKey } from '../lib/catalog';
import { formatMoney } from '../lib/money';
import { ProductCard } from './ProductCard';
import { IconClose, IconFilter, IconGrid1, IconGrid2 } from './Icons';
import { load, save } from '../lib/storage';

/** Filter / sort / grid toolbar plus product grid. All state lives in the URL query. */
export function ProductListing({ items, defaultSort }: { items: Product[]; defaultSort: SortKey }) {
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const [cols, setCols] = useState<1 | 2>(() => load('demo-shop:grid', 2));
  useEffect(() => save('demo-shop:grid', cols), [cols]);

  const sort = (params.get('sort') as SortKey) || defaultSort;
  const filters: Filters = {
    inStockOnly: params.get('stock') === '1',
    colors: (params.get('color')?.split(',').filter((c) => (COLOR_FAMILIES as readonly string[]).includes(c)) ?? []) as ColorFamily[],
    maxPrice: params.get('max') ? Number(params.get('max')) * 100 : null,
  };

  const priceCeil = useMemo(() => Math.ceil(Math.max(0, ...items.map(minPrice)) / 1000) * 10, [items]);
  const colorCounts = useMemo(() => {
    const m = new Map<ColorFamily, number>();
    items.forEach((p) => colorFamilies(p).forEach((c) => m.set(c, (m.get(c) ?? 0) + 1)));
    return m;
  }, [items]);

  const shown = sortProducts(applyFilters(items, filters), sort);
  const activeCount = (filters.inStockOnly ? 1 : 0) + filters.colors.length + (filters.maxPrice != null ? 1 : 0);

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value == null || value === '') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };
  const toggleColor = (c: ColorFamily) => {
    const set = new Set(filters.colors);
    set.has(c) ? set.delete(c) : set.add(c);
    update('color', [...set].join(','));
  };
  const clear = () => {
    const next = new URLSearchParams(params);
    ['stock', 'color', 'max'].forEach((k) => next.delete(k));
    setParams(next, { replace: true });
  };

  return (
    <>
      <div className="toolbar">
        <button className="toolbar-btn" onClick={() => setDrawer(true)}>
          <IconFilter size={18} /> Filter {activeCount > 0 && <span className="chip-count">{activeCount}</span>}
        </button>
        <label className="sort">
          <span className="visually-hidden">Sort by</span>
          <select value={sort} onChange={(e) => update('sort', e.target.value === defaultSort ? null : e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </label>
        <div className="grid-toggle only-mobile">
          <button aria-label="One column" aria-pressed={cols === 1} onClick={() => setCols(1)}><IconGrid1 size={18} /></button>
          <button aria-label="Two columns" aria-pressed={cols === 2} onClick={() => setCols(2)}><IconGrid2 size={18} /></button>
        </div>
      </div>
      <p className="result-count">{shown.length} {shown.length === 1 ? 'product' : 'products'}</p>

      {shown.length === 0 ? (
        <div className="empty-state">
          <p>No products match these filters.</p>
          <button className="btn" onClick={clear}>Clear filters</button>
        </div>
      ) : (
        <div className={`grid grid-m${cols}`}>
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <div className={`drawer-backdrop ${drawer ? 'show' : ''}`} onClick={() => setDrawer(false)} />
      <aside className={`filter-drawer ${drawer ? 'open' : ''}`} aria-hidden={!drawer} aria-label="Filters">
        <div className="drawer-head">
          <h2>Filter</h2>
          <button className="icon-btn" aria-label="Close filters" onClick={() => setDrawer(false)}><IconClose /></button>
        </div>
        <div className="drawer-body filter-body">
          <fieldset>
            <legend>Availability</legend>
            <label className="check">
              <input type="checkbox" checked={filters.inStockOnly} onChange={(e) => update('stock', e.target.checked ? '1' : null)} />
              In stock only
            </label>
          </fieldset>
          <fieldset>
            <legend>Colour</legend>
            {COLOR_FAMILIES.filter((c) => colorCounts.get(c)).map((c) => (
              <label key={c} className="check">
                <input type="checkbox" checked={filters.colors.includes(c)} onChange={() => toggleColor(c)} />
                {c} <span className="muted">({colorCounts.get(c)})</span>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Maximum price: {filters.maxPrice != null ? formatMoney(filters.maxPrice) : 'any'}</legend>
            <input
              type="range"
              min={50}
              max={priceCeil}
              step={5}
              value={filters.maxPrice != null ? filters.maxPrice / 100 : priceCeil}
              onChange={(e) => update('max', Number(e.target.value) >= priceCeil ? null : e.target.value)}
              aria-label="Maximum price in euros"
            />
          </fieldset>
        </div>
        <div className="drawer-foot two">
          <button className="btn btn-outline" onClick={clear} disabled={!activeCount}>Clear</button>
          <button className="btn" onClick={() => setDrawer(false)}>Show {shown.length} results</button>
        </div>
      </aside>
    </>
  );
}

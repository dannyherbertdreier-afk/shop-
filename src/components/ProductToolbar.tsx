import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDialog } from '../hooks/useDialog';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../lib/types';
import { applyFilters, CATEGORIES, minPrice, optionValues, SORT_OPTIONS, sortProducts, type Filters, type SortKey } from '../lib/catalog';
import { formatMoney } from '../lib/money';
import { ProductCard } from './ProductCard';
import { IconClose, IconFilter, IconGrid1, IconGrid2 } from './Icons';
import { load, save } from '../lib/storage';

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL'];
const listParam = (v: string | null) => v?.split(',').filter(Boolean) ?? [];

function countValues(items: Product[], get: (p: Product) => string[]) {
  const m = new Map<string, number>();
  items.forEach((p) => new Set(get(p)).forEach((v) => m.set(v, (m.get(v) ?? 0) + 1)));
  return m;
}

/** Filter / sort / grid toolbar plus product grid. All state lives in the URL query. */
export function ProductListing({ items, showCategoryFilter = false }: { items: Product[]; showCategoryFilter?: boolean }) {
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const [cols, setCols] = useState<1 | 2>(() => load('demo-shop:grid', 2));
  useEffect(() => save('demo-shop:grid', cols), [cols]);
  const filterPanel = useDialog<HTMLElement>(drawer, () => setDrawer(false));

  const sort = (params.get('sort') as SortKey) || 'featured';
  const filters: Filters = {
    inStockOnly: params.get('stock') === '1',
    categories: listParam(params.get('cat')),
    colors: listParam(params.get('farbe')),
    sizes: listParam(params.get('groesse')),
    maxPrice: params.get('max') ? Number(params.get('max')) * 100 : null,
  };

  const priceCeil = useMemo(() => Math.ceil(Math.max(0, ...items.map(minPrice)) / 1000) * 10, [items]);
  const colorCounts = useMemo(() => countValues(items, (p) => optionValues(p, 'Farbe')), [items]);
  const sizeCounts = useMemo(() => countValues(items, (p) => optionValues(p, 'Größe').filter((s) => SIZE_ORDER.includes(s))), [items]);
  const catCounts = useMemo(() => countValues(items, (p) => [p.category]), [items]);

  const shown = sortProducts(applyFilters(items, filters), sort);
  const activeCount = (filters.inStockOnly ? 1 : 0) + filters.categories.length + filters.colors.length + filters.sizes.length + (filters.maxPrice != null ? 1 : 0);

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value == null || value === '') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };
  const toggle = (key: string, current: string[], value: string) => {
    const set = new Set(current);
    set.has(value) ? set.delete(value) : set.add(value);
    update(key, [...set].join(','));
  };
  const clear = () => {
    const next = new URLSearchParams(params);
    ['stock', 'cat', 'farbe', 'groesse', 'max'].forEach((k) => next.delete(k));
    setParams(next, { replace: true });
  };

  return (
    <>
      <div className="toolbar">
        <button className="toolbar-btn" aria-expanded={drawer} aria-controls="filter-drawer" onClick={() => setDrawer(true)}>
          <IconFilter size={18} /> Filtern {activeCount > 0 && <span className="chip-count">{activeCount}</span>}
        </button>
        <label className="sort">
          <span className="visually-hidden">Sortieren nach</span>
          <select value={sort} onChange={(e) => update('sort', e.target.value === 'featured' ? null : e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </label>
        <div className="grid-toggle only-mobile">
          <button aria-label="Eine Spalte" aria-pressed={cols === 1} onClick={() => setCols(1)}><IconGrid1 size={18} /></button>
          <button aria-label="Zwei Spalten" aria-pressed={cols === 2} onClick={() => setCols(2)}><IconGrid2 size={18} /></button>
        </div>
      </div>
      <p className="result-count">{shown.length} {shown.length === 1 ? 'Produkt' : 'Produkte'}</p>

      {shown.length === 0 ? (
        <div className="empty-state">
          <p>Keine Produkte passen zu diesen Filtern.</p>
          <button className="btn" onClick={clear}>Filter zurücksetzen</button>
        </div>
      ) : (
        <>
        <h2 className="visually-hidden">Produkte</h2>
        <div className={`grid grid-m${cols}`}>
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        </>
      )}

      {createPortal(<>
      <div className={`drawer-backdrop ${drawer ? 'show' : ''}`} onClick={() => setDrawer(false)} />
      <aside ref={filterPanel} id="filter-drawer" className={`filter-drawer ${drawer ? 'open' : ''}`} aria-hidden={!drawer} aria-label="Filter" role="dialog" aria-modal="true">
        <div className="drawer-head">
          <h2>Filtern</h2>
          <button className="icon-btn" aria-label="Filter schließen" onClick={() => setDrawer(false)} data-autofocus><IconClose /></button>
        </div>
        <div className="drawer-body filter-body">
          {showCategoryFilter && (
            <fieldset>
              <legend>Kategorie</legend>
              {CATEGORIES.filter((c) => catCounts.get(c.handle)).map((c) => (
                <label key={c.handle} className="check">
                  <input type="checkbox" checked={filters.categories.includes(c.handle)} onChange={() => toggle('cat', filters.categories, c.handle)} />
                  {c.title} <span className="muted">({catCounts.get(c.handle)})</span>
                </label>
              ))}
            </fieldset>
          )}
          {sizeCounts.size > 0 && (
            <fieldset>
              <legend>Größe</legend>
              <div className="chip-group">
                {SIZE_ORDER.filter((s) => sizeCounts.get(s)).map((s) => (
                  <label key={s} className={`chip ${filters.sizes.includes(s) ? 'on' : ''}`}>
                    <input type="checkbox" className="visually-hidden" checked={filters.sizes.includes(s)} onChange={() => toggle('groesse', filters.sizes, s)} />
                    {s}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {colorCounts.size > 0 && (
            <fieldset>
              <legend>Farbe</legend>
              {[...colorCounts.keys()].sort((a, b) => a.localeCompare(b, 'de')).map((c) => (
                <label key={c} className="check">
                  <input type="checkbox" checked={filters.colors.includes(c)} onChange={() => toggle('farbe', filters.colors, c)} />
                  {c} <span className="muted">({colorCounts.get(c)})</span>
                </label>
              ))}
            </fieldset>
          )}
          <fieldset>
            <legend>Höchstpreis: {filters.maxPrice != null ? formatMoney(filters.maxPrice) : 'beliebig'}</legend>
            <input
              type="range"
              min={10}
              max={priceCeil}
              step={5}
              value={filters.maxPrice != null ? filters.maxPrice / 100 : priceCeil}
              onChange={(e) => update('max', Number(e.target.value) >= priceCeil ? null : e.target.value)}
              aria-label="Höchstpreis in Euro"
            />
          </fieldset>
          <fieldset>
            <legend>Verfügbarkeit</legend>
            <label className="check">
              <input type="checkbox" checked={filters.inStockOnly} onChange={(e) => update('stock', e.target.checked ? '1' : null)} />
              Nur verfügbare Produkte
            </label>
          </fieldset>
        </div>
        <div className="drawer-foot two">
          <button className="btn btn-outline" onClick={clear} disabled={!activeCount}>Zurücksetzen</button>
          <button className="btn" onClick={() => setDrawer(false)}>{shown.length} {shown.length === 1 ? 'Produkt' : 'Produkte'} anzeigen</button>
        </div>
      </aside>
      </>, document.body)}
    </>
  );
}

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchProducts } from '../lib/catalog';
import { ProductListing } from '../components/ProductToolbar';

export function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [input, setInput] = useState(q);
  useEffect(() => setInput(q), [q]);
  const results = searchProducts(q);
  return (
    <div className="page container">
      <h1 className="page-title">Suche</h1>
      <form
        className="search-page-form"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const next = new URLSearchParams(params);
          next.set('q', input.trim());
          setParams(next);
        }}
      >
        <input type="search" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Suche nach Mantel, Pfotenschutz, Größe …" aria-label="Suchbegriff" />
        <button className="btn">Suchen</button>
      </form>
      {!q.trim() ? (
        <p className="muted center">Gib einen Suchbegriff ein, z. B. „Mantel“, „Regen“, „Pfoten“ oder „Waldgrün“.</p>
      ) : results.length === 0 ? (
        <div className="empty-state">
          <p>Keine Ergebnisse für „{q}“. Prüfe die Schreibweise oder versuche einen anderen Begriff.</p>
          <Link to="/collections/all" className="btn btn-outline">Ganze Winterkollektion ansehen</Link>
        </div>
      ) : (
        <>
          <p className="muted">Ergebnisse für „{q}“</p>
          <ProductListing items={results} showCategoryFilter />
        </>
      )}
    </div>
  );
}

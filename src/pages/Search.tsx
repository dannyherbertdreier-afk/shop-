import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
      <h1 className="page-title">Search</h1>
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
        <input type="search" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search for a watch, colour, model…" aria-label="Search" />
        <button className="btn">Search</button>
      </form>
      {!q.trim() ? (
        <p className="muted center">Enter a search term, e.g. “Oak”, “gold”, “automatic” or “chronograph”.</p>
      ) : results.length === 0 ? (
        <div className="empty-state"><p>No results found for “{q}”. Check the spelling or try a different term.</p></div>
      ) : (
        <>
          <p className="muted">Results for “{q}”</p>
          <ProductListing items={results} defaultSort="featured" />
        </>
      )}
    </div>
  );
}

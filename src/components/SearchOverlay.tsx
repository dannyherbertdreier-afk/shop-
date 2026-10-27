import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../state/ShopContext';
import { searchProducts, minPriceVariant, hasPriceRange } from '../lib/catalog';
import { Img } from './Img';
import { Price } from './Price';
import { IconClose, IconSearch } from './Icons';

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop();
  const [q, setQ] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const results = searchProducts(q).slice(0, 6);
  const close = () => setSearchOpen(false);

  useEffect(() => {
    if (!searchOpen) return;
    setTimeout(() => input.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSearchOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;
  return (
    <div className="search-overlay" role="dialog" aria-label="Suche">
      <div className="search-panel">
        <form
          className="search-form"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            close();
            navigate(`/search?q=${encodeURIComponent(q.trim())}`);
          }}
        >
          <IconSearch />
          <input ref={input} type="search" placeholder="Suche nach Mantel, Pfotenschutz, Größe …" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Suche" enterKeyHint="search" />
          <button type="button" className="icon-btn" aria-label="Suche schließen" onClick={close}>
            <IconClose />
          </button>
        </form>
        {q.trim() && (
          <div className="search-results">
            {results.length === 0 ? (
              <p className="muted">Keine Ergebnisse für „{q}“.</p>
            ) : (
              <>
                <ul>
                  {results.map((p) => {
                    const v = minPriceVariant(p);
                    return (
                      <li key={p.id}>
                        <Link to={`/products/${p.handle}`} onClick={close}>
                          <Img src={p.images[0]} alt={p.title} width={120} />
                          <span>{p.title}</span>
                          <Price price={v.price} compareAt={v.compareAtPrice} from={hasPriceRange(p)} className="small" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Link className="link-underline" to={`/search?q=${encodeURIComponent(q.trim())}`} onClick={close}>
                  Alle Ergebnisse anzeigen
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      <div className="search-backdrop" onClick={close} />
    </div>
  );
}

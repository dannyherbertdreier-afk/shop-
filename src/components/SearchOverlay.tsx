import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../state/ShopContext';
import { searchProducts, minPriceVariant, hasPriceRange } from '../lib/catalog';
import { Img } from './Img';
import { Price } from './Price';
import { IconClose, IconSearch } from './Icons';
import { useDialog } from '../hooks/useDialog';

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop();
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const results = searchProducts(q).slice(0, 6);
  const close = () => setSearchOpen(false);

  const panel = useDialog<HTMLDivElement>(searchOpen, close);

  if (!searchOpen) return null;
  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Suche" ref={panel}>
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
          <input data-autofocus type="search" placeholder="Suche nach Mantel, Pfotenschutz, Größe …" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Suche" enterKeyHint="search" />
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
                          {p.isExample && <span className="card-price-note">Beispielpreis</span>}
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

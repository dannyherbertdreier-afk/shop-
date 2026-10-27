import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categoryTitle, findProduct, findVariant, firstAvailableVariant, isAvailable, products } from '../lib/catalog';
import { formatMoney } from '../lib/money';
import type { Product } from '../lib/types';
import { useShop } from '../state/ShopContext';
import { Img } from '../components/Img';
import { Accordion } from '../components/Accordion';
import { QtyStepper } from '../components/QtyStepper';
import { ProductCard } from '../components/ProductCard';
import { IconBag, IconChevron } from '../components/Icons';
import { SIZE_GUIDE } from '../lib/content';
import { NotFound } from './NotFound';

function Gallery({ product }: { product: Product }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const images: (string | null)[] = product.images.length ? product.images : [null];

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const n = Math.max(0, Math.min(images.length - 1, i));
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="gallery">
      <div className="gallery-main">
        <div className="gallery-track" ref={track} onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
          {images.map((src, i) => (
            <div className="gallery-slide" key={i}>
              <Img src={src} alt={src ? `Symbolbild zu ${product.title}` : product.title} width={1200} eager={i === 0} />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button className="gallery-arrow prev" aria-label="Vorheriges Bild" onClick={() => go(index - 1)} disabled={index === 0}><IconChevron dir="left" /></button>
            <button className="gallery-arrow next" aria-label="Nächstes Bild" onClick={() => go(index + 1)} disabled={index === images.length - 1}><IconChevron dir="right" /></button>
            <div className="gallery-dots" aria-hidden>{images.map((_, i) => <span key={i} className={i === index ? 'on' : ''} />)}</div>
          </>
        )}
        {product.isExample && <span className="badge badge-sample">Beispielprodukt</span>}
      </div>
      {product.images.length > 0 && <p className="image-note">Symbolbild – zeigt nicht das angebotene Produkt.</p>}
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, i) => (
            <button key={i} className={i === index ? 'on' : ''} onClick={() => go(i)} aria-label={`Bild ${i + 1} anzeigen`}>
              <Img src={src} alt="" width={160} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductPage() {
  const { handle = '' } = useParams();
  const product = findProduct(handle);
  if (!product) return <NotFound />;
  return <ProductView key={product.id} product={product} />;
}

function ProductView({ product }: { product: Product }) {
  const { addItems } = useShop();
  const available = isAvailable(product);
  const initial = firstAvailableVariant(product);
  const sizeIndex = product.options.findIndex((o) => o.name === 'Größe');
  const needsSizeChoice = sizeIndex >= 0 && product.options[sizeIndex].values.length > 1;
  // Clothing sizes must be chosen deliberately, so the size starts unselected.
  const [selected, setSelected] = useState<(string | null)[]>(() => initial.options.map((v, i) => (i === sizeIndex && needsSizeChoice ? null : v)));
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const variant = selected.every((v) => v != null) ? findVariant(product, selected as string[]) : undefined;
  const shownPrice = (variant ?? initial).price;

  const related = useMemo(
    () => products.filter((p) => p.id !== product.id && p.category === product.category).concat(products.filter((p) => p.category !== product.category)).slice(0, 4),
    [product.id, product.category],
  );

  useEffect(() => {
    document.title = `${product.title} – PAWGUARD`;
  }, [product.title]);

  const choose = (i: number, value: string) => {
    setSelected((s) => s.map((v, j) => (j === i ? value : v)));
    if (i === sizeIndex) setSizeError(false);
  };

  const addToCart = () => {
    if (!variant) {
      setSizeError(true);
      return;
    }
    if (!variant.available) return;
    setAdding(true);
    setTimeout(() => {
      addItems([{ handle: product.handle, variantId: variant.id, quantity: qty }]);
      setAdding(false);
    }, 300);
  };

  return (
    <div className="page">
      <nav className="breadcrumbs container" aria-label="Navigationspfad">
        <Link to="/">Startseite</Link> / <Link to={`/collections/${product.category}`}>{categoryTitle(product.category)}</Link> / <span>{product.title}</span>
      </nav>
      <div className="product container">
        <Gallery product={product} />
        <div className="product-info">
          <p className="eyebrow">{categoryTitle(product.category)}</p>
          <h1 className="product-title">{product.title}</h1>
          <p className="product-summary">{product.summary}</p>
          <p className="product-price">
            {formatMoney(shownPrice)}
            {product.isExample && <span className="price-note">Beispielpreis</span>}
          </p>
          {!available && <p className="soldout-note">Dieses Produkt ist derzeit nicht verfügbar.</p>}

          {product.options.map((o, i) => (
            <fieldset key={o.name} className={`option ${i === sizeIndex && sizeError ? 'has-error' : ''}`}>
              <legend>
                {o.name}: <strong>{selected[i] ?? 'bitte wählen'}</strong>
              </legend>
              <div className="option-values">
                {o.values.map((v) => {
                  const probe = selected.map((s, j) => (j === i ? v : s));
                  const match = probe.every((x) => x != null) ? findVariant(product, probe as string[]) : undefined;
                  const disabled = match ? !match.available : false;
                  return (
                    <button
                      key={v}
                      type="button"
                      className={`option-btn ${selected[i] === v ? 'on' : ''}`}
                      aria-pressed={selected[i] === v}
                      disabled={disabled}
                      onClick={() => choose(i, v)}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
              {i === sizeIndex && sizeError && <p className="field-error" role="alert">Bitte wähle zuerst eine Größe.</p>}
            </fieldset>
          ))}

          <div className="buy-row">
            <QtyStepper value={qty} onChange={setQty} label={product.title} />
            <button className="btn btn-lg buy-btn" onClick={addToCart} disabled={!available || adding}>
              {!available ? 'Nicht verfügbar' : adding ? <span className="spinner" aria-label="Wird hinzugefügt" /> : (<><IconBag size={18} /> In den Warenkorb</>)}
            </button>
          </div>
          <p className="demo-hint">Demo-Shop: Es wird nichts berechnet und nichts versendet.</p>

          <div className="product-accordions">
            <Accordion title="Beschreibung" defaultOpen>
              <div className="rte" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
            </Accordion>
            {sizeIndex >= 0 && (
              <Accordion title="Größe finden">
                <div className="rte">{SIZE_GUIDE}</div>
              </Accordion>
            )}
            <Accordion title="Versand & Rückgabe">
              <div className="rte">
                <p>Versandkosten, Lieferzeiten und Rückgabebedingungen werden festgelegt, sobald Lieferanten und Versanddienstleister feststehen.</p>
                <p><Link to="/pages/versand">Versandinformationen</Link> · <Link to="/pages/rueckgabe">Rückgabe</Link></p>
              </div>
            </Accordion>
          </div>
        </div>
      </div>

      <section className="section container">
        <h2 className="section-title-left">Das könnte auch passen</h2>
        <div className="grid grid-m2 grid-featured">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { findProduct, firstAvailableVariant, isAvailable, products } from '../lib/catalog';
import { bundlePrice } from '../lib/pricing';
import { formatMoney } from '../lib/money';
import type { Product, Variant } from '../lib/types';
import { useShop } from '../state/ShopContext';
import { Img } from '../components/Img';
import { Price } from '../components/Price';
import { Accordion } from '../components/Accordion';
import { QtyStepper } from '../components/QtyStepper';
import { ProductCard } from '../components/ProductCard';
import { IconCartPlus, IconChevron } from '../components/Icons';
import { FAQ } from '../lib/content';
import { NotFound } from './NotFound';

type Offer = 'b1g1' | 'b2g2' | 'single';
const OFFER_UNITS: Record<Offer, number> = { b1g1: 2, b2g2: 4, single: 1 };

function Gallery({ product, activeImage }: { product: Product; activeImage: string | null }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const images = product.images.length ? product.images : [null];

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const n = Math.max(0, Math.min(images.length - 1, i));
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!activeImage) return;
    const i = product.images.indexOf(activeImage);
    if (i >= 0) go(i);
  }, [activeImage]);

  return (
    <div className="gallery">
      <div className="gallery-main">
        <div
          className="gallery-track"
          ref={track}
          onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        >
          {images.map((src, i) => (
            <div className="gallery-slide" key={i}>
              <Img src={src} alt={`${product.title} – image ${i + 1}`} width={900} eager={i === 0} />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button className="gallery-arrow prev" aria-label="Previous image" onClick={() => go(index - 1)} disabled={index === 0}><IconChevron dir="left" /></button>
            <button className="gallery-arrow next" aria-label="Next image" onClick={() => go(index + 1)} disabled={index === images.length - 1}><IconChevron dir="right" /></button>
            <div className="gallery-dots" aria-hidden>{images.map((_, i) => <span key={i} className={i === index ? 'on' : ''} />)}</div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, i) => (
            <button key={i} className={i === index ? 'on' : ''} onClick={() => go(i)} aria-label={`Show image ${i + 1}`}>
              <Img src={src} alt="" width={140} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function VariantPicker({ product, value, onChange, label }: { product: Product; value: Variant; onChange: (v: Variant) => void; label?: string }) {
  return (
    <div className="variant-row">
      {label && <span className="variant-row-label">{label}</span>}
      <div className="swatches" role="radiogroup" aria-label={`${product.optionName}${label ? ' ' + label : ''}`}>
        {product.variants.map((v) => (
          <button
            key={v.id}
            role="radio"
            aria-checked={v.id === value.id}
            aria-label={`${v.title}${v.available ? '' : ' (sold out)'}`}
            title={`${v.title}${v.available ? '' : ' – sold out'}`}
            className={`swatch ${v.id === value.id ? 'on' : ''} ${v.available ? '' : 'na'}`}
            disabled={!v.available}
            onClick={(e) => {
              e.stopPropagation();
              onChange(v);
            }}
          >
            <Img src={v.image} alt="" width={120} />
          </button>
        ))}
      </div>
    </div>
  );
}

function OfferBox({ id, active, onSelect, title, badge, prices, compares, children }: {
  id: Offer; active: boolean; onSelect: (o: Offer) => void; title: string; badge?: string; prices: number[]; compares: number[]; children?: React.ReactNode;
}) {
  const price = bundlePrice(prices);
  const compare = compares.reduce((a, b) => a + b, 0);
  return (
    <div className={`offer ${active ? 'active' : ''}`} onClick={() => onSelect(id)}>
      <div className="offer-head">
        <input type="radio" name="offer" checked={active} onChange={() => onSelect(id)} aria-label={title} />
        <div className="offer-title">
          <strong>{title}</strong>
          {badge && <span className="offer-badge">{badge}</span>}
          {compare > price && <span className="muted">Save {formatMoney(compare - price)}</span>}
        </div>
        <div className="offer-price">
          <strong>{formatMoney(price)}</strong>
          {compare > price && <s>{formatMoney(compare)}</s>}
        </div>
      </div>
      {active && children && <div className="offer-body">{children}</div>}
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
  const [offer, setOffer] = useState<Offer>(product.variants.length > 1 || available ? 'b1g1' : 'single');
  const [picks, setPicks] = useState<Variant[]>(() => Array(4).fill(initial));
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const units = OFFER_UNITS[offer];
  const selected = picks.slice(0, units);
  const multiply = (v: Variant[], n: number) => v.flatMap((x) => Array(n).fill(x) as Variant[]);
  const priced = (offer === 'single' ? multiply(selected, qty) : selected);

  const setPick = (i: number, v: Variant) => {
    setPicks((p) => p.map((x, j) => (j === i ? v : x)));
    if (v.image) setActiveImage(v.image);
  };

  const related = useMemo(
    () => products.filter((p) => p.id !== product.id && isAvailable(p)).sort((a, b) => (a.bestsellerRank ?? 99) - (b.bestsellerRank ?? 99)).slice(0, 4),
    [product.id],
  );

  useEffect(() => {
    document.title = `${product.title} – Poedagar Demo Store`;
  }, [product.title]);

  const addToCart = () => {
    if (!available || priced.some((v) => !v.available)) return;
    setAdding(true);
    // Short delay gives visible feedback, mirroring a network round trip.
    setTimeout(() => {
      addItems(priced.map((v) => ({ handle: product.handle, variantId: v.id })));
      setAdding(false);
    }, 350);
  };

  const pickers = (n: number) =>
    Array.from({ length: n }, (_, i) => (
      <VariantPicker key={i} product={product} value={picks[i]} onChange={(v) => setPick(i, v)} label={n > 1 ? `#${i + 1}` : undefined} />
    ));

  const showPrice = picks[0];

  return (
    <div className="page">
      <nav className="breadcrumbs container" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/collections/all">2026 Collection</Link> / <span>{product.title}</span>
      </nav>
      <div className="product container">
        <Gallery product={product} activeImage={activeImage} />
        <div className="product-info">
          <h1 className="product-title">{product.title}</h1>
          <div className="product-price">
            <Price price={showPrice.price} compareAt={showPrice.compareAtPrice} />
          </div>
          {!available && <p className="soldout-note">This watch is currently sold out.</p>}

          <p className="offer-heading"><span>Exclusive offer</span></p>
          <div className="offers">
            <OfferBox id="b1g1" active={offer === 'b1g1'} onSelect={setOffer} title="Buy 1, Get 1 Free 🎁" prices={picks.slice(0, 2).map((v) => v.price)} compares={picks.slice(0, 2).map((v) => v.compareAtPrice ?? v.price)}>
              <p className="variant-label">{product.optionName}</p>
              {pickers(2)}
            </OfferBox>
            <OfferBox id="b2g2" active={offer === 'b2g2'} onSelect={setOffer} title="Buy 2, Get 2 Free 🎁🎁" badge="Premium value" prices={picks.slice(0, 4).map((v) => v.price)} compares={picks.slice(0, 4).map((v) => v.compareAtPrice ?? v.price)}>
              <p className="variant-label">{product.optionName}</p>
              {pickers(4)}
            </OfferBox>
            <OfferBox id="single" active={offer === 'single'} onSelect={setOffer} title="Mix & Match" badge="Buy 1, Get 1 Free 🎁" prices={multiply([picks[0]], qty).map((v) => v.price)} compares={multiply([picks[0]], qty).map((v) => v.compareAtPrice ?? v.price)}>
              <p className="muted small">Add this watch, then choose the next ones from our collection – every second watch is free in the cart.</p>
              <p className="variant-label">{product.optionName}: <strong>{picks[0].title}</strong></p>
              {pickers(1)}
              <div className="qty-row">
                <span>Quantity</span>
                <QtyStepper value={qty} onChange={setQty} label={product.title} />
              </div>
            </OfferBox>
          </div>
          {offer !== 'single' && (
            <p className="selected-summary muted small">Selected: {selected.map((v) => v.title).join(' · ')}</p>
          )}

          <button className="btn btn-block btn-lg" onClick={addToCart} disabled={!available || adding}>
            {!available ? 'Sold out' : adding ? <span className="spinner" aria-label="Adding" /> : (<><IconCartPlus size={18} /> Add to cart</>)}
          </button>
          <p className="secure-note">🔒 Demo checkout – no real payment is taken</p>

          <div className="product-accordions">
            <Accordion title="Description" defaultOpen>
              {product.descriptionHtml ? (
                <div className="rte" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              ) : (
                <p className="muted">No description provided by the reference store.</p>
              )}
            </Accordion>
            <Accordion title="Free Delivery"><div className="rte">{FAQ[1].a}</div></Accordion>
            <Accordion title="Warranty"><div className="rte">{FAQ[2].a}</div></Accordion>
            <Accordion title="Returns & Refunds">
              <div className="rte">
                <p>You can exercise your right of withdrawal within 14 days of receipt, without giving a reason. For the Buy 1, Get 1 Free offer, direct return shipping costs are your responsibility.</p>
                <p><Link to="/pages/returns">Read more about returns</Link></p>
              </div>
            </Accordion>
          </div>
        </div>
      </div>

      <section className="section container">
        <h2 className="section-title">You may also like</h2>
        <div className="grid grid-m2">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { products, findProduct, sortProducts, minPriceVariant } from '../lib/catalog';
import { COMMITMENTS, FAQ } from '../lib/content';
import { ProductCard } from '../components/ProductCard';
import { Accordion } from '../components/Accordion';
import { Img } from '../components/Img';
import { Price } from '../components/Price';
import { IconAward, IconChat, IconLock, IconShield, IconStar, IconTruck } from '../components/Icons';
import { useRef } from 'react';
import { IconChevron } from '../components/Icons';

const ICONS = { truck: IconTruck, shield: IconShield, chat: IconChat, lock: IconLock, award: IconAward, star: IconStar };

export function Home() {
  const favorites = sortProducts(products.filter((p) => p.bestsellerRank), 'best-selling');
  const featured = findProduct('poedagar-kings-oak') ?? products[0];
  const fv = minPriceVariant(featured);
  const hero = findProduct('poedagar-8051');
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <>
      <section className="hero">
        <div className="hero-bg">
          <Img src={hero?.images[0] ?? featured.images[0]} alt="" width={1200} eager />
        </div>
        <div className="hero-content">
          <div>
            <h1 className="hero-title">Poedagar</h1>
            <span className="pill"><span className="dot" /> Demo store</span>
            <p className="hero-tagline">The art of marking the moment</p>
          </div>
          <div className="hero-side">
            <p>
              <strong>Welcome.</strong> Designed as wearable works of art, our watches transcend fashion to become an extension of your personality.
            </p>
            <Link to="/collections/all" className="btn btn-ring">Explore the Collection</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Our Customers' Favorite Watches</h2>
        <div className="carousel">
          <button className="carousel-btn prev" aria-label="Previous products" onClick={() => scroll(-1)}><IconChevron dir="left" /></button>
          <div className="carousel-track" ref={track}>
            {favorites.map((p) => (
              <ProductCard key={p.id} product={p} variant="carousel" />
            ))}
          </div>
          <button className="carousel-btn next" aria-label="Next products" onClick={() => scroll(1)}><IconChevron dir="right" /></button>
        </div>
        <div className="center">
          <Link to="/collections/all" className="btn">The entire collection</Link>
        </div>
      </section>

      <section className="story dark">
        <div className="story-inner">
          <h2>The art of watchmaking reinvented</h2>
          <p>
            Born in Paris, <strong>Poedagar</strong> is more than just a watch brand: it's a vision. One that makes elegance and refinement accessible without compromising on quality. Inspired by the codes of luxury watchmaking, we select noble materials and work with passionate artisans to create pieces that stand the test of time.
          </p>
          <p className="quote">"Every Poedagar® watch tells a story: yours."</p>
          <Link to="/pages/about" className="btn btn-light">Our story</Link>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Our commitments</p>
        <h2 className="section-title">Shop with confidence at every step</h2>
        <div className="commitments">
          {COMMITMENTS.map((c) => {
            const Icon = ICONS[c.icon];
            return (
              <details key={c.title} className="commitment">
                <summary>
                  <span className="commitment-icon"><Icon size={18} /></span>
                  <span>{c.title}</span>
                </summary>
                <p>{c.text}</p>
              </details>
            );
          })}
        </div>
      </section>

      <section className="story dark">
        <div className="story-inner">
          <h2>Quality, down to the smallest details</h2>
          <p>At <strong>Poedagar</strong> Paris, every watch receives special attention, from assembly to finishing.</p>
          <p>Selected materials, mastered details, reliable mechanisms: each piece is designed to combine elegance, precision, and durability.</p>
          <p><strong>A watch designed to be beautiful, reliable, and long-lasting.</strong></p>
        </div>
      </section>

      <section className="featured">
        <Link to={`/products/${featured.handle}`} className="featured-media">
          <Img src={featured.images[1] ?? featured.images[0]} alt={featured.title} width={900} />
        </Link>
        <div className="featured-info">
          <p className="eyebrow">Featured product</p>
          <h2>{featured.title}</h2>
          <Price price={fv.price} compareAt={fv.compareAtPrice} />
          <Link to={`/products/${featured.handle}`} className="btn btn-light">View the watch</Link>
        </div>
      </section>

      <section className="section narrow">
        <h2 className="faq-title">FAQ - Poedagar</h2>
        {FAQ.map((f) => (
          <Accordion key={f.q} title={f.q} icon="chevron">
            <div className="rte">{f.a}</div>
          </Accordion>
        ))}
        <Link to="/pages/faq" className="btn faq-btn">Our FAQ page</Link>
      </section>
    </>
  );
}

import { Link } from 'react-router-dom';
import { CATEGORIES, products, sortProducts } from '../lib/catalog';
import { BENEFITS, FAQ } from '../lib/content';
import { usePageTitle } from '../hooks/usePageTitle';
import { ProductCard } from '../components/ProductCard';
import { Accordion } from '../components/Accordion';
import { Img } from '../components/Img';
import { IconArrow, IconLeash, IconMove, IconRuler, IconSnow } from '../components/Icons';

const BENEFIT_ICONS = { snow: IconSnow, move: IconMove, leash: IconLeash, ruler: IconRuler };

export function Home() {
  const featured = sortProducts(products.filter((p) => p.featuredRank != null), 'featured').slice(0, 4);
  usePageTitle('');
  const counts = new Map(CATEGORIES.map((c) => [c.handle, products.filter(c.filter).length]));

  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <Img src="images/winterwald-spaziergang.jpg" alt="Kleiner Hund im Mantel auf einem verschneiten Waldweg" width={1400} eager />
        </div>
        <div className="hero-content">
          <p className="eyebrow">Winterkollektion</p>
          <h1>Gut geschützt durch den Winter.</h1>
          <p className="hero-text">Entdecke durchdachte Winterbegleiter für deinen Hund – für kalte Spaziergänge, nasse Wege und frostige Tage.</p>
          <div className="hero-actions">
            <Link to="/collections/all" className="btn btn-accent btn-lg">Winterkollektion entdecken</Link>
            <Link to="/pages/faq" className="btn btn-ghost btn-lg">Größe finden</Link>
          </div>
        </div>
      </section>

      <section className="benefits" aria-label="Vorteile">
        {BENEFITS.map((b) => {
          const Icon = BENEFIT_ICONS[b.icon];
          return (
            <div key={b.title} className="benefit">
              <span className="benefit-icon"><Icon size={22} /></span>
              <div>
                <h2>{b.title}</h2>
                <p>{b.text}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="section container" aria-labelledby="cat-title">
        <div className="section-head">
          <h2 id="cat-title">Kategorien entdecken</h2>
          <Link to="/collections/all" className="link-arrow">Alle Produkte <IconArrow size={18} /></Link>
        </div>
        <div className="categories">
          {CATEGORIES.map((c) => (
            <Link key={c.handle} to={`/collections/${c.handle}`} className="category-tile">
              <Img src={c.image} alt="" width={800} />
              <div className="category-label">
                <h3>{c.title}</h3>
                <span>{counts.get(c.handle)} {counts.get(c.handle) === 1 ? 'Produkt' : 'Produkte'}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container" aria-labelledby="featured-title">
        <div className="section-head">
          <h2 id="featured-title">Ausgewählt für kalte Tage</h2>
          <Link to="/collections/all" className="link-arrow">Zur Winterkollektion <IconArrow size={18} /></Link>
        </div>
        <div className="grid grid-m2 grid-featured">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="story">
        <div className="story-media">
          <Img src="images/winterspaziergang-collie.jpg" alt="Hund sitzt auf einem frostigen Weg bei einem Winterspaziergang" width={1200} />
        </div>
        <div className="story-content">
          <p className="eyebrow">Über PAWGUARD</p>
          <h2>Für Hunde, die auch im Winter rauswollen.</h2>
          <p>PAWGUARD entsteht für Hundebesitzer, die bei Kälte, Regen und Schnee nicht auf gemeinsame Spaziergänge verzichten möchten. Unser Ziel: wenige, durchdachte Produkte, die du leicht findest und in der richtigen Größe bestellst.</p>
          <p className="story-note">Wir sind noch im Aufbau. Materialangaben, Versandbedingungen und Rückgaberegeln veröffentlichen wir, sobald sie feststehen.</p>
          <Link to="/pages/about" className="btn btn-outline-light">Mehr über PAWGUARD</Link>
        </div>
      </section>

      <section className="section container narrow" aria-labelledby="faq-title">
        <h2 id="faq-title" className="section-title-left">Häufige Fragen</h2>
        {FAQ.map((f) => (
          <Accordion key={f.q} title={f.q} icon="chevron">
            <div className="rte">{f.a}</div>
          </Accordion>
        ))}
        <Link to="/pages/faq" className="link-arrow faq-more">Größe & häufige Fragen <IconArrow size={18} /></Link>
      </section>
    </>
  );
}

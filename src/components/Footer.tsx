import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../lib/catalog';
import { IconArrow } from './Icons';
import { validateEmail } from '../lib/validation';
import { load, save } from '../lib/storage';
import { Logo } from './Layout';

export const POLICIES = [
  { slug: 'impressum', title: 'Impressum' },
  { slug: 'datenschutz', title: 'Datenschutz' },
  { slug: 'agb', title: 'AGB' },
  { slug: 'widerruf', title: 'Widerrufsbelehrung' },
];

function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);
  return (
    <section className="newsletter" aria-labelledby="nl-title">
      <h2 id="nl-title">Bereit für den Winter?</h2>
      <p>Trag dich ein, und wir sagen Bescheid, sobald PAWGUARD startet.</p>
      {done ? (
        <p className="success" role="status">Danke! Deine Adresse ist vorgemerkt – in dieser Demo nur in deinem Browser, es werden keine E-Mails verschickt.</p>
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const err = validateEmail(email);
            setError(err);
            if (err) return;
            save('demo-shop:newsletter', [...load<string[]>('demo-shop:newsletter', []), email.trim()]);
            setDone(true);
          }}
        >
          <div className="newsletter-row">
            <input type="email" placeholder="Deine E-Mail-Adresse" aria-label="E-Mail-Adresse" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error} />
            <button className="round-btn" aria-label="Eintragen">
              <IconArrow />
            </button>
          </div>
          {error && <p className="field-error">{error}</p>}
        </form>
      )}
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Newsletter />
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>Winterbegleiter für Hunde – für kalte Spaziergänge, nasse Wege und frostige Tage.</p>
          </div>
          <nav aria-label="Shop">
            <h3>Shop</h3>
            <ul className="footer-links">
              <li><Link to="/collections/all">Winterkollektion</Link></li>
              {CATEGORIES.map((c) => <li key={c.handle}><Link to={`/collections/${c.handle}`}>{c.title}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Service">
            <h3>Service</h3>
            <ul className="footer-links">
              <li><Link to="/pages/contact">Kontakt</Link></li>
              <li><Link to="/pages/faq">Größe & häufige Fragen</Link></li>
              <li><Link to="/pages/versand">Versandinformationen</Link></li>
              <li><Link to="/pages/rueckgabe">Rückgabe</Link></li>
              <li><Link to="/pages/track-order">Bestellung verfolgen</Link></li>
            </ul>
          </nav>
          <nav aria-label="Rechtliches">
            <h3>Rechtliches</h3>
            <ul className="footer-links">
              {POLICIES.map((p) => <li key={p.slug}><Link to={`/policies/${p.slug}`}>{p.title}</Link></li>)}
              <li><Link to="/pages/bildnachweise">Bildnachweise</Link></li>
            </ul>
          </nav>
        </div>
        <p className="demo-note">
          Demo-Shop im Aufbau: Alle Produkte sind Beispiele. Es werden keine echten Bestellungen, Zahlungen oder Lieferungen abgewickelt. Rechtstexte folgen.
        </p>
      </div>
    </footer>
  );
}

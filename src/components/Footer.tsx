import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NAV } from './Layout';
import { Accordion } from './Accordion';
import { IconArrow } from './Icons';
import { validateEmail } from '../lib/validation';
import { load, save } from '../lib/storage';

export const POLICIES = [
  { slug: 'privacy-policy', title: 'Privacy policy' },
  { slug: 'terms-of-sale', title: 'Terms of sale' },
  { slug: 'contact-information', title: 'Contact information' },
  { slug: 'legal-notice', title: 'Legal notice' },
  { slug: 'shipping-policy', title: 'Shipping policy' },
  { slug: 'terms-of-service', title: 'Terms of service' },
  { slug: 'refund-policy', title: 'Refund policy' },
];

function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);
  return (
    <section className="newsletter">
      <h2>Join the club</h2>
      <p>Get exclusive access to new products, special offers, and restocks. Join the Poedagar Store Club.</p>
      {done ? (
        <p className="success" role="status">Thanks! {email} was saved (demo – stored only in this browser, no emails are sent).</p>
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
            <input type="email" placeholder="Email address" aria-label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error} />
            <button className="round-btn" aria-label="Subscribe">
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
      <Newsletter />
      <div className="footer-cols">
        <Accordion title="Main Menu">
          <ul className="footer-links">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to}>{n.label}</Link></li>
            ))}
          </ul>
        </Accordion>
        <Accordion title="Terms and Policies">
          <ul className="footer-links">
            {POLICIES.map((p) => (
              <li key={p.slug}><Link to={`/policies/${p.slug}`}>{p.title}</Link></li>
            ))}
          </ul>
        </Accordion>
      </div>
      <p className="demo-note">
        Demo store / Demo-Shop: an unofficial rebuild for testing. No real orders, payments or shipments are processed.
      </p>
    </footer>
  );
}

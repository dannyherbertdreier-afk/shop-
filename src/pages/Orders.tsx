import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useShop } from '../state/ShopContext';
import type { Order } from '../lib/types';
import { formatMoney } from '../lib/money';
import { COUNTRIES, validateEmail } from '../lib/validation';
import { Img } from '../components/Img';
import { IconCheck } from '../components/Icons';
import { usePageTitle } from '../hooks/usePageTitle';

function OrderDetails({ order }: { order: Order }) {
  const a = order.address;
  return (
    <div className="order-card">
      <div className="order-meta">
        <div><span className="muted">Bestellung</span><strong>{order.number}</strong></div>
        <div><span className="muted">Datum</span><strong>{new Date(order.createdAt).toLocaleString('de-DE')}</strong></div>
        <div><span className="muted">Status</span><strong>Demo – nicht bearbeitet</strong></div>
      </div>
      <ul className="summary-lines">
        {order.lines.map((l, i) => (
          <li key={i}>
            <span className="summary-img"><Img src={l.image} alt={l.title} width={120} /><span className="summary-qty">{l.quantity}</span></span>
            <span className="summary-name">{l.title}{l.variantTitle !== 'Standard' && <small>{l.variantTitle}</small>}</span>
            <span>{formatMoney(l.unitPrice * l.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="totals">
        <div><dt>Zwischensumme</dt><dd>{formatMoney(order.subtotal)}</dd></div>
        <div><dt>Versand</dt><dd>{order.shipping ? formatMoney(order.shipping) : 'noch nicht festgelegt'}</dd></div>
        <div className="total"><dt>Gesamt (Demo)</dt><dd>{formatMoney(order.total)}</dd></div>
      </dl>
      <div className="order-address">
        <div>
          <h3>Lieferadresse</h3>
          <p>{a.firstName} {a.lastName}<br />{a.address1}{a.address2 && <><br />{a.address2}</>}<br />{a.zip} {a.city}<br />{COUNTRIES.find((c) => c.code === a.country)?.name}</p>
        </div>
        <div>
          <h3>Versand & Zahlung</h3>
          <p>{order.shippingMethod}<br />{order.paymentMethod}<br />{order.email}</p>
        </div>
      </div>
    </div>
  );
}

export function OrderConfirmation() {
  const { number } = useParams();
  const { orders } = useShop();
  const order = orders.find((o) => o.number === number);
  usePageTitle('Bestellbestätigung');
  if (!order) {
    return (
      <div className="page container empty-state">
        <h1 className="page-title">Bestellung nicht gefunden</h1>
        <p>Diese Bestellung ist in diesem Browser nicht gespeichert.</p>
        <Link to="/" className="btn">Zur Startseite</Link>
      </div>
    );
  }
  return (
    <div className="page container narrow">
      <div className="confirm-head">
        <span className="confirm-icon"><IconCheck size={28} /></span>
        <h1 className="page-title">Danke, {order.address.firstName}!</h1>
        <p>Deine Demo-Bestellung <strong>{order.number}</strong> wurde in diesem Browser gespeichert.</p>
        <p className="demo-banner">Dies ist eine Demo: Es wurde nichts berechnet, keine E-Mail verschickt und es wird nichts versendet.</p>
      </div>
      <OrderDetails order={order} />
      <div className="center gap">
        <Link to="/pages/track-order" className="btn btn-outline">Bestellung verfolgen</Link>
        <Link to="/collections/all" className="btn">Weiter einkaufen</Link>
      </div>
    </div>
  );
}

export function TrackOrder() {
  const { orders } = useShop();
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<Order | null | undefined>(undefined);
  const [error, setError] = useState<string>();
  usePageTitle('Bestellung verfolgen');
  return (
    <div className="page container narrow">
      <h1 className="page-title">Bestellung verfolgen</h1>
      <p className="center muted">Gib deine Bestellnummer und E-Mail-Adresse ein. In der Demo werden nur Bestellungen aus diesem Browser gefunden.</p>
      <form
        className="track-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const err = !number.trim() ? 'Bitte gib deine Bestellnummer ein' : validateEmail(email);
          setError(err);
          if (err) return setResult(undefined);
          setResult(orders.find((o) => o.number.toLowerCase() === number.trim().toLowerCase() && o.email === email.trim().toLowerCase()) ?? null);
        }}
      >
        <label className="field"><span>Bestellnummer</span><input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="PG-DEMO-1234567" /></label>
        <label className="field"><span>E-Mail</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        {error && <p className="field-error">{error}</p>}
        <button className="btn btn-block">Suchen</button>
      </form>
      {result === null && <p className="form-error" role="alert">Keine Bestellung mit dieser Nummer und E-Mail-Adresse gefunden.</p>}
      {result && (
        <>
          <p className="demo-banner">Demo-Ansicht – es findet kein Versand statt.</p>
          <ol className="timeline">
            <li className="done">Eingegangen</li>
            <li>In Bearbeitung</li>
            <li>Versendet</li>
            <li>Zugestellt</li>
          </ol>
          <OrderDetails order={result} />
        </>
      )}
    </div>
  );
}

export function Account() {
  const { orders } = useShop();
  usePageTitle('Meine Bestellungen');
  return (
    <div className="page container narrow">
      <h1 className="page-title">Meine Bestellungen</h1>
      <p className="center muted">Kundenkonten gibt es in der Demo noch nicht. Hier stehen die Demo-Bestellungen aus diesem Browser.</p>
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>Du hast noch keine Demo-Bestellung aufgegeben.</p>
          <Link to="/collections/all" className="btn">Winterkollektion entdecken</Link>
        </div>
      ) : (
        orders.map((o) => <OrderDetails key={o.number} order={o} />)
      )}
    </div>
  );
}

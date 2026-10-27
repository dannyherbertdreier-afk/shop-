import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useShop } from '../state/ShopContext';
import type { Order } from '../lib/types';
import { formatMoney } from '../lib/money';
import { COUNTRIES, validateEmail } from '../lib/validation';
import { Img } from '../components/Img';
import { IconCheck } from '../components/Icons';

function OrderDetails({ order }: { order: Order }) {
  const a = order.address;
  return (
    <div className="order-card">
      <div className="order-meta">
        <div><span className="muted">Order</span><strong>{order.number}</strong></div>
        <div><span className="muted">Date</span><strong>{new Date(order.createdAt).toLocaleString('en-GB')}</strong></div>
        <div><span className="muted">Status</span><strong>Demo – not processed</strong></div>
      </div>
      <ul className="summary-lines">
        {order.lines.map((l, i) => (
          <li key={i}>
            <span className="summary-img"><Img src={l.image} alt={l.title} width={120} /><span className="summary-qty">{l.quantity}</span></span>
            <span className="summary-name">{l.title}<small>{l.variantTitle}</small></span>
            <span>{formatMoney(l.unitPrice * l.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="totals">
        <div><dt>Subtotal</dt><dd>{formatMoney(order.subtotal)}</dd></div>
        {order.discount > 0 && <div className="discount"><dt>Buy 1, Get 1 Free</dt><dd>−{formatMoney(order.discount)}</dd></div>}
        <div><dt>Shipping</dt><dd>{order.shipping ? formatMoney(order.shipping) : 'Free'}</dd></div>
        <div className="total"><dt>Total</dt><dd>{formatMoney(order.total)}</dd></div>
      </dl>
      <div className="order-address">
        <div>
          <h3>Delivery address</h3>
          <p>{a.firstName} {a.lastName}<br />{a.address1}{a.address2 && <><br />{a.address2}</>}<br />{a.zip} {a.city}<br />{COUNTRIES.find((c) => c.code === a.country)?.name}</p>
        </div>
        <div>
          <h3>Shipping & payment</h3>
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
  if (!order) {
    return (
      <div className="page container empty-state">
        <h1 className="page-title">Order not found</h1>
        <p>This order does not exist in this browser.</p>
        <Link to="/" className="btn">Back to home</Link>
      </div>
    );
  }
  return (
    <div className="page container narrow">
      <div className="confirm-head">
        <span className="confirm-icon"><IconCheck size={28} /></span>
        <h1 className="page-title">Thank you, {order.address.firstName}!</h1>
        <p>Your demo order <strong>{order.number}</strong> was recorded in this browser.</p>
        <p className="demo-banner">This is a demo: nothing was charged, no email was sent and nothing will be shipped.</p>
      </div>
      <OrderDetails order={order} />
      <div className="center gap">
        <Link to="/pages/track-order" className="btn btn-outline">Track my order</Link>
        <Link to="/collections/all" className="btn">Continue shopping</Link>
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
  return (
    <div className="page container narrow">
      <h1 className="page-title">Track my order</h1>
      <p className="center muted">Enter your order number and email address. In this demo, only orders placed in this browser can be found.</p>
      <form
        className="track-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const err = !number.trim() ? 'Enter your order number' : validateEmail(email);
          setError(err);
          if (err) return setResult(undefined);
          setResult(orders.find((o) => o.number.toLowerCase() === number.trim().toLowerCase() && o.email === email.trim().toLowerCase()) ?? null);
        }}
      >
        <label className="field"><span>Order number</span><input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="DEMO-1234567" /></label>
        <label className="field"><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        {error && <p className="field-error">{error}</p>}
        <button className="btn btn-block">Track</button>
      </form>
      {result === null && <p className="form-error" role="alert">No order found with this number and email address.</p>}
      {result && (
        <>
          <ol className="timeline">
            <li className="done">Order received</li>
            <li>Prepared</li>
            <li>Shipped</li>
            <li>Delivered</li>
          </ol>
          <OrderDetails order={result} />
        </>
      )}
    </div>
  );
}

export function Account() {
  const { orders } = useShop();
  return (
    <div className="page container narrow">
      <h1 className="page-title">My orders</h1>
      <p className="center muted">Customer accounts are not part of this demo. Orders placed in this browser are listed here.</p>
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>You haven't placed any orders yet.</p>
          <Link to="/collections/all" className="btn">Start shopping</Link>
        </div>
      ) : (
        orders.map((o) => <OrderDetails key={o.number} order={o} />)
      )}
    </div>
  );
}

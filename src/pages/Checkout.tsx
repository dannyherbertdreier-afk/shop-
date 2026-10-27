import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../state/ShopContext';
import { COUNTRIES, validateAddress, validateEmail, type Errors } from '../lib/validation';
import type { Address, Order } from '../lib/types';
import { Img } from '../components/Img';
import { formatMoney } from '../lib/money';
import { CartSummary } from '../components/CartLines';

const PAYMENT_METHODS = [
  { id: 'demo-card', label: 'Credit card (demo – no card data is collected)' },
  { id: 'demo-paypal', label: 'PayPal (demo)' },
  { id: 'demo-invoice', label: 'Pay later (demo)' },
];

type FormState = Address & { email: string; payment: string; terms: boolean };
type FormErrors = Errors<FormState>;

const empty: FormState = { email: '', firstName: '', lastName: '', address1: '', address2: '', zip: '', city: '', country: 'DE', phone: '', payment: 'demo-card', terms: false };

function Field({ name, label, form, errors, set, type = 'text', autoComplete, optional, inputMode }: {
  name: keyof FormState; label: string; form: FormState; errors: FormErrors; set: (k: keyof FormState, v: string) => void;
  type?: string; autoComplete?: string; optional?: boolean; inputMode?: 'numeric' | 'tel' | 'email';
}) {
  const err = errors[name];
  return (
    <label className={`field ${err ? 'has-error' : ''}`}>
      <span>{label}{optional && <span className="muted"> (optional)</span>}</span>
      <input
        name={name}
        type={type}
        value={form[name] as string}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={!!err}
        aria-describedby={err ? `${name}-err` : undefined}
        onChange={(e) => set(name, e.target.value)}
      />
      {err && <span className="field-error" id={`${name}-err`}>{err}</span>}
    </label>
  );
}

export function Checkout() {
  const { lines, totals, placeOrder, clearCart } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  const set = (k: keyof FormState, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  if (lines.length === 0) {
    return (
      <div className="page container empty-state">
        <h1 className="page-title">Checkout</h1>
        <p>Your cart is empty, so there is nothing to check out.</p>
        <Link to="/collections/all" className="btn">Continue shopping</Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: FormErrors = { ...validateAddress(form) };
    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;
    if (!form.terms) errs.terms = 'Please accept the terms to continue';
    setErrors(errs);
    if (Object.keys(errs).length) {
      setSubmitError('Please correct the highlighted fields.');
      const first = document.querySelector<HTMLInputElement>(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }
    setSubmitError(undefined);
    setSubmitting(true);
    setTimeout(() => {
      const order: Order = {
        number: `DEMO-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 10)}`,
        createdAt: new Date().toISOString(),
        email: form.email.trim().toLowerCase(),
        address: { firstName: form.firstName, lastName: form.lastName, address1: form.address1, address2: form.address2, zip: form.zip, city: form.city, country: form.country, phone: form.phone },
        shippingMethod: 'Free delivery (3–7 working days)',
        paymentMethod: PAYMENT_METHODS.find((p) => p.id === form.payment)!.label,
        lines: lines.map((l) => ({ title: l.product.title, variantTitle: l.variant.title, image: l.variant.image, quantity: l.quantity, unitPrice: l.variant.price })),
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        total: totals.total,
      };
      placeOrder(order);
      clearCart();
      navigate(`/order/${order.number}`, { replace: true });
    }, 900);
  };

  return (
    <div className="page container">
      <h1 className="page-title">Checkout</h1>
      <p className="demo-banner" role="note">
        <strong>Demo checkout.</strong> No real order is placed and no payment is taken. Your details are stored only in this browser.
      </p>
      <div className="checkout">
        <form className="checkout-form" noValidate onSubmit={submit}>
          <section>
            <h2>Contact</h2>
            <Field name="email" label="Email" type="email" autoComplete="email" inputMode="email" form={form} errors={errors} set={set} />
          </section>
          <section>
            <h2>Delivery</h2>
            <label className={`field ${errors.country ? 'has-error' : ''}`}>
              <span>Country</span>
              <select name="country" value={form.country} onChange={(e) => set('country', e.target.value)} autoComplete="country">
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </label>
            <div className="field-row">
              <Field name="firstName" label="First name" autoComplete="given-name" form={form} errors={errors} set={set} />
              <Field name="lastName" label="Last name" autoComplete="family-name" form={form} errors={errors} set={set} />
            </div>
            <Field name="address1" label="Street and house number" autoComplete="address-line1" form={form} errors={errors} set={set} />
            <Field name="address2" label="Apartment, suite, etc." optional autoComplete="address-line2" form={form} errors={errors} set={set} />
            <div className="field-row">
              <Field name="zip" label="Postal code" autoComplete="postal-code" form={form} errors={errors} set={set} />
              <Field name="city" label="City" autoComplete="address-level2" form={form} errors={errors} set={set} />
            </div>
            <Field name="phone" label="Phone" optional type="tel" autoComplete="tel" inputMode="tel" form={form} errors={errors} set={set} />
          </section>
          <section>
            <h2>Shipping method</h2>
            <label className="choice on">
              <input type="radio" checked readOnly /> <span>Free delivery · 3–7 working days</span> <strong>Free</strong>
            </label>
          </section>
          <section>
            <h2>Payment</h2>
            {PAYMENT_METHODS.map((p) => (
              <label key={p.id} className={`choice ${form.payment === p.id ? 'on' : ''}`}>
                <input type="radio" name="payment" value={p.id} checked={form.payment === p.id} onChange={() => set('payment', p.id)} />
                <span>{p.label}</span>
              </label>
            ))}
          </section>
          <label className={`check terms ${errors.terms ? 'has-error' : ''}`}>
            <input type="checkbox" name="terms" checked={form.terms} onChange={(e) => set('terms', e.target.checked)} />
            <span>I understand this is a demo and accept the <Link to="/policies/terms-of-sale">terms of sale</Link>.</span>
          </label>
          {errors.terms && <p className="field-error">{errors.terms}</p>}
          {submitError && <p className="form-error" role="alert">{submitError}</p>}
          <button className="btn btn-block btn-lg" disabled={submitting}>
            {submitting ? <span className="spinner" aria-label="Placing order" /> : `Place demo order · ${formatMoney(totals.total)}`}
          </button>
        </form>
        <aside className="checkout-summary">
          <h2>Order summary</h2>
          <ul className="summary-lines">
            {lines.map((l) => (
              <li key={l.variantId}>
                <span className="summary-img">
                  <Img src={l.variant.image} alt={l.product.title} width={120} />
                  <span className="summary-qty">{l.quantity}</span>
                </span>
                <span className="summary-name">{l.product.title}<small>{l.variant.title}</small></span>
                <span>{formatMoney(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <CartSummary />
        </aside>
      </div>
    </div>
  );
}

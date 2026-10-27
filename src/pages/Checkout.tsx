import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../state/ShopContext';
import { COUNTRIES, validateAddress, validateEmail, type Errors } from '../lib/validation';
import type { Address, Order } from '../lib/types';
import { Img } from '../components/Img';
import { formatMoney } from '../lib/money';
import { CartSummary } from '../components/CartLines';

const PAYMENT_METHODS = [
  { id: 'demo-card', label: 'Kreditkarte (Demo – es werden keine Kartendaten abgefragt)' },
  { id: 'demo-paypal', label: 'PayPal (Demo)' },
  { id: 'demo-invoice', label: 'Rechnung (Demo)' },
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
        <h1 className="page-title">Kasse</h1>
        <p>Dein Warenkorb ist leer.</p>
        <Link to="/collections/all" className="btn">Winterkollektion entdecken</Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: FormErrors = { ...validateAddress(form) };
    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;
    if (!form.terms) errs.terms = 'Bitte bestätige den Hinweis, um fortzufahren';
    setErrors(errs);
    if (Object.keys(errs).length) {
      setSubmitError('Bitte korrigiere die markierten Felder.');
      const first = document.querySelector<HTMLInputElement>(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }
    setSubmitError(undefined);
    setSubmitting(true);
    setTimeout(() => {
      const order: Order = {
        number: `PG-DEMO-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 10)}`,
        createdAt: new Date().toISOString(),
        email: form.email.trim().toLowerCase(),
        address: { firstName: form.firstName, lastName: form.lastName, address1: form.address1, address2: form.address2, zip: form.zip, city: form.city, country: form.country, phone: form.phone },
        shippingMethod: 'Versand: noch nicht festgelegt (Demo)',
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
      <h1 className="page-title">Kasse</h1>
      <p className="demo-banner" role="note">
        <strong>Demo-Kasse.</strong> Es wird keine echte Bestellung aufgegeben und nichts berechnet. Deine Angaben werden nur in diesem Browser gespeichert.
      </p>
      <div className="checkout">
        <form className="checkout-form" noValidate onSubmit={submit}>
          <section>
            <h2>Kontakt</h2>
            <Field name="email" label="E-Mail" type="email" autoComplete="email" inputMode="email" form={form} errors={errors} set={set} />
          </section>
          <section>
            <h2>Lieferadresse</h2>
            <label className={`field ${errors.country ? 'has-error' : ''}`}>
              <span>Land <span className="muted">(Demo – Lieferländer noch nicht festgelegt)</span></span>
              <select name="country" value={form.country} onChange={(e) => set('country', e.target.value)} autoComplete="country">
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </label>
            <div className="field-row">
              <Field name="firstName" label="Vorname" autoComplete="given-name" form={form} errors={errors} set={set} />
              <Field name="lastName" label="Nachname" autoComplete="family-name" form={form} errors={errors} set={set} />
            </div>
            <Field name="address1" label="Straße und Hausnummer" autoComplete="address-line1" form={form} errors={errors} set={set} />
            <Field name="address2" label="Adresszusatz" optional autoComplete="address-line2" form={form} errors={errors} set={set} />
            <div className="field-row">
              <Field name="zip" label="PLZ" autoComplete="postal-code" form={form} errors={errors} set={set} />
              <Field name="city" label="Ort" autoComplete="address-level2" form={form} errors={errors} set={set} />
            </div>
            <Field name="phone" label="Telefon" optional type="tel" autoComplete="tel" inputMode="tel" form={form} errors={errors} set={set} />
          </section>
          <section>
            <h2>Versand</h2>
            <label className="choice on">
              <input type="radio" checked readOnly /> <span>Versandart wird noch festgelegt (Demo)</span>
            </label>
          </section>
          <section>
            <h2>Zahlung</h2>
            {PAYMENT_METHODS.map((p) => (
              <label key={p.id} className={`choice ${form.payment === p.id ? 'on' : ''}`}>
                <input type="radio" name="payment" value={p.id} checked={form.payment === p.id} onChange={() => set('payment', p.id)} />
                <span>{p.label}</span>
              </label>
            ))}
          </section>
          <label className={`check terms ${errors.terms ? 'has-error' : ''}`}>
            <input type="checkbox" name="terms" checked={form.terms} onChange={(e) => set('terms', e.target.checked)} />
            <span>Mir ist bewusst, dass dies ein Demo-Shop ist und keine echte Bestellung entsteht.</span>
          </label>
          {errors.terms && <p className="field-error">{errors.terms}</p>}
          {submitError && <p className="form-error" role="alert">{submitError}</p>}
          <button className="btn btn-block btn-lg" disabled={submitting}>
            {submitting ? <span className="spinner" aria-label="Demo-Bestellung wird angelegt" /> : `Demo-Bestellung abschicken · ${formatMoney(totals.total)}`}
          </button>
        </form>
        <aside className="checkout-summary">
          <h2>Bestellübersicht</h2>
          <ul className="summary-lines">
            {lines.map((l) => (
              <li key={l.variantId}>
                <span className="summary-img">
                  <Img src={l.variant.image} alt={l.product.title} width={120} />
                  <span className="summary-qty">{l.quantity}</span>
                </span>
                <span className="summary-name">{l.product.title}{l.variant.title !== 'Standard' && <small>{l.variant.title}</small>}</span>
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

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FAQ } from '../lib/content';
import { Accordion } from '../components/Accordion';
import { POLICIES } from '../components/Footer';
import { validateEmail } from '../lib/validation';
import { NotFound } from './NotFound';

export function Faq() {
  return (
    <div className="page container narrow">
      <h1 className="page-title">FAQ</h1>
      {FAQ.map((f, i) => (
        <Accordion key={f.q} title={f.q} icon="chevron" defaultOpen={i === 0}>
          <div className="rte">{f.a}</div>
        </Accordion>
      ))}
      <p className="center muted gap">Still have a question? <Link to="/pages/contact">Contact us</Link>.</p>
    </div>
  );
}

export function About() {
  return (
    <div className="page container narrow rte">
      <h1 className="page-title">About Us</h1>
      <h2>The art of watchmaking reinvented</h2>
      <p>Born in Paris, <strong>Poedagar</strong> is more than just a watch brand: it's a vision. One that makes elegance and refinement accessible without compromising on quality. Inspired by the codes of luxury watchmaking, we select noble materials and work with passionate artisans to create pieces that stand the test of time.</p>
      <p><em>"Every Poedagar® watch tells a story: yours."</em></p>
      <h2>Quality, down to the smallest details</h2>
      <p>At Poedagar Paris, every watch receives special attention, from assembly to finishing.</p>
      <p>Selected materials, mastered details, reliable mechanisms: each piece is designed to combine elegance, precision, and durability.</p>
      <p className="center"><Link to="/collections/all" className="btn">Discover the collection</Link></p>
    </div>
  );
}

export function Returns() {
  return (
    <div className="page container narrow rte">
      <h1 className="page-title">Return & refund</h1>
      <p>Not satisfied? You can exercise your right of withdrawal within 14 days of receipt, without giving a reason. For our Buy 1, Get 1 Free offer, direct return shipping costs are your responsibility under our Terms and Conditions.</p>
      <p>The reference store also mentions a 14-day "satisfaction or your money back" policy: if your watch doesn't suit you, you can return it and receive a full refund.</p>
      <p>To start a return, please <Link to="/pages/contact">contact us</Link> with your order number.</p>
      <p className="demo-banner">Demo: no returns can actually be processed through this site.</p>
    </div>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', order: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  if (sent) {
    return (
      <div className="page container narrow empty-state">
        <h1 className="page-title">Thank you, {form.name.split(' ')[0]}!</h1>
        <p>Your message was recorded (demo – it was not sent to anyone).</p>
        <Link to="/" className="btn">Back to home</Link>
      </div>
    );
  }
  return (
    <div className="page container narrow">
      <h1 className="page-title">Contact</h1>
      <p className="center muted">Our customer service is available from 10 AM to 6 PM, Monday to Friday (information from the reference store).</p>
      <form
        className="contact-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const errs: Record<string, string> = {};
          if (!form.name.trim()) errs.name = 'Enter your name';
          const em = validateEmail(form.email);
          if (em) errs.email = em;
          if (form.message.trim().length < 10) errs.message = 'Please write at least 10 characters';
          setErrors(errs);
          if (Object.keys(errs).length) return;
          setSending(true);
          setTimeout(() => { setSending(false); setSent(true); }, 600);
        }}
      >
        {(['name', 'email', 'order'] as const).map((k) => (
          <label key={k} className={`field ${errors[k] ? 'has-error' : ''}`}>
            <span>{k === 'name' ? 'Name' : k === 'email' ? 'Email' : 'Order number'}{k === 'order' && <span className="muted"> (optional)</span>}</span>
            <input type={k === 'email' ? 'email' : 'text'} value={form[k]} onChange={(e) => set(k, e.target.value)} aria-invalid={!!errors[k]} />
            {errors[k] && <span className="field-error">{errors[k]}</span>}
          </label>
        ))}
        <label className={`field ${errors.message ? 'has-error' : ''}`}>
          <span>Message</span>
          <textarea rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} aria-invalid={!!errors.message} />
          {errors.message && <span className="field-error">{errors.message}</span>}
        </label>
        <button className="btn btn-block" disabled={sending}>{sending ? <span className="spinner" aria-label="Sending" /> : 'Send'}</button>
      </form>
    </div>
  );
}

export function Policy() {
  const { slug } = useParams();
  const policy = POLICIES.find((p) => p.slug === slug);
  if (!policy) return <NotFound />;
  return (
    <div className="page container narrow rte">
      <h1 className="page-title">{policy.title}</h1>
      <p className="demo-banner">
        Placeholder: the legal text of the reference store was not copied into this demo. Before going live, this page must be replaced with your own legally reviewed text.
      </p>
      <p><Link to="/pages/contact">Contact us</Link> if you have questions.</p>
    </div>
  );
}

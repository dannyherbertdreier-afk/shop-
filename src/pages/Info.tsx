import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FAQ, SIZE_GUIDE } from '../lib/content';
import { Accordion } from '../components/Accordion';
import { POLICIES } from '../components/Footer';
import { validateEmail } from '../lib/validation';
import credits from '../data/image-credits.json';
import { NotFound } from './NotFound';
import { usePageTitle } from '../hooks/usePageTitle';


function Placeholder({ children }: { children: ReactNode }) {
  return <p className="demo-banner" role="note"><strong>Platzhalter – noch nicht verbindlich.</strong> {children}</p>;
}

export function Faq() {
  usePageTitle('Größe & häufige Fragen');
  return (
    <div className="page container narrow">
      <h1 className="page-title">Größe & häufige Fragen</h1>
      <section className="rte size-box" aria-labelledby="size-title">
        <h2 id="size-title">So findest du die passende Größe</h2>
        {SIZE_GUIDE}
      </section>
      {FAQ.slice(1).map((f) => (
        <Accordion key={f.q} title={f.q} icon="chevron">
          <div className="rte">{f.a}</div>
        </Accordion>
      ))}
      <p className="center muted gap">Noch eine Frage? <Link to="/pages/contact">Schreib uns</Link>.</p>
    </div>
  );
}

export function About() {
  usePageTitle('Über PAWGUARD');
  return (
    <div className="page container narrow rte">
      <h1 className="page-title">Über PAWGUARD</h1>
      <p>PAWGUARD ist ein Onlineshop im Aufbau – für Hundebesitzer in Deutschland, die ihre Hunde bei Kälte, Regen, Schnee und Streusalz gut ausgestattet wissen möchten.</p>
      <h2>Wofür wir stehen wollen</h2>
      <ul>
        <li><strong>Funktion vor Schnickschnack:</strong> Produkte, die beim Spaziergang tatsächlich helfen.</li>
        <li><strong>Bewegungsfreiheit:</strong> Schnitte, in denen sich dein Hund wohlfühlen soll.</li>
        <li><strong>Ehrliche Angaben:</strong> Materialien, Versand und Rückgabe nennen wir erst, wenn sie feststehen.</li>
      </ul>
      <p>Derzeit zeigen wir Beispielprodukte, um Auswahl und Einkaufsablauf zu testen.</p>
      <p className="center"><Link to="/collections/all" className="btn">Zur Winterkollektion</Link></p>
    </div>
  );
}

export function Shipping() {
  usePageTitle('Versandinformationen');
  return (
    <div className="page container narrow rte">
      <h1 className="page-title">Versandinformationen</h1>
      <Placeholder>Versandkosten, Lieferzeiten und Lieferländer werden festgelegt, sobald Lieferanten und Versanddienstleister feststehen.</Placeholder>
      <p>Bis dahin ist die Kasse eine Demo: Es wird nichts versendet und nichts berechnet.</p>
    </div>
  );
}

export function Returns() {
  usePageTitle('Rückgabe');
  return (
    <div className="page container narrow rte">
      <h1 className="page-title">Rückgabe</h1>
      <Placeholder>Die Rückgabebedingungen und die Widerrufsbelehrung werden in einer späteren Phase erstellt und rechtlich geprüft.</Placeholder>
      <p>Fragen? <Link to="/pages/contact">Schreib uns</Link>.</p>
    </div>
  );
}

export function Contact() {
  usePageTitle('Kontakt');
  const [form, setForm] = useState({ name: '', email: '', order: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const LABELS = { name: 'Name', email: 'E-Mail', order: 'Bestellnummer' } as const;
  if (sent) {
    return (
      <div className="page container narrow empty-state">
        <h1 className="page-title">Danke, {form.name.split(' ')[0]}!</h1>
        <p>Deine Nachricht wurde gespeichert (Demo – sie wurde an niemanden verschickt).</p>
        <Link to="/" className="btn">Zur Startseite</Link>
      </div>
    );
  }
  return (
    <div className="page container narrow">
      <h1 className="page-title">Kontakt</h1>
      <p className="center muted">Kontaktdaten und Erreichbarkeit folgen zum Start. In der Demo wird das Formular nicht versendet.</p>
      <form
        className="contact-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const errs: Record<string, string> = {};
          if (!form.name.trim()) errs.name = 'Bitte gib deinen Namen ein';
          const em = validateEmail(form.email);
          if (em) errs.email = em;
          if (form.message.trim().length < 10) errs.message = 'Bitte schreib mindestens 10 Zeichen';
          setErrors(errs);
          if (Object.keys(errs).length) return;
          setSending(true);
          setTimeout(() => { setSending(false); setSent(true); }, 600);
        }}
      >
        {(['name', 'email', 'order'] as const).map((k) => (
          <label key={k} className={`field ${errors[k] ? 'has-error' : ''}`}>
            <span>{LABELS[k]}{k === 'order' && <span className="muted"> (optional)</span>}</span>
            <input type={k === 'email' ? 'email' : 'text'} value={form[k]} onChange={(e) => set(k, e.target.value)} aria-invalid={!!errors[k]} />
            {errors[k] && <span className="field-error">{errors[k]}</span>}
          </label>
        ))}
        <label className={`field ${errors.message ? 'has-error' : ''}`}>
          <span>Nachricht</span>
          <textarea rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} aria-invalid={!!errors.message} />
          {errors.message && <span className="field-error">{errors.message}</span>}
        </label>
        <button className="btn btn-block" disabled={sending}>{sending ? <span className="spinner" aria-label="Wird gesendet" /> : 'Nachricht senden'}</button>
      </form>
    </div>
  );
}

export function Policy() {
  const { slug } = useParams();
  const policy = POLICIES.find((p) => p.slug === slug);
  usePageTitle(policy?.title ?? 'Seite nicht gefunden');
  if (!policy) return <NotFound />;
  return (
    <div className="page container narrow rte">
      <h1 className="page-title">{policy.title}</h1>
      <Placeholder>Dieser Rechtstext wird in einer späteren Phase erstellt und rechtlich geprüft. Unternehmensangaben folgen.</Placeholder>
      <p><Link to="/pages/contact">Kontakt</Link></p>
    </div>
  );
}

export function ImageCredits() {
  usePageTitle('Bildnachweise');
  return (
    <div className="page container narrow">
      <h1 className="page-title">Bildnachweise</h1>
      <p className="muted center">Die Fotos in diesem Demo-Shop stammen von Wikimedia Commons. Sie wurden für die Website verkleinert. Sie zeigen Beispielmotive, nicht die angebotenen Produkte.</p>
      <ul className="credits">
        {credits.map((c) => (
          <li key={c.file}>
            <img src={c.file} alt="" loading="lazy" />
            <div>
              <a href={c.source} target="_blank" rel="noopener noreferrer">{c.title}</a>
              <span>Urheber: {c.author}</span>
              <span>Lizenz: {c.licenseUrl ? <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer">{c.license}</a> : c.license}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export const BRAND = 'PAWGUARD';

// Statements here describe the shop's intent only; no unverified product or service promises.
export const BENEFITS = [
  { icon: 'snow', title: 'Für kalte und nasse Tage', text: 'Mäntel, Overalls und Pfotenschutz für Schnee, Regen und Streusalz.' },
  { icon: 'move', title: 'Komfort unterwegs', text: 'Bei der Auswahl sollen Bewegungsfreiheit und Passform im Mittelpunkt stehen.' },
  { icon: 'leash', title: 'Praktisch für jeden Spaziergang', text: 'Durchdachte Begleiter – vom Leuchtanhänger bis zum Trockenmantel.' },
  { icon: 'ruler', title: 'Die passende Größe finden', text: 'Messtipps für Rückenlänge, Brust- und Halsumfang – Maßtabellen folgen.' },
] as const;

export const SIZE_GUIDE: ReactNode = (
  <>
    <p>So misst du deinen Hund am besten im Stehen und mit einem weichen Maßband:</p>
    <ul>
      <li><strong>Rückenlänge:</strong> vom Halsansatz bis zum Rutenansatz.</li>
      <li><strong>Brustumfang:</strong> an der breitesten Stelle hinter den Vorderbeinen.</li>
      <li><strong>Halsumfang:</strong> dort, wo normalerweise das Halsband sitzt.</li>
    </ul>
    <p>Die genauen Maßtabellen je Produkt folgen, sobald die Lieferanten feststehen.</p>
  </>
);

export const FAQ: { q: string; a: ReactNode }[] = [
  { q: 'Wie finde ich die richtige Größe?', a: SIZE_GUIDE },
  {
    q: 'Sind die Produkte schon bestellbar?',
    a: (
      <p>
        Noch nicht. PAWGUARD befindet sich im Aufbau. Alle Produkte sind <strong>Beispielprodukte</strong>, und die Kasse ist eine Demo: Es wird nichts berechnet und nichts versendet.
      </p>
    ),
  },
  {
    q: 'Wie lange dauert die Lieferung und was kostet der Versand?',
    a: <p>Versandkosten und Lieferzeiten werden festgelegt, sobald Lieferanten und Versanddienstleister feststehen. Sie werden vor jeder Bestellung klar angezeigt.</p>,
  },
  {
    q: 'Wie erreiche ich euch?',
    a: (
      <p>
        Über unser <Link to="/pages/contact">Kontaktformular</Link>. In der Demo werden Nachrichten nur in deinem Browser gespeichert und nicht versendet.
      </p>
    ),
  },
];

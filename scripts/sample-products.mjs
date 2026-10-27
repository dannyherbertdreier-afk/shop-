// Generates the sample (placeholder) catalogue in src/data/products.json.
// These are NOT real supplier products: names, prices and options are examples for the demo.
// Usage: node scripts/sample-products.mjs
import { writeFileSync } from 'node:fs';

const SAMPLE_NOTE =
  '<p><em>Beispielprodukt: Material, Maße, Pflegehinweise und Lieferzeit werden ergänzt, sobald ein Lieferant feststeht.</em></p>';
const sampleNote = (what) => `<p><em>Beispielprodukt: ${what} und Lieferzeit werden ergänzt, sobald ein Lieferant feststeht.</em></p>`;

const items = [
  {
    handle: 'wintermantel-nordwind', title: 'Wintermantel „Nordwind“', category: 'hundemaentel', price: 69.9,
    colors: ['Waldgrün', 'Anthrazit'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['images/steppjacke-beagle.jpg'], featured: 1, tags: ['mantel', 'jacke', 'gefüttert'],
    summary: 'Gefütterter Mantel für kalte Spaziergänge.',
    text: '<p>Ein gefütterter Wintermantel für kalte Tage. Rücken und Brust sind bedeckt, die Beine bleiben frei.</p><ul><li>Verschluss am Bauch</li><li>Öffnung für das Geschirr</li></ul>',
  },
  {
    handle: 'regenmantel-schauer', title: 'Regenmantel „Schauer“', category: 'hundemaentel', price: 49.9,
    colors: ['Senfgelb', 'Waldgrün'], sizes: ['S', 'M', 'L', 'XL'],
    images: ['images/regenmantel-basset.jpg'], featured: 5, tags: ['regen', 'kapuze'],
    summary: 'Leichter Mantel mit Kapuze für nasse Tage.',
    text: '<p>Ein leichter Regenmantel mit Kapuze für Schauer und nasse Wege.</p>',
  },
  {
    handle: 'steppweste-frost', title: 'Steppweste „Frost“', category: 'hundemaentel', price: 54.9,
    colors: ['Eisblau', 'Anthrazit'], sizes: ['XS', 'S', 'M', 'L'],
    images: [], featured: null, tags: ['weste', 'stepp'],
    summary: 'Wattierte Weste für frostige Tage.',
    text: '<p>Eine wattierte Steppweste für frostige Tage und kurze Runden im Schnee.</p>',
  },
  {
    handle: 'pfotenschuhe-trail', title: 'Pfotenschuhe „Trail“ (4er‑Set)', category: 'pfotenschutz', price: 39.9,
    colors: ['Anthrazit'], sizes: ['S', 'M', 'L', 'XL'], images: [], featured: 3, tags: ['schuhe', 'streusalz', 'pfoten'],
    summary: 'Vier Schuhe für Wege mit Schnee und Streusalz.',
    text: '<p>Ein Set aus vier Pfotenschuhen für Wege mit Schnee und Streusalz.</p><ul><li>Klettverschluss zum Anpassen</li></ul><p>Tipp: Gewöhne deinen Hund in Ruhe und zunächst drinnen an die Schuhe.</p>',
  },
  {
    handle: 'pfotenpflege-balsam', title: 'Pfotenpflege-Balsam', category: 'pfotenschutz', price: 14.9,
    colors: [], sizes: ['50 ml'], sizeLabel: 'Inhalt', note: sampleNote('Inhaltsstoffe, Anwendungshinweise'), images: [], featured: null, tags: ['balsam', 'pflege', 'pfoten'],
    summary: 'Pflege für Pfoten nach dem Winterspaziergang.',
    text: '<p>Ein Pflegebalsam für Pfoten nach dem Spaziergang.</p><p>Bei verletzten oder entzündeten Pfoten bitte tierärztlichen Rat einholen.</p>',
  },
  {
    handle: 'hundesocken-noppen', title: 'Hundesocken mit Noppen', category: 'pfotenschutz', price: 19.9,
    colors: ['Grau', 'Waldgrün'], sizes: ['S', 'M', 'L'], images: [], featured: null, tags: ['socken', 'drinnen'],
    summary: 'Socken mit Noppen für drinnen.',
    text: '<p>Weiche Socken mit Noppen auf der Unterseite, gedacht für drinnen.</p>',
  },
  {
    handle: 'winteroverall-schneefeld', title: 'Winter-Overall „Schneefeld“', category: 'winter-overalls', price: 79.9,
    colors: ['Schwarz', 'Waldgrün'], sizes: ['S', 'M', 'L', 'XL'],
    images: ['images/ganzkoerperanzug.jpg'], featured: 2, tags: ['overall', 'schnee', 'beine'],
    summary: 'Overall, der Rumpf und Beine bedeckt.',
    text: '<p>Ein Overall, der Rumpf und Beine bedeckt – für Spaziergänge im Schnee.</p><p>Tipp: Miss Rückenlänge, Brust- und Halsumfang, bevor du die Größe wählst.</p>',
  },
  {
    handle: 'regenoverall-matsch', title: 'Regen-Overall „Matsch“', category: 'winter-overalls', price: 64.9,
    colors: ['Oliv', 'Anthrazit'], sizes: ['S', 'M', 'L', 'XL'], images: [], featured: null, tags: ['overall', 'regen', 'matsch'],
    summary: 'Leichter Overall für nasse und matschige Wege.',
    text: '<p>Ein leichter Overall für nasse, matschige Wege.</p>',
  },
  {
    handle: 'strickpullover-kamin', title: 'Strickpullover „Kamin“', category: 'winterzubehoer', price: 34.9,
    colors: ['Hellblau', 'Rosa'], sizes: ['XS', 'S', 'M'],
    images: ['images/strickpullover-yorkies.jpg', 'images/strickpullover-detail.jpg'], featured: 4, tags: ['pullover', 'strick'],
    summary: 'Gestrickter Pullover für kleine Hunde.',
    text: '<p>Ein gestrickter Pullover für kleine Hunde – für drinnen und kurze Runden.</p>',
  },
  {
    handle: 'led-leuchtanhaenger', title: 'LED-Leuchtanhänger', category: 'winterzubehoer', price: 12.9,
    colors: ['Orange', 'Weiß'], sizes: [], images: [], featured: 6, tags: ['licht', 'dunkel', 'sichtbarkeit'],
    summary: 'Kleines Licht für Halsband oder Geschirr an dunklen Abenden.',
    text: '<p>Ein kleiner Leuchtanhänger für Halsband oder Geschirr – für Spaziergänge in der Dämmerung.</p>',
  },
  {
    handle: 'trockenmantel-nachspiel', title: 'Trockenmantel „Nachspiel“', category: 'winterzubehoer', price: 44.9,
    colors: ['Sand', 'Waldgrün'], sizes: ['S', 'M', 'L', 'XL'], images: [], featured: null, tags: ['handtuch', 'bademantel', 'trocknen'],
    summary: 'Trockenmantel für nach dem Spaziergang.',
    text: '<p>Ein Mantel zum Abtrocknen nach nassen Spaziergängen.</p>',
  },
  {
    handle: 'leine-reflexstreifen', title: 'Leine mit Reflexstreifen', category: 'winterzubehoer', price: 24.9,
    colors: ['Waldgrün', 'Orange'], sizes: ['1,5 m', '2 m'], sizeLabel: 'Länge', images: [], featured: null, tags: ['leine', 'reflektor', 'reflexstreifen'],
    summary: 'Leine mit eingenähtem Reflexstreifen für die dunkle Jahreszeit.',
    text: '<p>Eine Leine mit eingenähtem Reflexstreifen für die dunkle Jahreszeit.</p>',
  },
];

const products = items.map((it, i) => {
  const options = [];
  if (it.colors.length) options.push({ name: 'Farbe', values: it.colors });
  if (it.sizes.length) options.push({ name: it.sizeLabel ?? 'Größe', values: it.sizes });
  const combos = options.reduce((acc, o) => acc.flatMap((c) => o.values.map((v) => [...c, v])), [[]]);
  return {
    id: String(1000 + i),
    handle: it.handle,
    title: it.title,
    category: it.category,
    tags: it.tags,
    isExample: true,
    summary: it.summary,
    descriptionHtml: it.text + (it.note ?? SAMPLE_NOTE),
    options,
    images: it.images,
    variants: combos.map((combo, j) => ({
      id: `${it.handle}-${j + 1}`,
      title: combo.join(' / ') || 'Standard',
      options: combo,
      price: Math.round(it.price * 100),
      compareAtPrice: null,
      available: true,
      image: it.images[0] ?? null,
    })),
    featuredRank: it.featured,
  };
});

writeFileSync(new URL('../src/data/products.json', import.meta.url), JSON.stringify(products, null, 2) + '\n');
console.log(`Wrote ${products.length} sample products (${products.reduce((n, p) => n + p.variants.length, 0)} variants).`);

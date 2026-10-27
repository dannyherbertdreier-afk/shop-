// Converts a Shopify `/products.json` export into the shop's data format.
// Usage: node scripts/import-products.mjs [path-to-products.json]
import { readFileSync, writeFileSync } from 'node:fs';

const input = process.argv[2] ?? 'scripts/source/products.json';
const raw = JSON.parse(readFileSync(input, 'utf8')).products;

// Products featured in the reference homepage "Our Customers' Favorite Watches" carousel (in order).
const BESTSELLERS = [
  'poedagar-kings-oak', 'poedagar-924', 'poedagar910', 'oak-poedagar-930', 'poedagar-613-gold-1',
  'poedagar-613-argent', 'poedagar-936', 'blake-s1-uhr', 'poedagar-960', 'poedagar-815',
  'poedagar-688', 'kings-bing', 'armor-dive-s2-watch', 'poedagar-bang-watch',
];

const cents = (v) => (v == null || v === '' ? null : Math.round(parseFloat(v) * 100));

const ALLOWED = new Set(['p', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'br', 'h2', 'h3', 'h4', 'table', 'tbody', 'tr', 'td', 'th']);
function sanitize(html) {
  return (html ?? '')
    .replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/?([a-z0-9]+)[^>]*>/gi, (tag, name) => {
      name = name.toLowerCase();
      if (!ALLOWED.has(name)) return '';
      return tag.startsWith('</') ? `</${name}>` : `<${name}>`;
    })
    .replace(/<p>\s*<\/p>/g, '')
    .trim();
}

const products = raw.map((p) => {
  const imageById = new Map(p.images.map((i) => [i.id, i.src]));
  const variants = p.variants.map((v) => ({
    id: String(v.id),
    title: v.title,
    price: cents(v.price),
    compareAtPrice: cents(v.compare_at_price),
    available: Boolean(v.available),
    image: (v.featured_image && v.featured_image.src) || imageById.get(v.image_id) || p.images[0]?.src || null,
  }));
  return {
    id: String(p.id),
    handle: p.handle,
    title: p.title,
    vendor: p.vendor,
    type: p.product_type,
    tags: p.tags,
    createdAt: p.created_at,
    descriptionHtml: sanitize(p.body_html),
    optionName: p.options[0]?.name ?? 'Variant',
    images: p.images.map((i) => i.src),
    variants,
    bestsellerRank: BESTSELLERS.includes(p.handle) ? BESTSELLERS.indexOf(p.handle) + 1 : null,
  };
});

writeFileSync('src/data/products.json', JSON.stringify(products, null, 2) + '\n');
console.log(`Imported ${products.length} products (${products.filter((p) => p.bestsellerRank).length} best sellers).`);

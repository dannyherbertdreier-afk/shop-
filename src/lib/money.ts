const fmt = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

export const formatMoney = (cents: number) => fmt.format(cents / 100);

/** Requests a resized image from the Shopify CDN (falls back to the original URL). */
export function sizedImage(src: string | null | undefined, width: number): string | undefined {
  if (!src) return undefined;
  if (!src.includes('cdn.shopify.com')) return src;
  return `${src}${src.includes('?') ? '&' : '?'}width=${width}`;
}

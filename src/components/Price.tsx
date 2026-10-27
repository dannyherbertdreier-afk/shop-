import { formatMoney } from '../lib/money';

export function Price({ price, compareAt, className = '' }: { price: number; compareAt?: number | null; className?: string }) {
  const onSale = compareAt != null && compareAt > price;
  return (
    <span className={`price ${className}`}>
      <span className="visually-hidden">{onSale ? 'Sale price' : 'Price'}</span>
      <span className="price-now">{formatMoney(price)}</span>
      {onSale && (
        <>
          <span className="visually-hidden">Regular price</span>
          <s className="price-was">{formatMoney(compareAt)}</s>
        </>
      )}
    </span>
  );
}

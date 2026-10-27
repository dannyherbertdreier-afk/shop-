import { formatMoney } from '../lib/money';

export function Price({ price, compareAt, from, className = '' }: { price: number; compareAt?: number | null; from?: boolean; className?: string }) {
  const onSale = compareAt != null && compareAt > price;
  return (
    <span className={`price ${className}`}>
      <span className="price-now">{from && 'ab '}{formatMoney(price)}</span>
      {onSale && (
        <>
          <span className="visually-hidden">statt</span>
          <s className="price-was">{formatMoney(compareAt)}</s>
        </>
      )}
    </span>
  );
}

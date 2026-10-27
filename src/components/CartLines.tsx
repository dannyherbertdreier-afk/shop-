import { Link } from 'react-router-dom';
import { useShop } from '../state/ShopContext';
import { Img } from './Img';
import { Price } from './Price';
import { QtyStepper } from './QtyStepper';
import { IconTrash } from './Icons';
import { formatMoney } from '../lib/money';

export function CartLines({ onNavigate }: { onNavigate?: () => void }) {
  const { lines, setQuantity, removeLine } = useShop();
  return (
    <ul className="cart-lines">
      {lines.map((l) => (
        <li key={l.variantId} className="cart-line">
          <Link to={`/products/${l.handle}`} onClick={onNavigate} className="cart-line-img">
            <Img src={l.variant.image ?? l.product.images[0]} alt={l.product.title} width={160} />
          </Link>
          <div className="cart-line-info">
            <Link to={`/products/${l.handle}`} onClick={onNavigate} className="cart-line-title">
              {l.product.title}
            </Link>
            <span className="cart-line-variant">
              {l.product.optionName}: {l.variant.title}
            </span>
            <Price price={l.variant.price} compareAt={l.variant.compareAtPrice} className="small" />
            <div className="cart-line-actions">
              <QtyStepper value={l.quantity} onChange={(q) => setQuantity(l.variantId, q)} label={l.product.title} />
              <button className="link-btn" onClick={() => removeLine(l.variantId)} aria-label={`Remove ${l.product.title} ${l.variant.title}`}>
                <IconTrash size={18} />
              </button>
            </div>
          </div>
          <span className="cart-line-total">{formatMoney(l.lineTotal)}</span>
        </li>
      ))}
    </ul>
  );
}

export function CartSummary() {
  const { totals } = useShop();
  const unitsToNextFree = totals.itemCount % 2 === 1 ? 1 : 0;
  return (
    <div className="cart-summary">
      {unitsToNextFree > 0 && (
        <p className="promo-hint">🎁 Add 1 more watch – the cheaper one is free (Buy 1, Get 1 Free).</p>
      )}
      <dl>
        <div><dt>Subtotal</dt><dd>{formatMoney(totals.subtotal)}</dd></div>
        {totals.discount > 0 && (
          <div className="discount"><dt>Buy 1, Get 1 Free</dt><dd>−{formatMoney(totals.discount)}</dd></div>
        )}
        <div><dt>Shipping</dt><dd>{totals.shipping === 0 ? 'Free' : formatMoney(totals.shipping)}</dd></div>
        <div className="total"><dt>Total</dt><dd>{formatMoney(totals.total)}</dd></div>
      </dl>
    </div>
  );
}

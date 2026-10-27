import { Link } from 'react-router-dom';
import { useShop } from '../state/ShopContext';
import { Img } from './Img';
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
            <Img src={l.variant.image ?? l.product.images[0]} alt="" width={200} />
          </Link>
          <div className="cart-line-info">
            <Link to={`/products/${l.handle}`} onClick={onNavigate} className="cart-line-title">
              {l.product.title}
            </Link>
            {l.variant.title !== 'Standard' && <span className="cart-line-variant">{l.variant.title}</span>}
            <span className="cart-line-unit">{formatMoney(l.variant.price)} / Stück</span>
            <div className="cart-line-actions">
              <QtyStepper value={l.quantity} onChange={(q) => setQuantity(l.variantId, q)} label={l.product.title} />
              <button className="link-btn" onClick={() => removeLine(l.variantId)} aria-label={`${l.product.title} (${l.variant.title}) aus dem Warenkorb entfernen`}>
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
  return (
    <div className="cart-summary">
      <dl>
        <div><dt>Zwischensumme</dt><dd>{formatMoney(totals.subtotal)}</dd></div>
        <div><dt>Versand</dt><dd className="muted">noch nicht festgelegt</dd></div>
        <div className="total"><dt>Gesamt (Demo)</dt><dd>{formatMoney(totals.total)}</dd></div>
      </dl>
      <p className="small muted">Demo: Versandkosten werden ergänzt, sobald ein Versanddienstleister feststeht.</p>
    </div>
  );
}

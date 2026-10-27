import { Link } from 'react-router-dom';
import { useShop } from '../state/ShopContext';
import { CartLines, CartSummary } from '../components/CartLines';
import { usePageTitle } from '../hooks/usePageTitle';

export function Cart() {
  const { lines, clearCart } = useShop();
  usePageTitle('Warenkorb');
  return (
    <div className="page container">
      <h1 className="page-title">Warenkorb</h1>
      {lines.length === 0 ? (
        <div className="empty-state">
          <p>Dein Warenkorb ist leer.</p>
          <Link to="/collections/all" className="btn">Winterkollektion entdecken</Link>
        </div>
      ) : (
        <div className="cart-page">
          <div>
            <CartLines />
            <button className="link-btn link-underline" onClick={clearCart}>Warenkorb leeren</button>
          </div>
          <aside className="cart-page-summary">
            <CartSummary />
            <Link to="/checkout" className="btn btn-block">Zur Kasse (Demo)</Link>
            <Link to="/collections/all" className="btn btn-outline btn-block">Weiter einkaufen</Link>
          </aside>
        </div>
      )}
    </div>
  );
}

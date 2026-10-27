import { Link } from 'react-router-dom';
import { useShop } from '../state/ShopContext';
import { CartLines, CartSummary } from '../components/CartLines';

export function Cart() {
  const { lines, clearCart } = useShop();
  return (
    <div className="page container">
      <h1 className="page-title">Your cart</h1>
      {lines.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty</p>
          <Link to="/collections/all" className="btn">Continue shopping</Link>
        </div>
      ) : (
        <div className="cart-page">
          <div>
            <CartLines />
            <button className="link-btn link-underline" onClick={clearCart}>Empty cart</button>
          </div>
          <aside className="cart-page-summary">
            <CartSummary />
            <Link to="/checkout" className="btn btn-block">Check out</Link>
            <Link to="/collections/all" className="btn btn-outline btn-block">Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
}

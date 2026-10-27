import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../state/ShopContext';
import { CartLines, CartSummary } from './CartLines';
import { IconClose } from './Icons';

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, totals } = useShop();
  const navigate = useNavigate();
  const close = () => setCartOpen(false);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', cartOpen);
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cartOpen, setCartOpen]);

  return (
    <>
      <div className={`drawer-backdrop ${cartOpen ? 'show' : ''}`} onClick={close} />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen} aria-label="Warenkorb" role="dialog">
        <div className="drawer-head">
          <h2>Warenkorb {totals.itemCount > 0 && <span className="muted">({totals.itemCount})</span>}</h2>
          <button className="icon-btn" aria-label="Warenkorb schließen" onClick={close}>
            <IconClose />
          </button>
        </div>
        {cartOpen && (lines.length === 0 ? (
          <div className="empty-state">
            <p>Dein Warenkorb ist leer.</p>
            <Link to="/collections/all" className="btn" onClick={close}>
              Winterkollektion entdecken
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer-body">
              <CartLines onNavigate={close} />
            </div>
            <div className="drawer-foot">
              <CartSummary />
              <button className="btn btn-block" onClick={() => { close(); navigate('/checkout'); }}>
                Zur Kasse (Demo)
              </button>
              <Link to="/cart" className="btn btn-outline btn-block" onClick={close}>
                Warenkorb ansehen
              </Link>
            </div>
          </>
        ))}
      </aside>
    </>
  );
}

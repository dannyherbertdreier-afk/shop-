import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useShop } from '../state/ShopContext';
import { IconBag, IconChat, IconClose, IconMenu, IconSearch, IconUser } from './Icons';
import { CartDrawer } from './CartDrawer';
import { SearchOverlay } from './SearchOverlay';
import { Footer } from './Footer';

export const NAV = [
  { to: '/collections/all', label: 'Winterkollektion' },
  { to: '/collections/hundemaentel', label: 'Hundemäntel' },
  { to: '/collections/pfotenschutz', label: 'Pfotenschutz' },
  { to: '/collections/winter-overalls', label: 'Overalls' },
  { to: '/collections/winterzubehoer', label: 'Zubehör' },
  { to: '/pages/faq', label: 'Größe & Fragen' },
];

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className={`logo ${dark ? 'logo-dark' : ''}`} aria-label="PAWGUARD – zur Startseite">
      PAWGUARD
    </Link>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { totals, setCartOpen, setSearchOpen } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen);
  }, [menuOpen]);

  return (
    <>
      <a href="#main" className="skip-link">Zum Inhalt springen</a>
      <div className="topbar" role="note">
        Demo-Shop im Aufbau · Beispielprodukte · keine echten Bestellungen
      </div>
      <header className="header">
        <div className="header-inner">
          <button className="icon-btn only-mobile" aria-label="Menü öffnen" onClick={() => setMenuOpen(true)}>
            <IconMenu />
          </button>
          <Logo />
          <nav className="nav-desktop" aria-label="Hauptnavigation">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button className="icon-btn" aria-label="Suche öffnen" onClick={() => setSearchOpen(true)}>
              <IconSearch />
            </button>
            <Link className="icon-btn only-desktop-sm" to="/account" aria-label="Meine Bestellungen">
              <IconUser />
            </Link>
            <button className="icon-btn cart-btn" aria-label={`Warenkorb, ${totals.itemCount} Artikel`} onClick={() => setCartOpen(true)}>
              <IconBag />
              {totals.itemCount > 0 && <span className="cart-count">{totals.itemCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer-backdrop ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)} />
      <aside className={`menu-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen} aria-label="Menü">
        <div className="drawer-head">
          <Logo dark />
          <button className="icon-btn" aria-label="Menü schließen" onClick={() => setMenuOpen(false)}>
            <IconClose />
          </button>
        </div>
        <nav className="menu-links">
          <NavLink to="/" end tabIndex={menuOpen ? 0 : -1}>Startseite</NavLink>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} tabIndex={menuOpen ? 0 : -1}>
              {n.label}
            </NavLink>
          ))}
          <NavLink to="/account" tabIndex={menuOpen ? 0 : -1}>Meine Bestellungen</NavLink>
          <NavLink to="/pages/contact" tabIndex={menuOpen ? 0 : -1}>Kontakt</NavLink>
        </nav>
      </aside>

      <main id="main">{children}</main>
      <Footer />

      <Link to="/pages/contact" className="help-bubble" aria-label="Fragen? Schreib uns">
        <IconChat size={20} />
        <span className="help-text">Fragen?</span>
      </Link>

      <CartDrawer />
      <SearchOverlay />
    </>
  );
}

import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useShop } from '../state/ShopContext';
import { IconBag, IconChat, IconClose, IconMenu, IconSearch, IconUser } from './Icons';
import { CartDrawer } from './CartDrawer';
import { SearchOverlay } from './SearchOverlay';
import { Footer } from './Footer';

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/collections/all', label: '2026 Collection' },
  { to: '/collections/best-sellers', label: 'Best Sellers' },
  { to: '/pages/track-order', label: 'Track my order' },
  { to: '/pages/returns', label: 'Return & refund' },
  { to: '/pages/about', label: 'About Us' },
  { to: '/pages/contact', label: 'Contact' },
  { to: '/pages/faq', label: 'FAQ' },
];

const ANNOUNCEMENTS = ['Buy 1 = Get 1 Free', 'Our 4th anniversary', 'Free delivery', '14-day right of withdrawal'];

export function Logo({ light = true }: { light?: boolean }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo-light' : ''}`} aria-label="Poedagar – home">
      <span className="logo-word">poedagar</span>
      <span className="logo-sub">Paris</span>
    </Link>
  );
}

function AnnouncementBar() {
  const row = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];
  return (
    <div className="announcement" aria-label="Announcements">
      <div className="marquee">
        {[0, 1].map((k) => (
          <div className="marquee-track" key={k} aria-hidden={k === 1}>
            {row.map((t, i) => (
              <span key={i}>
                {t} <span className="diamond">◇</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { totals, setCartOpen, setSearchOpen } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const overHero = pathname === '/';

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen);
  }, [menuOpen]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <AnnouncementBar />
      <header className={`header ${overHero && !scrolled ? 'header-transparent' : ''}`}>
        <div className="header-inner">
          <button className="icon-btn only-mobile" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <IconMenu />
          </button>
          <Logo />
          <nav className="nav-desktop" aria-label="Main">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <span className="locale only-desktop" title="Prices are shown in EUR">EUR / EN</span>
            <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <IconSearch />
            </button>
            <Link className="icon-btn only-desktop-sm" to="/account" aria-label="Account">
              <IconUser />
            </Link>
            <button className="icon-btn cart-btn" aria-label={`Cart, ${totals.itemCount} items`} onClick={() => setCartOpen(true)}>
              <IconBag />
              {totals.itemCount > 0 && <span className="cart-count">{totals.itemCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer-backdrop ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)} />
      <aside className={`menu-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen} aria-label="Menu">
        <div className="drawer-head">
          <Logo light={false} />
          <button className="icon-btn" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <IconClose />
          </button>
        </div>
        <nav className="menu-links">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} tabIndex={menuOpen ? 0 : -1}>
              {n.label}
            </NavLink>
          ))}
          <NavLink to="/account" tabIndex={menuOpen ? 0 : -1}>
            My orders
          </NavLink>
        </nav>
        <p className="menu-note">Prices in EUR · English</p>
      </aside>

      <main id="main" className={overHero ? 'main-hero' : ''}>
        {children}
      </main>
      <Footer />

      <Link to="/pages/contact" className="help-bubble" aria-label="Need help? Contact us">
        <span className="help-icon"><IconChat size={22} /></span>
        <span className="help-text">Need help?</span>
      </Link>

      <CartDrawer />
      <SearchOverlay />
    </>
  );
}

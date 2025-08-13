'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/bbqservices', label: 'BBQ Services' },
  { href: '/contact', label: 'Contact' },
];

const CART_KEY = 'uth_cart_v1';

function NavLink({ href, label, pathname, onClick }) {
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${styles.link} ${isActive ? styles.active : ''}`}
    >
      {label}
    </Link>
  );
}

export default function Navbar({ logo }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // close menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // read cart from localStorage (qty field) and keep in sync
  useEffect(() => {
    const read = () => {
      try {
        const items = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        const total = items.reduce((sum, i) => sum + (i.qty || 1), 0); // <- pure JS
        setCartCount(total);
      } catch (e) {
        setCartCount(0);
      }
    };

    // initial read
    read();

    // cross-tab changes
    const onStorage = (e) => {
      if (e.key === CART_KEY) read();
    };
    window.addEventListener('storage', onStorage);

    // same-tab custom events (emit these from shop/cart pages)
    const reRead = () => read();
    window.addEventListener('cart:add', reRead);
    window.addEventListener('cart:change', reRead);
    window.addEventListener('cart:remove', reRead);
    window.addEventListener('cart:clear', reRead);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('cart:add', reRead);
      window.removeEventListener('cart:change', reRead);
      window.removeEventListener('cart:remove', reRead);
      window.removeEventListener('cart:clear', reRead);
    };
  }, []);

  // lock body scroll when menu is open (mobile)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`${styles.scrim} ${open ? styles.scrimShow : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.brand} aria-label="Under The Hood BBQ home">
            {logo?.url ? (
              <Image
                src={logo.url}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                priority
                className={styles.logo}
              />
            ) : (
              <span className="font-hand" style={{ fontWeight: 700 }}>
                Under The Hood BBQ
              </span>
            )}
          </Link>

          <nav
            className={`${styles.nav} ${open ? styles.open : ''}`}
            id="main-menu"
            aria-hidden={!open}
          >
            {LINKS.map((l) => (
              <NavLink key={l.href} {...l} pathname={pathname} onClick={() => setOpen(false)} />
            ))}
            <Link href="/cart" className={`${styles.link} ${styles.cart}`} onClick={() => setOpen(false)}>
              <span aria-hidden>🛒</span>
              <span className={`${styles.badge} ${cartCount ? '' : styles.badgeHidden}`}>
                {cartCount}
              </span>
              <span className="sr-only">Cart</span>
            </Link>
          </nav>

          <button
            className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
            aria-label="Toggle menu"
            aria-controls="main-menu"
            aria-expanded={open ? 'true' : 'false'}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
    </>
  );
}

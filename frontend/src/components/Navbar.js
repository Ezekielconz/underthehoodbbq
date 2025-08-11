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

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const read = () => {
      try {
        const items = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(items.reduce((sum, i) => sum + (i.quantity || 1), 0));
      } catch {}
    };
    read();
    window.addEventListener('storage', read);
    return () => window.removeEventListener('storage', read);
  }, []);

  return (
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
              style={{ height: '40px', width: 'auto' }}
            />
          ) : (
            <span className="font-hand" style={{ fontWeight: 700 }}>
              Under The Hood BBQ
            </span>
          )}
        </Link>

        <nav className={`${styles.nav} ${open ? styles.open : ''}`} id="main-menu">
          {LINKS.map((l) => (
            <NavLink key={l.href} {...l} pathname={pathname} onClick={() => setOpen(false)} />
          ))}
          <Link href="/cart" className={`${styles.link} ${styles.cart}`}>
            <span aria-hidden>🛒</span>
            <span className={styles.badge}>{cartCount}</span>
            <span className="sr-only">Cart</span>
          </Link>
        </nav>

        <button
          className={styles.burger}
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
  );
}

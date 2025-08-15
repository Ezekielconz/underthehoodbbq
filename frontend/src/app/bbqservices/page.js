'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams, usePathname } from 'next/navigation';
import styles from './BBQServices.module.css';

// Lazy-load each tab’s content (separate files)
const Catering = dynamic(() => import('./Catering'));
const Masterclasses = dynamic(() => import('./Masterclasses'));
const Descaling = dynamic(() => import('./Descaling'));

// Add more tabs by extending this array
const TABS = [
  { key: 'catering', label: 'Catering', Component: Catering },
  { key: 'masterclasses', label: 'Masterclasses', Component: Masterclasses },
  { key: 'descaling', label: 'Descaling', Component: Descaling },
];

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageInner />
    </Suspense>
  );
}

/* --------- Fallback shown while search params/pathname resolve ---------- */
function PageSkeleton() {
  return (
    <div className={styles.pageRoot}>
      <main className={styles.page}>
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>BBQ SERVICES</h1>
          <nav className={`${styles.tabs} ${styles.heroTabs}`} aria-label="BBQ services tabs">
            <ul className={styles.tabList} role="tablist">
              {TABS.map(t => (
                <li key={t.key} role="presentation">
                  <span className={styles.tab}>{t.label}</span>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <section className={styles.tabPanel} />
      </main>
    </div>
  );
}

/* --------- Actual page that uses useSearchParams/usePathname ------------ */
function PageInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentKey = (searchParams.get('tab') || 'catering').toLowerCase();
  const active = TABS.find(t => t.key === currentKey) ?? TABS[0];
  const ActiveComponent = active.Component;

  const hrefFor = (key) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', key);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className={styles.pageRoot}>
      <main className={styles.page}>
        {/* HERO */}
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>BBQ SERVICES</h1>

          {/* Tabs inside hero */}
          <nav className={`${styles.tabs} ${styles.heroTabs}`} aria-label="BBQ services tabs">
            <ul className={styles.tabList} role="tablist">
              {TABS.map(tab => {
                const isActive = tab.key === active.key;
                return (
                  <li key={tab.key} role="presentation">
                    <Link
                      id={`tab-${tab.key}`}
                      href={hrefFor(tab.key)}
                      scroll={false}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`panel-${tab.key}`}
                      className={isActive ? styles.tabActive : styles.tab}
                    >
                      {tab.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>

        {/* ACTIVE PANEL */}
        <section
          id={`panel-${active.key}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.key}`}
          className={styles.tabPanel}
        >
          <ActiveComponent />
        </section>

        {/* STOCKISTS PROMO (optional) */}
        <section className={styles.strip}>
          <p className={styles.stripText}>
            Want it near you? Check our latest{' '}
            <Link href="/contact" className={styles.stripLink}>stockist enquiries</Link>.
          </p>
        </section>
      </main>
    </div>
  );
}

'use client';
import Link from 'next/link';
import styles from './BBQServices.module.css';

export default function Catering() {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Catering</h2>
      </div>
      <div className={styles.cardBody}>
        <p>
          We bring the whole BBQ setup to you—pit, canopy and crew—then cook and serve on-site.
          Perfect for teams, weddings and events that want legit smoked meats and sides without the hassle.
        </p>
        <ul className={styles.list}>
          <li>On-site cooking &amp; service with our kit</li>
          <li>Menus sized for groups and functions</li>
          <li>Add-ons available to round out your spread</li>
        </ul>
        <div className={styles.ctaRow}>
          <Link href="/contact" className={styles.button}>
            Enquire about catering
          </Link>
        </div>
      </div>
    </article>
  );
}

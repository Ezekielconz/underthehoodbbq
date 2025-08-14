'use client';
import Link from 'next/link';
import styles from './BBQServices.module.css';

export default function Masterclasses() {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>BBQ Masterclasses</h2>
      </div>
      <div className={styles.cardBody}>
        <p>
          Hands-on sessions that cover fuel choice, fire control and the core techniques of
          low &amp; slow and hot &amp; fast. You’ll learn the “why” behind the cook so you can
          repeat it at home with confidence.
        </p>
        <ul className={styles.list}>
          <li>Practical, step-by-step format</li>
          <li>Includes class notes (and usually an apron)</li>
          <li>Upcoming dates are posted regularly</li>
        </ul>
        <div className={styles.ctaRow}>
          <Link href="/contact" className={styles.buttonAlt}>
            Ask about the next class
          </Link>
        </div>
      </div>
    </article>
  );
}

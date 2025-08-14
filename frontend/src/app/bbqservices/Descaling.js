'use client';
import Link from 'next/link';
import styles from './BBQServices.module.css';

export default function Descaling() {
  return (
    <article className={styles.cardWide}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Descaling Service</h2>
      </div>
      <div className={styles.cardBody}>
        <p>
          Based in Stoke, Nelson—drop your grimy grills, oven trays and accessories to us and
          we’ll give them a 24-hour soak in our professional descaling tank. It’s like a day
          spa for steel: baked-on grease and carbon come off a treat.
        </p>
        <ul className={styles.specs}>
          <li><strong>Price:</strong> $125 + GST per tank (24-hour treatment)</li>
          <li><strong>Tank size:</strong> 82 × 51 × 57&nbsp;cm (≈ 240&nbsp;L)</li>
          <li><strong>Chemistry:</strong> Biodegradable, non-caustic; food-surface safe</li>
          <li><strong>Notes:</strong> Doesn’t remove rust; 75&nbsp;°C bath—some plastics not suitable</li>
        </ul>
        <p className={styles.callout}>
          Call <a href="tel:+64212420799" className={styles.link}>021&nbsp;242&nbsp;0799</a> to book a clean.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/contact" className={styles.button}>
            Book descaling
          </Link>
        </div>
      </div>
    </article>
  );
}

'use client';

import Link from 'next/link';
import styles from './BBQServices.module.css';

export default function BBQServicesPage() {
  return (
    <div className={styles.pageRoot}>
      <main className={styles.page}>
        {/* HERO */}
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>BBQ SERVICES</h1>
          <p className={styles.heroKicker}>
            Catering • Classes • Descaling
          </p>
        </header>

        {/* GRID */}
        <section className={styles.grid}>
          {/* CATERING */}
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
                <li>On-site cooking & service with our kit</li>
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

          {/* CLASSES */}
          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>BBQ Classes</h2>
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

          {/* DESCALING */}
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
        </section>

        {/* STOCKISTS PROMO (optional small strip) */}
        <section className={styles.strip}>
          <p className={styles.stripText}>
            Want it near you? Check our latest <Link href="/contact" className={styles.stripLink}>stockist enquiries</Link>.
          </p>
        </section>
      </main>
    </div>
  );
}

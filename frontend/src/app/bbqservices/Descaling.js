// app/components/Descaling.jsx
import styles from './Descaling.module.css';

export default function Descaling({
  images = [], // [{src, alt, caption}]
  contactHref = '/contact',
}) {
  return (
    <article className={styles.panel}>
      <div className="rte">
        <p><strong>Want your grimy BBQ grates and baked-on oven trays cleaned up like new?</strong></p>
        <p>
          Get in touch with us about our <strong>Descaling Service</strong>. We are based in <strong>Stoke, Nelson</strong>.
        </p>
        <p>
          Simply drop your gear to us and we’ll put it in our professional descaling tank for a <strong>24&nbsp;hour soak</strong>.
          It’s like a <em>day spa</em> for grills, trays and accessories—let them soak and be prepared to have them looking and feeling like new!
        </p>
        <p>
          If it’s filthy, baked-on grime or carbonised grease that’s difficult to shift, we’ll make easy work of it.
          It <strong>won’t remove rust</strong> (we can’t turn back time there) but stainless steel and ceramic finishes come up mint.
        </p>
        <p>Check out our gallery of before and after photos.</p>
      </div>

      {/* Specs */}
      <section className={styles.specsGroup}>
        <h3 className={styles.specsHeading}>Service Details</h3>
        <ul className={styles.specsList}>
          <li><strong>Price:</strong> $125 + GST per tank (24-hour treatment)</li>
          <li><strong>Tank size:</strong> 82 × 51 × 57&nbsp;cm (≈ 240&nbsp;L)</li>
          <li><strong>Chemistry:</strong> Biodegradable, non-caustic; food-surface safe</li>
          <li><strong>Temperature:</strong> 75&nbsp;°C bath — not suitable for some plastics</li>
          <li><strong>Post-treatment:</strong> Rinsed and ready to use</li>
        </ul>
        <p className={styles.note}>
          Note: Treatment <strong>doesn’t remove rust</strong>.
        </p>
      </section>

      {/* Optional gallery */}
      {Array.isArray(images) && images.length > 0 ? (
        <div className={styles.mediaGrid}>
          {images.map((img, i) => (
            <figure key={i} className={styles.mediaItem}>
              <img src={img.src} alt={img.alt || ''} loading="lazy" />
              {img.caption ? <figcaption>{img.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      ) : null}

      {/* Callout */}
      <p className={styles.callout}>
        Call <a href="tel:+64212420799" className={styles.link}>021&nbsp;242&nbsp;0799</a> to book a clean or find out more.
      </p>

      {/* CTAs */}
      <div className={styles.ctaRow}>
        <a href="tel:+64212420799" className={styles.button}>Call to Book</a>
        <a href={contactHref} className={`${styles.button} ${styles.buttonAlt}`}>Enquire Online</a>
      </div>
    </article>
  );
}

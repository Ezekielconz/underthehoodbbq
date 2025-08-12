import Image from 'next/image';
import styles from './NewSection.module.css';
import { getNewSectionProduct, extractNewSectionProduct } from '@/lib/strapi';

export default async function NewSection() {
  const row = await getNewSectionProduct().catch(() => null);

  // Dev-friendly placeholder
  if (!row) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <section className={styles.section} style={{ '--accent': '#444' }}>
          {/* FULL-WIDTH What's New bar at very top */}
          <div className={styles.labelBar}>
            <span className={styles.label}>What’s New</span>
          </div>

          <div className={styles.container}>
            <div className={styles.media}>
              <Image
                src="/hero.svg"
                alt=""
                width={560}
                height={560}
                className={styles.art}
                priority={false}
              />
            </div>
            <div className={styles.content}>
              <h2 className={styles.title}>No product selected</h2>
              <p className={styles.subtitle}>
                Pick a product in <strong>Home → navSection → product</strong> or publish a product
                to show here.
              </p>
              <p className={styles.category}>Product</p>
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  const p = extractNewSectionProduct(row);
  const flags = [
    p.diet.glutenFree && 'Gluten Free',
    p.diet.dairyFree && 'Dairy Free',
    p.diet.sugarFree && 'Sugar Free',
    p.diet.veganFriendly && 'Vegan Friendly',
  ].filter(Boolean);

  return (
    <section className={styles.section} style={{ '--accent': p.colour }}>
      {/* FULL-WIDTH What's New bar at very top */}
      <div className={styles.labelBar}>
        <span className={styles.label}>What’s New</span>
      </div>

      <div className={styles.container}>
        {/* IMAGE CENTERED */}
        <div className={styles.media}>
          <Image
            src={p.art || '/hero.svg'}
            alt={p.title || ''}
            width={560}
            height={560}
            className={styles.art}
            priority={false}
          />
        </div>

        {/* INFO BELOW */}
        <div className={styles.content}>
          <h2 className={styles.title}>{p.title}</h2>
          {p.subTitle && <p className={styles.subtitle}>{p.subTitle}</p>}
          <p className={styles.category}>{p.category || 'Product'}</p>

          {flags.length > 0 && (
            <ul className={styles.badges} role="list">
              {flags.map((f) => (
                <li key={f} className={styles.badge}>{f}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

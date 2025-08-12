import Image from 'next/image';
import Link from 'next/link';
import styles from './NewSection.module.css';
import { getLatestProductLite, extractLatestProduct } from '@/lib/strapi';

export default async function NewSection() {
  const latest = await getLatestProductLite().catch(() => null);
  if (!latest) return null;

  const p = extractLatestProduct(latest);
  const flags = [
    p.diet.glutenFree && 'Gluten Free',
    p.diet.dairyFree && 'Dairy Free',
    p.diet.sugarFree && 'Sugar Free',
    p.diet.veganFriendly && 'Vegan Friendly',
  ].filter(Boolean);

  return (
    <section className={styles.section} style={{ '--accent': p.colour }}>
      <div className={styles.container}>
        <div className={styles.media}>
          {p.art && (
            <Image
              src={p.art}
              alt=""
              width={720}
              height={720}
              className={styles.art}
              priority={false}
            />
          )}
        </div>

        <div className={styles.content}>
          <p className={styles.kicker}>
            New • {p.category || 'Product'}
          </p>
          <h2 className={styles.title}>{p.title}</h2>
          {p.subTitle && <p className={styles.subtitle}>{p.subTitle}</p>}

          {flags.length > 0 && (
            <ul className={styles.badges} role="list">
              {flags.map((f) => (
                <li key={f} className={styles.badge}>{f}</li>
              ))}
            </ul>
          )}

          <div className={styles.ctas}>
            <Link href={`/product/${p.slug}`} className={`${styles.btn} ${styles.primary}`}>
              View Product
            </Link>
            <Link href="/shop" className={`${styles.btn} ${styles.secondary}`}>
              Shop All
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

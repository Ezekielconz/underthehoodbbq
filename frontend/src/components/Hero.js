import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

// Locked-down hero config (no CMS)
const HERO = {
  titleImg: '/images/logo2.svg',  // public/images/logo2.svg
  graphicImg: '/images/bbq.svg',  // public/images/bbq.svg
  primary:   { label: 'Shop Now',      href: '/shop' },
  // I assumed this URL; change if yours differs
  secondary: { label: 'Masterclasses', href: '/bbqservices' },
};

export default function Hero() {
  return (
    <section className={styles.section} aria-labelledby="hero-heading">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* LEFT */}
          <div className={styles.left}>
            <Image
              src={HERO.titleImg}
              alt="Under The Hood BBQ"
              width={720}
              height={300}
              priority
              className={styles.titleImg}
            />
            <div className={styles.ctas}>
              <Link href={HERO.primary.href} className={`${styles.btn} ${styles.primary}`}>
                {HERO.primary.label}
              </Link>
              <Link href={HERO.secondary.href} className={`${styles.btn} ${styles.secondary}`}>
                {HERO.secondary.label}
              </Link>
            </div>
          </div>

          {/* RIGHT – graphic overlaps next section */}
          <div className={styles.right}>
            <Image
              src={HERO.graphicImg}
              alt=""                 // decorative
              width={720}
              height={720}
              priority
              className={styles.graphic}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

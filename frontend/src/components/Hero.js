import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';
import { getHome, extractHomeHero, getGlobal, extractLogo } from '@/lib/strapi';

export default async function Hero() {
  let hero = {
    titleImg: null,
    graphicImg: null,
    primaryText: 'Shop Now',
    primaryUrl: '/shop',
    secondaryText: 'BBQ Services',
    secondaryUrl: '/bbqservices',
  };

  try {
    const [homeRes, globalRes] = await Promise.all([
      getHome().catch(() => null),
      getGlobal().catch(() => null),
    ]);
    if (homeRes) hero = { ...hero, ...extractHomeHero(homeRes) };
    if (!hero.titleImg && globalRes) {
      const logo = extractLogo(globalRes);
      if (logo?.url) hero.titleImg = logo.url;
    }
  } catch {}

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* LEFT */}
          <div className={styles.left}>
            {hero.titleImg ? (
              <Image
                src={hero.titleImg}
                alt="Under The Hood BBQ"
                width={720}
                height={300}
                priority
                className={styles.titleImg}
              />
            ) : (
              <h1 className={styles.heading}>Under The Hood BBQ</h1>
            )}

            <div className={styles.ctas}>
              <Link href={hero.primaryUrl} className={`${styles.btn} ${styles.primary}`}>
                {hero.primaryText}
              </Link>
              <Link href={hero.secondaryUrl} className={`${styles.btn} ${styles.secondary}`}>
                {hero.secondaryText}
              </Link>
            </div>
          </div>

          {/* RIGHT – graphic overlaps next section */}
          <div className={styles.right}>
            <Image
              src={hero.graphicImg || '/hero.svg'}
              alt=""
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

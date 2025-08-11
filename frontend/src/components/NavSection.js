// src/components/NavSection.js
import Image from 'next/image';
import Link from 'next/link';
import styles from './NavSection.module.css';
import { getHome, extractNavSection } from '@/lib/strapi';

/** Pure presentational view */
function NavSectionView({ angle = -8, left = [], right = [], centerImg = null }) {
  return (
    <section className={styles.section} aria-label="Highlights navigation">
      <div className={styles.bg} aria-hidden />

      <div className={styles.ribbons} style={{ '--angle': `${angle}deg` }}>
        <div className={styles.columns}>
          <ul className={`${styles.list} ${styles.col}`}>
            {left.map((it, i) => (
              <li key={`L-${i}`} className={styles.item}>
                {it.href ? (
                  <Link href={it.href} className={styles.link}>{it.label}</Link>
                ) : (
                  <span className={`${styles.link} ${styles.disabled}`}>{it.label}</span>
                )}
              </li>
            ))}
          </ul>

          <div className={styles.center}>
            {centerImg && (
              <Image
                src={centerImg}
                alt=""
                width={420}
                height={420}
                className={styles.centerImg}
                priority
              />
            )}
          </div>

          <ul className={`${styles.list} ${styles.col}`}>
            {right.map((it, i) => (
              <li key={`R-${i}`} className={styles.item}>
                {it.href ? (
                  <Link href={it.href} className={styles.link}>{it.label}</Link>
                ) : (
                  <span className={`${styles.link} ${styles.disabled}`}>{it.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * Default export: server component.
 * - If you pass left/right/centerImg, it renders them.
 * - If not, it fetches from Strapi Home.navSection.
 */
export default async function NavSection(props) {
  const angle = props?.angle ?? -8;

  let left = props?.left ?? [];
  let right = props?.right ?? [];
  let centerImg = props?.centerImg ?? null;

  const missingAll =
    (!left || left.length === 0) &&
    (!right || right.length === 0) &&
    !centerImg;

  if (missingAll) {
    try {
      const home = await getHome();
      const data = extractNavSection(home);
      left = data.left || [];
      right = data.right || [];
      centerImg = data.centerImg || null;
    } catch {
      // fine—will fall back below
    }
  }

  // Ensure first line exists (non-clickable) if nothing came back
  if (!left || left.length === 0) {
    left = [{ label: "NELSON'S AWARD WINNING", href: null }];
  }

  return <NavSectionView angle={angle} left={left} right={right} centerImg={centerImg} />;
}

/* Optional: export the view if you ever want to render without fetch */
export { NavSectionView };

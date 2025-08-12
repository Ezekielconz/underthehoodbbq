import Image from 'next/image';
import Link from 'next/link';
import styles from './NavSection.module.css';
import { getHome, extractNavSection } from '@/lib/strapi';

function NavItem({ it, side }) {
  if (it?.href) {
    return (
      <Link href={it.href} className={styles.link} data-side={side}>
        {it.label}
      </Link>
    );
  }
  return (
    <a
      href=""
      aria-disabled="true"
      className={styles.link}
      data-side={side}
      style={{ pointerEvents: 'none', opacity: 0.9, textDecoration: 'none' }}
    >
      {it.label}
    </a>
  );
}

function NavList({ items = [], side }) {
  return (
    <ul className={`${styles.list} ${styles.col}`} data-side={side}>
      {items.map((it, i) => (
        <li key={`${side}-${i}`} className={styles.item}>
          <NavItem it={it} side={side} />
        </li>
      ))}
    </ul>
  );
}

function Byline() {
  return (
    <div className={styles.byline} aria-label="With Dave and Michelle King">
      <Image
        src="/crown.svg"
        alt=""
        width={28}
        height={28}
        className={styles.crown}
        aria-hidden="true"
        priority={false}
      />
      <span className={styles.bylineNames}>Dave and Michelle King</span>
    </div>
  );
}

export function NavSectionView({ angle = -8, left = [], right = [], centerImg = null }) {
  return (
    <section
      className={styles.section}
      aria-label="Highlights navigation"
      style={{ '--angle': `${angle}deg` }}
    >
      {/* Non-skewed orange underlay */}
      <div className={styles.brandUnderlay} aria-hidden="true" />

      {/* Byline pinned to the top of the first (skewed) orange band */}
      <div className={styles.bylineAbs}>
        <Byline />
      </div>

      {/* Skewed content ribbons */}
      <div className={styles.ribbons}>
        <div className={styles.columns}>
          <NavList items={left} side="left" />

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

          <NavList items={right} side="right" />
        </div>
      </div>
    </section>
  );
}

export default async function NavSection(props) {
  const angle = props?.angle ?? -8;

  let leftCMS = [];
  let rightCMS = [];
  let centerImgCMS = null;

  try {
    const home = await getHome();
    const data = extractNavSection(home);
    leftCMS = data.left || [];
    rightCMS = data.right || [];
    centerImgCMS = data.centerImg || null;
  } catch (e) {
    console.error('NavSection fetch failed:', e);
  }

  const left = Array.isArray(props?.left) && props.left.length ? props.left : leftCMS;
  const right = Array.isArray(props?.right) && props.right.length ? props.right : rightCMS;
  const centerImg = props?.centerImg ?? centerImgCMS;

  return <NavSectionView angle={angle} left={left} right={right} centerImg={centerImg} />;
}

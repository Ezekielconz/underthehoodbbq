import Image from 'next/image';
import Link from 'next/link';
import styles from './NavSection.module.css';
import { getHome, extractNavSection } from '@/lib/strapi';

/** @typedef {{ href?: string, label: string }} NavItem */

export default async function NavSection({ brandText = 'Dave and Michelle King' } = {}) {
  /** @type {NavItem[]} */ let left = [];
  /** @type {NavItem[]} */ let right = [];
  /** @type {string|null} */ let centerImg = null;

  try {
    const home = await getHome();
    const data = extractNavSection(home) || {};
    left = Array.isArray(data.left) ? data.left : [];
    right = Array.isArray(data.right) ? data.right : [];
    centerImg = data.centerImg || null;
  } catch (e) {
    console.error('NavSection fetch failed:', e);
  }

  if (!left.length && !right.length && !centerImg && !brandText) return null;

  const renderItem = (it, key) => (
    <li key={key} className={styles.item}>
      {it && it.href ? (
        <Link href={it.href} className={styles.link}>{it.label}</Link>
      ) : (
        <span className={styles.link}>{it?.label}</span>
      )}
    </li>
  );

  return (
    <section aria-label="Navigation" className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.left}>
          <ul className={styles.list}>{left.map((it, i) => renderItem(it, `left-${i}`))}</ul>
        </div>

        <div className={styles.center} aria-hidden="true" />

        <div className={styles.right}>
          <ul className={styles.list}>{right.map((it, i) => renderItem(it, `right-${i}`))}</ul>
        </div>
      </div>

      {brandText ? (
        <div className={styles.brandBlock}>
          <div className={styles.brandInner}>
            {centerImg && (
              <div className={styles.brandImageOverlay} aria-hidden="true">
                <Image
                  src={centerImg}
                  alt=""
                  width={600}
                  height={600}
                  className={styles.brandImage}
                  priority
                />
              </div>
            )}

            <div className={styles.brandGrid}>
              <div className={styles.brandLeft} />
              <div className={styles.brandCenter} aria-hidden="true" />
              <div className={styles.brandRight}>
                <span className={styles.brandRightInner}>
                  <Image
                    src="/crown.svg"
                    alt=""
                    width={28}
                    height={28}
                    className={styles.brandIcon}
                    aria-hidden="true"
                  />
                  <span className={styles.brandText}>{brandText}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

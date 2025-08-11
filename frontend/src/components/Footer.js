import Image from 'next/image';
import Link from 'next/link';
import path from 'path';
import { promises as fs } from 'fs';
import styles from './Footer.module.css';
import {
  getFooter,
  extractFooter,
  getGlobal,
  extractGlobals,
  extractLogo,
} from '@/lib/strapi';

export default async function Footer() {
  const [footerRes, globalRes] = await Promise.all([
    getFooter().catch(() => null),
    getGlobal().catch(() => null),
  ]);

  const footer  = footerRes ? extractFooter(footerRes) : { icons:{}, socials:[] };
  const basics  = globalRes ? extractGlobals(globalRes) : { name:'Under The Hood BBQ', email:'', phone:'' };
  const logo    = globalRes ? extractLogo(globalRes) : null;

  // Check if our agency logo file exists; fall back to text if not
  let hasAgencyLogo = false;
  try {
    await fs.access(path.join(process.cwd(), 'public', 'our-logo.svg'));
    hasAgencyLogo = true;
  } catch {}

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left: contact + socials */}
        <div className={styles.left}>
          <ul className={styles.list}>
            {/* Name (now part of the same list) */}
            <li className={`${styles.row} ${styles.rowName}`}>
              {footer.icons?.name && (
                <Image
                  src={footer.icons.name}
                  alt=""
                  aria-hidden="true"
                  width={20}
                  height={20}
                  className={`${styles.icon} ${styles.iconName}`}
                />
              )}
              <span className={styles.name}>{basics.name}</span>
            </li>

            {basics.email && (
              <li className={styles.row}>
                {footer.icons?.email && (
                  <Image
                    src={footer.icons.email}
                    alt=""
                    aria-hidden="true"
                    width={18}
                    height={18}
                    className={styles.icon}
                  />
                )}
                <a href={`mailto:${basics.email}`} className={styles.link}>
                  {basics.email}
                </a>
              </li>
            )}

            {basics.phone && (
              <li className={styles.row}>
                {footer.icons?.phone && (
                  <Image
                    src={footer.icons.phone}
                    alt=""
                    aria-hidden="true"
                    width={18}
                    height={18}
                    className={styles.icon}
                  />
                )}
                <a href={`tel:${basics.phone.replace(/\s+/g,'')}`} className={styles.link}>
                  {basics.phone}
                </a>
              </li>
            )}
          </ul>

          {footer.socials?.length > 0 && (
            <nav className={styles.socials} aria-label="Social links">
              {footer.socials.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  {s.icon && (
                    <Image src={s.icon} alt="" width={18} height={18} className={styles.icon} />
                  )}
                  <span>{s.label}</span>
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* Middle: their logo from Global (smaller) */}
        <div className={styles.middle}>
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={logo.alt || basics.name}
              width={logo.width || 160}
              height={logo.height || 58}
              className={styles.brandLogo}
            />
          ) : (
            <div className={styles.brandFallback}>{basics.name}</div>
          )}
        </div>

        {/* Right: our static logo (fallback to text) */}
        <div className={styles.right}>
          {hasAgencyLogo ? (
            <Link href="https://us" className={styles.powered} target="_blank">
              <Image
                src="/our-logo.svg"
                alt="Built by us"
                width={160}
                height={48}
                className={styles.ourLogo}
              />
              <span className="sr-only">Built by Us</span>
            </Link>
          ) : (
            <Link href="https://us" className={styles.agencyText} target="_blank">
              Built by us
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}

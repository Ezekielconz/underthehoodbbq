// src/components/Footer.js
import Image from 'next/image';
import Link from 'next/link';
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

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left: contact + socials */}
        <div className={styles.left}>
          <h3 className={styles.name}>{basics.name}</h3>

          <ul className={styles.list}>
            {basics.email && (
              <li className={styles.row}>
                {footer.icons?.email && (
                  <Image src={footer.icons.email} alt="" width={18} height={18} className={styles.icon} />
                )}
                <a href={`mailto:${basics.email}`} className={styles.link}>{basics.email}</a>
              </li>
            )}
            {basics.phone && (
              <li className={styles.row}>
                {footer.icons?.phone && (
                  <Image src={footer.icons.phone} alt="" width={18} height={18} className={styles.icon} />
                )}
                <a href={`tel:${basics.phone.replace(/\s+/g,'')}`} className={styles.link}>{basics.phone}</a>
              </li>
            )}
          </ul>

          {footer.socials?.length > 0 && (
            <nav className={styles.socials} aria-label="Social links">
              {footer.socials.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  {s.icon && <Image src={s.icon} alt="" width={18} height={18} className={styles.icon} />}
                  <span>{s.label}</span>
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* Middle: their logo from Global */}
        <div className={styles.middle}>
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={logo.alt || basics.name}
              width={logo.width || 220}
              height={logo.height || 80}
              className={styles.brandLogo}
            />
          ) : (
            <div className={styles.brandFallback}>{basics.name}</div>
          )}
        </div>

        {/* Right: our static logo */}
        <div className={styles.right}>
          <Link href="https://your-agency.example" className={styles.powered} target="_blank">
            <Image src="/our-logo.svg" alt="Built by Our Team" width={160} height={48} className={styles.ourLogo} />
            <span className="sr-only">Built by Our Team</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

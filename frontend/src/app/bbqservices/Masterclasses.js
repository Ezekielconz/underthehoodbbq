// app/components/Masterclasses.jsx
import styles from './Masterclasses.module.css';

export default function Masterclasses({
  images = [],
  ticketHrefLowSlow = '/contact',   // swap to your ticketing URL if you have one
  ticketHrefHotFast = '/contact',
  waitlistHref = '/contact',
  privateEnquiryHref = '/contact',
  onlineCourseHref = '/contact',
  vouchersHref = '/contact',
}) {
  const schedule2025 = [
    { date: 'Saturday 09 August 2025', title: 'Low & Slow Masterclass — Nelson' },
    { date: 'Saturday 13 September 2025', title: 'Hot & Fast Masterclass — Nelson' },
    { date: 'Saturday 20 September 2025', title: 'Hokitika BBQ Class' },
    { date: 'Saturday 27 September 2025', title: 'Christchurch BBQ Masterclass' },
    { date: 'Saturday 18 October 2025', title: 'Low & Slow Masterclass — Nelson' },
  ];

  return (
    <article className={styles.panel}>
      <div className="rte">
        <p>
          Everything needed for the class is supplied and <strong>everything we cook — we eat!</strong>{' '}
          Rally your mates, wear your stretchy pants and get ready to be filled with BBQ food &amp; knowledge!
        </p>
        <p>
          Classes can book out quickly and are <strong>capped at 30 participants</strong>.
        </p>
      </div>

      {/* Optional gallery */}
      {Array.isArray(images) && images.length > 0 ? (
        <div>
          {images.map((img, i) => (
            <figure key={i}>
              <img src={img.src} alt={img.alt || ''} loading="lazy" />
              {img.caption ? <figcaption>{img.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      ) : null}

      {/* Schedule */}
      <section>
        <h3>Upcoming 2025 Dates</h3>
        <ul className={styles.list}>
          {schedule2025.map((s, i) => (
            <li key={i}>
              <strong>{s.date}</strong> — {s.title}
            </li>
          ))}
        </ul>
        <p>
          <em>No Masterclasses in <strong>July</strong> — we’ll be in the USA.</em>
        </p>
        <div className={styles.ctaRow}>
          <a href={waitlistHref} className={styles.button}>Join waitlist for 2026</a>
          <a href={privateEnquiryHref} className={`${styles.button} ${styles.buttonAlt}`}>Private group enquiries</a>
        </div>
      </section>

      {/* Nelson info */}
      <section>
        <h3>When &amp; Where?</h3>
        <p>
          Nelson MasterClasses are held at our <strong>Under the Hood BBQ Headquarters in Stoke, Nelson</strong>.
          The sunny Tasman region is a great place to visit for a weekend and guests travel from around New Zealand
          to attend the class and enjoy the many local activities.
        </p>
      </section>

      {/* Class 1 */}
      <section>
        <h3>1: Low &amp; Slow BBQ MasterClass (full day) — <span>$195</span></h3>
        <p>
          Our highly popular Low &amp; Slow BBQ Masterclass is a <strong>full seven hour</strong> immersive experience!
          Whether you’re building on your knowledge or just starting out, you’ll leave with new tips, inspiration,
          and a very full belly. The day blends demonstrations, tastings, Q&amp;A, and hands-on learning in small groups.
        </p>
        <h4>Topics Covered</h4>
        <ul className={styles.list}>
          <li>Meat, meat and more MEAT — everything we cook, we eat!</li>
          <li>Fire management — cooking with charcoal, wood, and pellet</li>
          <li>How to prepare, trim and season your meats</li>
          <li>Temperature control of your pit</li>
          <li>Hands-on prep: pork swift ribs, chicken wings &amp; tomahawks</li>
          <li>Mastering pulled pork and brisket</li>
          <li>Creating flavour profiles</li>
          <li>Heaps of Q&amp;A time</li>
          <li>UTH BBQ cheat sheet to take home</li>
          <li>Giveaways and prizes on the day</li>
        </ul>
        <p>
          <em>No gas barbies in sight for this class (principles still apply to gas). For gas demos, see Hot &amp; Fast.</em>
        </p>
        <p>
          <em>Proudly supported by our sponsor <strong>Samba Fire and BBQ</strong>, whose generosity makes these days extra special!</em>
        </p>
        <div className={styles.ctaRow}>
          <a href={ticketHrefLowSlow} className={`${styles.button} ${styles.buttonAlt}`}>Buy Tickets — Low &amp; Slow</a>
        </div>
      </section>

      {/* Class 2 */}
      <section>
        <h3>2: Hot &amp; Fast BBQ MasterClass (half day) — <span>$189</span></h3>
        <p>
          Learn a whole range of BBQ cooks that can be done hot and fast with hands-on use of gas, charcoal,
          offset &amp; pellet grill smokers. We’ll cover popular recipes from our Instagram story favourites.
        </p>
        <h4>Topics Covered</h4>
        <ul className={styles.list}>
          <li>Pork belly with perfect crackling (gas &amp; charcoal methods)</li>
          <li>Smash burgers on the Smash Blade</li>
          <li>Whole chicken two ways — spatchcock &amp; butterfly</li>
          <li>Leg of lamb with rosemary &amp; garlic</li>
          <li>Reverse-seared thick-cut ribeye steaks &amp; chimichurri</li>
          <li>BBQ pies — yes, pies baked in the BBQ!</li>
        </ul>
        <p>
          <em>Ideal for mastering everyday cooks and comparing different barbecues and flavour profiles.
          Includes demos, tastings, Q&amp;A, and hands-on learning in small teams.</em>
        </p>
        <p>
          <em>Proudly supported by our sponsor <strong>Samba Fire and BBQ</strong>.</em>
        </p>
        <div className={styles.ctaRow}>
          <a href={ticketHrefHotFast} className={`${styles.button} ${styles.buttonAlt}`}>Buy Tickets — Hot &amp; Fast</a>
        </div>
      </section>

      {/* Online + Vouchers */}
      <section>
        <h3>Low &amp; Slow Online Course</h3>
        <p>
          Can’t make it in person? Our <strong>ONLINE</strong> course is a full masterclass in low &amp; slow cuts —
          <em>one-off price of $199 to keep</em>! Bite-sized chapters per topic/protein so you can revisit anytime.
        </p>
        <div className={styles.ctaRow}>
          <a href={onlineCourseHref} className={styles.button}>Get the Online Course</a>
        </div>
      </section>

      <section>
        <h3>Gift Vouchers</h3>
        <p>
          Shout someone a BBQ Class but not sure the date? Vouchers are available in varying denominations and can be
          redeemed for class tickets online. <em>Under the Hood Gift Vouchers</em> can be redeemed for Masterclasses
          and our online store products. If the recipient wants the Online Course, please contact us to arrange.
        </p>
        <div className={styles.ctaRow}>
          <a href={vouchersHref} className={styles.button}>Buy Vouchers</a>
          <a href="/contact" className={`${styles.button} ${styles.buttonAlt}`}>Contact us</a>
        </div>
      </section>

      <section>
        <p>
          Invite your friends for a day of fun, feasting and learning and get booked in!
          Private classes can be held by arrangement (min. 10 participants).
        </p>
        <div className={styles.ctaRow}>
          <a href={privateEnquiryHref} className={styles.button}>Private class enquiries</a>
        </div>
      </section>
    </article>
  );
}

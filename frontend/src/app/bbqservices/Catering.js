// app/components/Catering.jsx
import styles from './Catering.module.css';

export default function Catering({ images = [] }) {
  return (
    <article className={styles.panel}>
      <h2>Catering events in Nelson &amp; Top of the South Island</h2>

      <div className="rte">
        <p>
          <strong>Under the Hood BBQ</strong> brings the irresistible allure of authentic, slow-cooked barbecue
          to events across Nelson and the top of the South Island. Our passionate team specialises in creating
          mouthwatering feasts that are sure to be a talking point long after the event is over.
        </p>
        <p>
          Liberally seasoned barbecue meat is subtly smoked over charcoal and New Zealand wood for
          <strong> 8–14 hours</strong> resulting in tender, flavour-packed dishes.
        </p>
        <p>
          We can cook at our registered BBQ kitchen in Stoke and deliver hot and fresh to your location. Alternatively,
          if you want the aromatic excitement of on-site cooking, talk to us about the option of us bringing in our
          <em> Smokedogg Smoker Trailer</em>.
        </p>
        <p>
          Catering for intimate gatherings of <strong>20</strong> to larger celebrations of up to
          <strong> 500</strong> guests, our buffet-style service ensures everyone leaves feeling satisfied. With all
          serving essentials provided, our friendly team offer a fuss-free catering solution that lets you focus on
          celebrating your special day.
        </p>
      </div>

      {/* Optional images */}
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

      <section>
        <h3>Great for</h3>
        <ul className={styles.list}>
          <li>Work functions</li>
          <li>Private parties</li>
          <li>Birthdays</li>
          <li>Weddings</li>
          <li>Anniversaries</li>
          <li>Just because you want a great feed!</li>
        </ul>
      </section>

      <section>
        <h3>
          Low n Slow Barbecue Meat <span>(choose two or three) — all gluten &amp; dairy free</span>
        </h3>
        <ul className={styles.list}>
          <li>
            <strong>Pulled Pork</strong> — we use the Boston Butt and smoke low n slow for 11–12 hours using a hint of apple wood and charcoal.
            Rested then pulled and sauced with our Original Under the Hood Barbecue Sauce.
          </li>
          <li>
            <strong>Beef Cheeks</strong> — one of our most popular low and slow cuts! Low in fat and full of collagen, beef cheeks are packed with flavour.
            After 8 hours in the smoker they simply melt in your mouth!
          </li>
          <li>
            <strong>Lamb Shoulder</strong> — low and slow smoked on a bed of garlic and rosemary. Available either pulled or sliced, a kiwi classic
            that will have you back for seconds!
          </li>
          <li>
            <strong>Chicken Wings</strong> — seasoned liberally with our Tips Up Chicken rub and cooked hot and fast over charcoal and pōhutukawa wood —
            always a crowd pleaser.
          </li>
          <li>
            <strong>Smoked &amp; Glazed Ham on the Bone</strong> — scored and smoked and lovingly glazed hourly until it hits perfection.
            Carved hot and straight to your plate.
          </li>
          <li>
            <strong>Gourmet Sausages</strong> — locally made by our butcher, choose from pork, beef, lamb, chicken or venison.
          </li>
          <li>
            <strong>Pulled Jackfruit</strong> — vegan friendly with a BBQ taste kick everyone will enjoy. If you just have a few guests with this
            requirement we can do individual portions.
          </li>
          <li><em>Almost any other specialty meat available upon request.</em></li>
        </ul>
      </section>

      <section>
        <h3>Sides</h3>
        <ul className={styles.list}>
          <li>
            <strong>Gourmet Baby Potatoes</strong> — seasoned &amp; slathered in butter and fresh herbs.
            Can also be served DF/GF/V as well. Served as an alternative to Mac n Cheese.
          </li>
          <li>
            <strong>Mac n Cheese</strong> — full gluten &amp; dairy overload! The classic gooey BBQ side with a crunchy crumb topping.
            Full allergen alert but it is vegetarian.
          </li>
          <li>
            <strong>Under The Hood Slaw</strong> — house made, crispy, fresh and delicious with apple cider vinegar dressing to help cut through
            all the juiciness of the meat extravaganza.
          </li>
          <li>
            <strong>Leafy Green Salad</strong> — fresh and light with seasonal salad ingredients, no dressing added.
          </li>
          <li><strong>Gherkins</strong> — baby cornichons for a sweet, crunchy hit (GF/DF/V).</li>
          <li><strong>Jalapeños</strong> — tri-colour slices for those that like to add the heat.</li>
          <li><strong>Bread buns</strong> — freshly baked with butter on the side (DF/V).</li>
          <li>
            <strong>Sauces</strong> — Under The Hood Original BBQ sauce (smooth &amp; tangy house recipe),
            plant-based aioli &amp; mayo, plus a range of HOT sauces for the most daring palates! (GF/DF/V)
          </li>
        </ul>
      </section>

      <section>
        <p>
          Our BBQ events are served <strong>buffet style</strong> with a menu that will leave you feeling full to the brim,
          and happy you came.
        </p>
        <p>
          All meals include <strong>cardboard boats, cutlery and napkins</strong> to make for an easy clean-up process.
        </p>
      </section>

      <div className={styles.ctaRow}>
        <a href="/contact" className={styles.button}>Enquire about catering</a>
      </div>
    </article>
  );
}

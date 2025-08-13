'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import styles from './ShopPage.module.css';

function pickMetaColors(colour) {
  const fallback = '#181617';
  let bg = typeof colour === 'string' && colour.trim() ? colour.trim() : fallback;

  try {
    if (typeof CSS !== 'undefined' && !CSS.supports('color', bg)) bg = fallback;
  } catch {
    bg = fallback;
  }

  let fg = '#fff';
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(bg);
  if (m) {
    let hex = m[1];
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    fg = yiq >= 150 ? '#111' : '#fff';
  }

  return { bg, fg };
}

export default function ShopPageClient({ products = [] }) {
  const [index, setIndex] = useState(0);
  const [slide, setSlide] = useState(0); // 0=Desc, 1=Ingredients, 2=Nutrition

  const current = useMemo(() => products[index] || null, [products, index]);

  const { bg: metaBg, fg: metaFg } = useMemo(
    () => pickMetaColors(current?.colour),
    [current?.colour]
  );

  // reset carousel to first slide when switching products
  useEffect(() => { setSlide(0); }, [index]);

  const handlePrev = useCallback(() => setSlide(s => (s + 3 - 1) % 3), []);
  const handleNext = useCallback(() => setSlide(s => (s + 1) % 3), []);
  const onKey = useCallback((e) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  }, [handlePrev, handleNext]);

  const handleAddToCart = useCallback(() => {
    if (!current) return;
    console.log('Add to cart:', {
      id: current.id,
      title: current.title,
      price: current.price,
      slug: current.slug,
    });
  }, [current]);

  // decide if we should tilt the product image
  const tiltClass = useMemo(() => {
    const cat = (current?.category || '').toLowerCase();
    if (cat.includes('rub')) return styles.imageTiltLeft;
    if (cat.includes('sauce')) return styles.imageTiltRight;
    return '';
  }, [current?.category]);

  function Row({ label, value, unit }) {
    if (value == null || value === '') return null;
    return (
      <tr>
        <th className={styles.nLabel}>{label}</th>
        <td className={styles.nValue}>
          {value}{unit ? ` ${unit}` : ''}
        </td>
      </tr>
    );
  }

  return (
    <div className={styles.pageRoot}>
      <div className={styles.page}>
        <div className={styles.grid}>
          {/* LEFT: Image */}
          <div className={styles.colImage}>
            {current?.image ? (
              <Image
                src={current.image}
                alt={current.title || 'Product image'}
                width={800}
                height={800}
                className={`${styles.image} ${tiltClass}`}
                priority
              />
            ) : (
              <div className={styles.imageFallback}>No image</div>
            )}
          </div>

          {/* MIDDLE: Details */}
          <div className={styles.colDetails}>
            <div className={styles.detailsMain} onKeyDown={onKey}>
              {/* Carousel */}
              <div className={styles.carousel} role="region" aria-label="Product information">
                <div
                  className={styles.track}
                  style={{ transform: `translateX(-${slide * 100}%)` }}
                >
                  {/* Slide 1: Description */}
                  <section className={styles.slide} aria-label="Description" tabIndex={-1}>
                    {current?.description
                      ? <p className={styles.description}>{current.description}</p>
                      : <p className={styles.muted}>No description yet.</p>}
                  </section>

                  {/* Slide 2: Ingredients */}
                  <section className={styles.slide} aria-label="Ingredients" tabIndex={-1}>
                    {current?.ingredients
                      ? <p className={styles.ingredients}><strong>Ingredients:</strong> {current.ingredients}</p>
                      : <p className={styles.muted}>No ingredients listed.</p>}
                  </section>

                  {/* Slide 3: Nutrition */}
                  <section className={styles.slide} aria-label="Nutrition information" tabIndex={-1}>
                    {Array.isArray(current?.nutrition) && current.nutrition.length > 0 ? (
                      <div className={styles.nutrition}>
                        {current.nutrition.map((n, i) => (
                          <table key={i} className={styles.nutritionTable}>
                            {(n.servingPerPacket || n.servingSize) ? (
                              <caption className={styles.nutritionCaption}>
                                {n.servingPerPacket ? `${n.servingPerPacket} servings per packet` : ''}
                                {n.servingPerPacket && n.servingSize ? ' · ' : ''}
                                {n.servingSize ? `Serving size: ${n.servingSize}` : ''}
                              </caption>
                            ) : null}
                            <tbody>
                              <Row label="Energy"    value={n.energy}    unit="kJ" />
                              <Row label="Protein"   value={n.protein}   unit="g" />
                              <Row label="Fat"       value={n.fat}       unit="g" />
                              <Row label="Saturated" value={n.saturated} unit="g" />
                              <Row label="Carbs"     value={n.carbs}     unit="g" />
                              <Row label="Sugars"    value={n.sugars}    unit="g" />
                              <Row label="Sodium"    value={n.sodiums}   unit="mg" />
                              {n.notes ? (
                                <tr>
                                  <td colSpan={2} className={styles.nNotes}>{n.notes}</td>
                                </tr>
                              ) : null}
                            </tbody>
                          </table>
                        ))}
                      </div>
                    ) : (
                      <p className={styles.muted}>No nutrition info available.</p>
                    )}
                  </section>
                </div>

                {/* Dots only (arrows removed) */}
                <div className={styles.carouselControls}>
                  <div className={styles.dots} role="tablist" aria-label="Slides">
                    {['Description', 'Ingredients', 'Nutrition'].map((label, i) => (
                      <button
                        key={label}
                        type="button"
                        role="tab"
                        aria-selected={slide === i}
                        aria-label={label}
                        className={slide === i ? styles.dotActive : styles.dot}
                        onClick={() => setSlide(i)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Price + Add to Cart (below carousel) */}
              {current?.price != null ? <p className={styles.price}>${current.price}</p> : null}
              <button
                className={styles.addToCart}
                type="button"
                onClick={handleAddToCart}
                disabled={!current}
                aria-label={current ? `Add ${current.title} to cart` : 'Add to cart'}
              >
                Add to cart
              </button>
            </div>

            {/* Bottom meta with dynamic colours */}
            <div
              className={styles.detailsMeta}
              style={{ '--meta-bg': metaBg, '--meta-fg': metaFg }}
            >
              <h1 className={styles.title}>{current?.title || 'Select a product'}</h1>
              {current?.subTitle ? <p className={styles.subTitle}>{current.subTitle}</p> : null}
              {current?.category ? (
                <p className={styles.category}>{current.category}</p>
              ) : null}
            </div>
          </div>

          {/* RIGHT: Picker */}
          <div className={styles.colPicker}>
            <ul className={styles.list}>
              {products.map((p, i) => (
                <li key={p.id}>
                  <button
                    className={i === index ? styles.itemActive : styles.item}
                    onClick={() => setIndex(i)}
                    type="button"
                  >
                    {p.title || `Product ${i + 1}`}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

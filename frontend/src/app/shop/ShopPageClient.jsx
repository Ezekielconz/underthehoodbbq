'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './ShopPage.module.css';

const LS_KEY = 'uth_cart_v1';

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

function addItemToLocalStorage(item) {
  try {
    const list = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    const idx = list.findIndex((x) => x.id === item.id);
    if (idx >= 0) list[idx] = { ...list[idx], qty: (list[idx].qty || 1) + (item.qty || 1) };
    else list.push({ ...item, qty: item.qty || 1 });
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {}
}

export default function ShopPageClient({ products = [] }) {
  const [index, setIndex] = useState(0);
  const [slide, setSlide] = useState(0); // 0=Desc, 1=Ingredients, 2=Nutrition
  const [added, setAdded] = useState(false);

  const current = useMemo(() => products[index] || null, [products, index]);

  const { bg: metaBg, fg: metaFg } = useMemo(
    () => pickMetaColors(current?.colour),
    [current?.colour]
  );

  useEffect(() => { setSlide(0); setAdded(false); }, [index]);

  const handlePrev = useCallback(() => setSlide(s => (s + 3 - 1) % 3), []);
  const handleNext = useCallback(() => setSlide(s => (s + 1) % 3), []);
  const onKey = useCallback((e) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  }, [handlePrev, handleNext]);

  const handleAddToCart = useCallback(() => {
    if (!current) return;
    const detail = {
      id: current.id,
      title: current.title,
      price: current.price,
      slug: current.slug,
      image: current.image,
      colour: current.colour,
      category: current.category,
      qty: 1
    };

    addItemToLocalStorage(detail);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart:add', { detail }));
    }

    setAdded(true);
    const t = setTimeout(() => setAdded(false), 1200);
    return () => clearTimeout(t);
  }, [current]);

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

  /* ---------------- Swipe / drag for carousel ---------------- */
  const carouselRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0); // px
  const drag = useRef({ startX: 0, startY: 0, dx: 0, lock: null, width: 1, capturing: false });

  const isFromControls = (target) => {
    const el = target;
    return !!el?.closest?.(`.${styles.carouselControls}, .${styles.dots}, button`);
  };

  const onPointerDown = useCallback((e) => {
    if (isFromControls(e.target)) return;
    drag.current.width = (carouselRef.current?.offsetWidth || 1);
    drag.current.startX = e.clientX;
    drag.current.startY = e.clientY;
    drag.current.dx = 0;
    drag.current.lock = null;
    drag.current.capturing = false;
    setDragX(0);
    setDragging(true);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!dragging) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;

    if (!drag.current.lock) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        drag.current.lock = 'x';
        e.currentTarget.setPointerCapture?.(e.pointerId);
        drag.current.capturing = true;
      } else if (Math.abs(dy) > 8) {
        drag.current.lock = 'y';
      }
    }

    if (drag.current.lock === 'x') {
      e.preventDefault();
      const cap = drag.current.width * 0.35;
      const clamped = Math.max(-cap, Math.min(cap, dx));
      drag.current.dx = clamped;
      setDragX(clamped);
    }
  }, [dragging]);

  const endDrag = useCallback((e) => {
    if (!dragging) return;
    const dx = drag.current.dx;
    const threshold = Math.min(80, drag.current.width * 0.15); // px

    setDragging(false);
    setDragX(0);

    if (Math.abs(dx) > threshold) {
      if (dx > 0) handlePrev();
      else handleNext();
    }

    if (drag.current.capturing) {
      try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch {}
    }
    drag.current.dx = 0;
    drag.current.lock = null;
    drag.current.capturing = false;
  }, [dragging, handlePrev, handleNext]);

  const dragOffsetPct = useMemo(() => {
    const w = drag.current.width || 1;
    return dragging ? (dragX / w) * 100 : 0;
  }, [dragX, dragging]);

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
            <div
              className={styles.detailsMain}
              onKeyDown={onKey}
              style={{ '--pill-bg': metaBg, '--pill-fg': metaFg }}
            >
              {/* Carousel */}
              <div
                className={styles.carousel}
                role="region"
                aria-label="Product information"
                ref={carouselRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onPointerLeave={endDrag}
              >
                <div
                  className={`${styles.track} ${dragging ? styles.dragging : ''}`}
                  style={{ transform: `translateX(calc(-${slide * 100}% + ${dragOffsetPct}%))` }}
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

                {/* Dots (clickable on desktop, tap on mobile) */}
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

              {/* Price + Add to Cart (pill) */}
              {current?.price != null ? <p className={styles.price}>${current.price}</p> : null}
              <button
                className={styles.addToCart}
                type="button"
                onClick={handleAddToCart}
                disabled={!current}
                aria-label={current ? `Add ${current.title} to cart` : 'Add to cart'}
              >
                {added ? 'Added!' : 'Add to cart'}
              </button>
              <span aria-live="polite" className="sr-only">
                {added ? `${current?.title || 'Item'} added to cart.` : ''}
              </span>
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
                <li key={p.id} className={styles.listItem}>
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

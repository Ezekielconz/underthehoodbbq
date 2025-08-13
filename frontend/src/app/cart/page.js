'use client';

import { useEffect, useMemo, useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Cart.module.css';

const LS_KEY = 'uth_cart_v1';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
  catch { return []; }
}
function saveCart(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export default function CartPage() {
  const [items, setItems] = useState([]);

  // hydrate from localStorage
  useEffect(() => { setItems(loadCart()); }, []);

  // allow other pages to add items by dispatching a "cart:add" event
  useEffect(() => {
    const onAdd = (e) => {
      const incoming = e.detail || {};
      if (!incoming?.id) return;
      setItems((prev) => {
        const next = [...prev];
        const idx = next.findIndex((it) => it.id === incoming.id);
        if (idx >= 0) next[idx] = { ...next[idx], qty: (next[idx].qty || 1) + (incoming.qty || 1) };
        else next.push({ ...incoming, qty: incoming.qty || 1 });
        saveCart(next);
        return next;
      });
    };
    window.addEventListener('cart:add', onAdd);
    return () => window.removeEventListener('cart:add', onAdd);
  }, []);

  // helpers
  const updateQty = useCallback((id, delta) => {
    setItems((prev) => {
      const next = prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, (it.qty || 1) + delta) } : it
      );
      saveCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
    setItems([]);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.price) || 0) * (it.qty || 1), 0),
    [items]
  );

  const fmt = useMemo(
    () => new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }),
    []
  );

  const isEmpty = items.length === 0;

  return (
    <div className={styles.pageRoot}>
      <main className={styles.page}>
        <header className={styles.head}>
          <h1 className={styles.title}>Your Cart</h1>
          <p className={styles.kicker}>Low &amp; slow on checkout—nearly there.</p>
        </header>

        {isEmpty ? (
          <section className={styles.empty}>
            <p className={styles.emptyBig}>Your cart is empty.</p>
            <Link href="/shop" className={styles.ctaPrimary}>Back to shop</Link>
          </section>
        ) : (
          <section className={styles.layout}>
            {/* LEFT: line items */}
            <div className={styles.itemsCard}>
              <ul className={styles.items}>
                {items.map((it) => (
                  <li key={it.id} className={styles.item}>
                    <div className={styles.thumbWrap}>
                      {it.image ? (
                        <Image
                          src={it.image}
                          alt={it.title || 'Item'}
                          width={96}
                          height={96}
                          className={styles.thumb}
                        />
                      ) : (
                        <div className={styles.thumbFallback}>BBQ</div>
                      )}
                    </div>

                    <div className={styles.itemInfo}>
                      <div className={styles.itemTop}>
                        <div className={styles.itemTitleRow}>
                          <h3 className={styles.itemTitle}>
                            {it.title || 'Product'}
                          </h3>
                          {it.colour ? (
                            <span
                              className={styles.swatch}
                              title={it.colour}
                              style={{ backgroundColor: it.colour }}
                            />
                          ) : null}
                        </div>
                        <div className={styles.itemMeta}>
                          {it.category ? <span>{it.category}</span> : null}
                          {it.slug ? <span className={styles.midDot}>·</span> : null}
                          {it.slug ? <Link href={`/shop/${it.slug}`} className={styles.itemLink}>View</Link> : null}
                        </div>
                      </div>

                      <div className={styles.itemBottom}>
                        <div className={styles.qtyControls} aria-label="Quantity controls">
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => updateQty(it.id, -1)}
                          >−</button>
                          <span className={styles.qty}>{it.qty || 1}</span>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => updateQty(it.id, +1)}
                          >+</button>
                        </div>

                        <div className={styles.priceCol}>
                          <div className={styles.unitPrice}>{fmt.format(Number(it.price) || 0)}</div>
                          <div className={styles.lineTotal}>
                            {fmt.format((Number(it.price) || 0) * (it.qty || 1))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => removeItem(it.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles.itemsFooter}>
                <button type="button" className={styles.clearBtn} onClick={clearCart}>
                  Clear cart
                </button>
                <Link href="/shop" className={styles.linkBack}>Continue shopping</Link>
              </div>
            </div>

            {/* RIGHT: summary */}
            <aside className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              <div className={styles.row}>
                <span>Subtotal</span>
                <span className={styles.value}>{fmt.format(subtotal)}</span>
              </div>

              <div className={styles.rowMuted}>
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className={styles.coupon}>
                <input
                  className={styles.couponInput}
                  placeholder="Discount code"
                  aria-label="Discount code"
                />
                <button className={styles.couponBtn} type="button">Apply</button>
              </div>

              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalVal}>{fmt.format(subtotal)}</span>
              </div>

              <button
                className={styles.checkout}
                type="button"
                onClick={() => alert('Proceed to checkout flow')}
              >
                Checkout
              </button>

              <p className={styles.smallNote}>
                GST included where applicable. You’ll choose shipping at the next step.
              </p>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}

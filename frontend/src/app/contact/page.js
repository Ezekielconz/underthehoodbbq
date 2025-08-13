'use client';

import { useState } from 'react';
import styles from './Contact.module.css';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  function validate() {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email.';
    if (!form.message.trim()) return 'Please enter a message.';
    return '';
  }

  // swap this for your real API (e.g. /api/contact)
  const fakeSend = () => new Promise((r) => setTimeout(r, 700));

  const onSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) { setError(msg); return; }
    setError('');
    setStatus('sending');
    try {
      await fakeSend();
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={styles.pageRoot}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Contact</h1>
          <p className={styles.subtitle}>Got a question? Say hello.</p>
        </header>

        <div className={styles.grid}>
          {/* Left: form card */}
          <section className={styles.card} aria-labelledby="contact-heading">
            <h2 id="contact-heading" className={styles.cardTitle}>Send us a message</h2>
            <form className={styles.form} onSubmit={onSubmit} noValidate>
              <div className={styles.row}>
                <label className={styles.label} htmlFor="name">Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={styles.input}
                  value={form.name}
                  onChange={onChange}
                  autoComplete="name"
                  required
                />
              </div>

              <div className={styles.row}>
                <label className={styles.label} htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  value={form.email}
                  onChange={onChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className={styles.row}>
                <label className={styles.label} htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={styles.input}
                  value={form.phone}
                  onChange={onChange}
                  autoComplete="tel"
                />
              </div>

              <div className={styles.row}>
                <label className={styles.label} htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className={styles.textarea}
                  value={form.message}
                  onChange={onChange}
                  required
                />
              </div>

              {error ? <p className={styles.error} role="alert">{error}</p> : null}

              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.button}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
                <span className={styles.status} aria-live="polite">
                  {status === 'success' && 'Thanks! We’ll get back to you soon.'}
                  {status === 'error' && 'Oops, something went wrong. Please try again.'}
                </span>
              </div>
            </form>
          </section>

          {/* Right: details block (matches footer styling) */}
          <aside className={styles.side}>
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Email</h3>
              <a href="mailto:underthehoodnz@gmail.com" className={styles.link}>underthehoodnz@gmail.com</a>
            </div>
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Phone</h3>
              <a href="tel:+64212420799" className={styles.link}>+64 21 242 0799</a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

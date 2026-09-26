"use client";

import { useState } from "react";
import { QuoteIcon } from "./icons/Icons";
import styles from "./Testimonials.module.css";
import Reveal from "./Reveal";

export default function Testimonials({ testimonials = [] }) {
  const [active, setActive] = useState(0);
  if (testimonials.length === 0) return null;

  const current = testimonials[Math.min(active, testimonials.length - 1)];

  return (
    <Reveal as="section" className={styles.section}>
      <p className={styles.eyebrow}>Client Stories</p>
      <QuoteIcon size={28} className={styles.quoteIcon} />
      <p className={styles.quote} key={current._id}>
        {current.quote}
      </p>

      <div className={styles.tabs}>
        {testimonials.map((t, i) => (
          <button
            key={t._id}
            type="button"
            className={`${styles.tab} ${t._id === current._id ? styles.tabActive : ""}`}
            onClick={() => setActive(i)}
          >
            <span className={styles.name}>{t.name}</span>
            <span className={styles.place}>{t.location}</span>
          </button>
        ))}
      </div>
    </Reveal>
  );
}

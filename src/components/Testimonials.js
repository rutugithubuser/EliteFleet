"use client";

import { useState } from "react";
import { QuoteIcon } from "./icons/Icons";
import styles from "./Testimonials.module.css";

const TESTIMONIALS = [
  {
    name: "Helen Jordan",
    place: "Chicago",
    quote:
      "I rented a car from Elite Fleet for a weekend, and I couldn't be happier. The booking process was super easy and the car was spotless and in perfect condition. Strongly recommended!",
  },
  {
    name: "Emily Chen",
    place: "Australia",
    quote:
      "Our family trip in Dubai was made so much easier thanks to Elite Fleet's excellent pricing & service. The car was spotless, comfortable, and ready on time. Highly recommended for anyone visiting Dubai!",
  },
  {
    name: "Lucas Martins",
    place: "South Africa",
    // Placeholder copy — swap for the real quote when you have it.
    quote:
      "Booking a Rolls-Royce for our anniversary felt effortless. Elite Fleet kept us updated at every step and the car was delivered right on time. We'll be back on our next trip to Dubai.",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const current = TESTIMONIALS[active];

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>Client Stories</p>
      <QuoteIcon size={28} className={styles.quoteIcon} />
      <p className={styles.quote}>{current.quote}</p>

      <div className={styles.tabs}>
        {TESTIMONIALS.map((t, i) => (
          <button
            key={t.name}
            type="button"
            className={`${styles.tab} ${i === active ? styles.tabActive : ""}`}
            onClick={() => setActive(i)}
          >
            <span className={styles.name}>{t.name}</span>
            <span className={styles.place}>{t.place}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

"use client";

import { formatAed } from "@/lib/format";
import styles from "./PriceRange.module.css";

/**
 * Dual-thumb "price per day" range slider (min / max on one track).
 * Used by the fleet toolbar's Price popover and the Filters drawer.
 *
 * The two native range inputs are stacked on top of each other and only
 * their thumbs accept pointer events, so either thumb can be dragged.
 */
export default function PriceRange({ min, max, value, onChange }) {
  const [low, high] = value;
  const span = max - min;
  const disabled = span <= 0;
  // Enough steps for a smooth drag without endless pixel-hunting
  const step = Math.max(1, Math.round(span / 200));
  const pct = (v) => (disabled ? 0 : ((v - min) / span) * 100);

  const setLow = (v) => onChange([Math.min(Number(v), high), high]);
  const setHigh = (v) => onChange([low, Math.max(Number(v), low)]);

  return (
    <div className={styles.range}>
      <div className={styles.track}>
        <span className={styles.rail} />
        <span
          className={styles.fill}
          style={{ left: `${pct(low)}%`, right: `${100 - pct(high)}%` }}
        />
        <input
          type="range"
          className={styles.input}
          aria-label="Minimum price per day"
          min={min}
          max={max}
          step={step}
          value={low}
          disabled={disabled}
          onChange={(e) => setLow(e.target.value)}
        />
        <input
          type="range"
          className={styles.input}
          aria-label="Maximum price per day"
          min={min}
          max={max}
          step={step}
          value={high}
          disabled={disabled}
          onChange={(e) => setHigh(e.target.value)}
        />
      </div>
      <div className={styles.labels}>
        <span>{formatAed(low)}</span>
        <span>{formatAed(high)}</span>
      </div>
    </div>
  );
}

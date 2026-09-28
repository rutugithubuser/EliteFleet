"use client";

import { useEffect } from "react";
import { CheckIcon, CloseIcon } from "./icons/Icons";
import PriceRange from "./PriceRange";
import styles from "./FiltersDrawer.module.css";

/**
 * Slide-over "Filters" panel:
 * right-hand side panel on desktop, bottom sheet on mobile.
 *
 * The caller owns the filter state — this component only toggles values,
 * so the toolbar popovers, category bar and drawer always agree.
 * Filters apply live; "Show results" just closes the panel.
 */
export default function FiltersDrawer({
  open,
  onClose,
  categories = [],
  brands = [],
  seats = [],
  transmissions = [],
  bounds = [0, 1],
  selectedCategories = [],
  selectedBrands = [],
  selectedSeats = [],
  selectedTransmission = [],
  price,
  onToggleCategory,
  onToggleBrand,
  onToggleSeat,
  onToggleTransmission,
  onPrice,
  onClear,
  resultCount = 0,
}) {
  // Lock the page behind the panel and close on Escape while it's open
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Small render helpers (called, not used as JSX components, so the pills
  // don't remount — and lose keyboard focus — on every state change)
  const section = (label, children) => (
    <section className={styles.section} key={label}>
      <p className={styles.label}>{label}</p>
      {children}
    </section>
  );

  const pill = (key, on, onClick, children) => (
    <button
      key={key}
      type="button"
      className={`${styles.pill} ${on ? styles.pillOn : ""}`}
      onClick={onClick}
      aria-pressed={on}
    >
      {on && <CheckIcon size={13} />}
      {children}
    </button>
  );

  return (
    <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`} aria-hidden={!open}>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        inert={!open}
      >
        <div className={styles.handle} aria-hidden="true" />
        <header className={styles.header}>
          <h2 className={styles.title}>Filters</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close filters">
            <CloseIcon size={20} />
          </button>
        </header>

        <div className={styles.body}>
          {section(
            "Category",
            <div className={styles.pillGrid}>
              {categories.map((cat) =>
                pill(cat, selectedCategories.includes(cat), () => onToggleCategory(cat), cat)
              )}
            </div>
          )}

          {section(
            "Brand",
            <div className={styles.pillGrid}>
              {brands.map((brand) =>
                pill(brand, selectedBrands.includes(brand), () => onToggleBrand(brand), brand)
              )}
            </div>
          )}

          {section(
            "Seats",
            <div className={styles.pillGrid}>
              {seats.map((n) =>
                pill(String(n), selectedSeats.includes(n), () => onToggleSeat(n), n)
              )}
            </div>
          )}

          {section(
            "Transmission",
            <div className={styles.pillGrid}>
              {transmissions.map((t) =>
                pill(t, selectedTransmission.includes(t), () => onToggleTransmission(t), t)
              )}
            </div>
          )}

          {section(
            "Price per day",
            <PriceRange min={bounds[0]} max={bounds[1]} value={price} onChange={onPrice} />
          )}
        </div>

        <footer className={styles.footer}>
          <button type="button" className={styles.clear} onClick={onClear}>
            Clear
          </button>
          <button type="button" className={styles.show} onClick={onClose}>
            Show results ({resultCount})
          </button>
        </footer>
      </div>
    </div>
  );
}

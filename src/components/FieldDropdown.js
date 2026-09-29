"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon } from "./icons/Icons";
import styles from "./FieldDropdown.module.css";

// `labelOutside` renders the label above the field box instead of inside it,
// which is how the vehicle detail booking panel draws it (Figma 27:78).
// The default keeps the label inside the box for the hero search bar.
export default function FieldDropdown({
  icon,
  label,
  value,
  options,
  onSelect,
  date,
  min,
  className,
  labelOutside = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inputId = useId();
  const root = className ? `${styles.field} ${className}` : styles.field;

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // A date field is a real <input type="date">, not a dropdown.
  if (date) {
    if (labelOutside) {
      return (
        <div className={root} ref={ref}>
          <label className={styles.outerLabel} htmlFor={inputId}>
            {label}
          </label>
          <div className={styles.fieldButton}>
            {icon}
            <span className={styles.dateWrap}>
              <input
                id={inputId}
                type="date"
                className={styles.dateInput}
                data-filled={value ? "true" : "false"}
                value={value}
                min={min}
                onChange={(e) => onSelect(e.target.value)}
              />
              {!value && (
                <span className={styles.datePlaceholder} aria-hidden="true">
                  Select date
                </span>
              )}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className={root} ref={ref}>
        <label className={styles.fieldButton} htmlFor={inputId}>
          {icon}
          <span className={styles.fieldText}>
            <span className={styles.fieldLabel}>{label}</span>
            <span className={styles.dateWrap}>
              <input
                id={inputId}
                type="date"
                className={styles.dateInput}
                data-filled={value ? "true" : "false"}
                value={value}
                min={min}
                onChange={(e) => onSelect(e.target.value)}
              />
              {!value && (
                <span className={styles.datePlaceholder} aria-hidden="true">
                  Select date
                </span>
              )}
            </span>
          </span>
        </label>
      </div>
    );
  }

  if (labelOutside) {
    return (
      <div className={root} ref={ref}>
        <span className={styles.outerLabel}>{label}</span>
        <button
          type="button"
          className={styles.fieldButton}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {icon}
          <span className={styles.fieldValue}>{value}</span>
          <ChevronDownIcon className={`${styles.fieldChevron} ${open ? styles.fieldChevronOpen : ""}`} size={18} />
        </button>

        {open && (
          <ul className={styles.dropdownPanel} role="listbox">
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt === value}
                  className={`${styles.dropdownOption} ${opt === value ? styles.dropdownOptionActive : ""}`}
                  onClick={() => {
                    onSelect(opt);
                    setOpen(false);
                  }}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className={root} ref={ref}>
      <button
        type="button"
        className={styles.fieldButton}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {icon}
        <span className={styles.fieldText}>
          <span className={styles.fieldLabel}>{label}</span>
          <span className={styles.fieldValue}>{value}</span>
        </span>
        <ChevronDownIcon className={`${styles.fieldChevron} ${open ? styles.fieldChevronOpen : ""}`} size={18} />
      </button>

      {open && (
        <ul className={styles.dropdownPanel} role="listbox">
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                role="option"
                aria-selected={opt === value}
                className={`${styles.dropdownOption} ${opt === value ? styles.dropdownOptionActive : ""}`}
                onClick={() => {
                  onSelect(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

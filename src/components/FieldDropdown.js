"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "./icons/Icons";
import styles from "./Hero.module.css";

export default function FieldDropdown({ icon, label, value, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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

  return (
    <div className={styles.field} ref={ref}>
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

import { CheckIcon } from "./icons/Icons";
import styles from "./IncludesList.module.css";

// The defaults shown in the Figma design. A car can override them in Studio
// (or leave them empty to hide that row).
const DEFAULTS = [
  "Insurance & safety coverage",
  "Optional coverage upgrades",
  "Delivery across Dubai",
  "Airport pickups",
  "Daily, weekly & monthly rates",
  "Chauffeur on request",
];

// "Rental Includes" — a two-column check-list under the specification grid.
export default function IncludesList({ items }) {
  const list = items && items.length ? items : DEFAULTS;
  if (!list || list.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>Rental Includes</h2>
      <ul className={styles.list}>
        {list.map((text) => (
          <li key={text} className={styles.item}>
            <span className={styles.icon}>
              <CheckIcon size={18} />
            </span>
            <span className={styles.text}>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
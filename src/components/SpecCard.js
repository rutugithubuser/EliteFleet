import styles from "./SpecCard.module.css";

// One cell of the specification grid on the vehicle detail page.
//
// The Figma cell ("Spec Item", 12:277) is a 1px bordered box holding a 22px
// gold icon, a small muted label and a semibold value. The label sits above the
// value; `value` is optional so a missing spec still keeps the grid's shape.
export default function SpecCard({ icon: Icon, label, value }) {
  return (
    <div className={styles.cell} role="listitem">
      {Icon && (
        <span className={styles.icon} aria-hidden="true">
          <Icon size={22} />
        </span>
      )}
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value || "\u00a0"}</span>
      </span>
    </div>
  );
}

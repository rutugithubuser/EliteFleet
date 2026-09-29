import MaskText from "../MaskText";
import styles from "./SectionHeading.module.css";

// Gold rule + eyebrow, big title, optional subtitle (the Figma "Section Heading").
// dark: white text, for dark sections. hideExtrasOnMobile: phones show only the title.
export default function SectionHeading({ eyebrow, title, subtitle, dark = false, hideExtrasOnMobile = false, className = "" }) {
  return (
    <div
      className={`${styles.heading} ${dark ? styles.dark : ""} ${hideExtrasOnMobile ? styles.compactMobile : ""} ${className}`}
    >
      {eyebrow && (
        <p className={styles.eyebrow}>
          <span className={styles.rule} />
          {eyebrow}
        </p>
      )}
      <h2 className={styles.title}>
        <MaskText lines={title} />
      </h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}

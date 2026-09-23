import Image from "next/image";
import styles from "./FinalCta.module.css";

export default function FinalCta() {
  return (
    <section className={styles.section}>
      <Image
        src="/images/final-cta-bg.png"
        alt="Black GMC Yukon in a Dubai parking structure"
        fill
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.scrim} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Book Your Car</p>
        <h2 className={styles.heading}>Ready to Drive?</h2>
        <p className={styles.copy}>Choose your car and start your Dubai journey.</p>

        <div className={styles.ctas}>
          <a href="#fleet" className={styles.bookBtn}>
            Book Now
          </a>
          <a href="#fleet" className={styles.exploreBtn}>
            Explore Fleet
          </a>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Image src="/icons/phone.png" alt="" width={14} height={14} /> Call +971 58 521 0105
          </span>
          <span className={styles.metaItem}>
            <Image src="/icons/clock.png" alt="" width={14} height={14} /> Open 8:00 AM – 10:00 PM
          </span>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { phoneLink } from "@/lib/format";
import styles from "./FinalCta.module.css";
import Reveal from "./Reveal";

export default function FinalCta({ settings = {} }) {
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
      <Reveal stagger className={styles.content}>
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
          {settings.phone && (
            <a href={phoneLink(settings.phone)} className={styles.metaItem}>
              <Image src="/icons/phone.png" alt="" width={14} height={14} /> Call {settings.phone}
            </a>
          )}
          {settings.openingHours && (
            <span className={styles.metaItem}>
              <Image src="/icons/clock.png" alt="" width={14} height={14} /> Open {settings.openingHours}
            </span>
          )}
        </div>
      </Reveal>
    </section>
  );
}

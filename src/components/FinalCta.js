import Image from "next/image";
import { phoneLink } from "@/lib/format";
import styles from "./FinalCta.module.css";
import Reveal from "./Reveal";
import Link from "next/link";
import { LINKS } from "@/lib/links";
import MaskText from "./MaskText";
import Parallax from "./Parallax";

export default function FinalCta({ settings = {} }) {
  return (
    <section className={styles.section}>
      <Parallax strength={0.12}>
        <Image
          src="/images/final-cta-bg.png"
          alt="Black GMC Yukon in a Dubai parking structure"
          fill
          sizes="100vw"
          className={styles.image}
        />
      </Parallax>
      <div className={styles.scrim} />
      <Reveal stagger className={styles.content}>
        <p className={styles.eyebrow}>Book Your Car</p>
        <h2 className={styles.heading}>
          <MaskText lines="Ready to Drive?" />
        </h2>
        <p className={styles.copy}>Choose your car and start your Dubai journey.</p>

        <div className={styles.ctas}>
          <Link href={LINKS.booking} className={`${styles.bookBtn} shimmer`}>
            Book Now
          </Link>
          <Link href={LINKS.fleetSection} className={styles.exploreBtn}>
            Explore Fleet
          </Link>
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

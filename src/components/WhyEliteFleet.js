import Image from "next/image";
import { CarIcon, TagIcon } from "./icons/Icons";
import styles from "./WhyEliteFleet.module.css";
import Reveal from "./Reveal";

const FEATURES = [
  {
    Icon: CarIcon,
    title: "Wide Range of Cars",
    copy: "From economy to luxury — SUVs, sports cars and prestige sedans for every kind of trip.",
  },
  {
    Icon: TagIcon,
    title: "Affordable & Transparent Pricing",
    copy: "Clear daily rates with no hidden charges, so you know exactly what you pay.",
  },
  {
    iconSrc: "/icons/trust-shield.svg",
    title: "Insurance & Safety Coverage",
    copy: "Insurance and safety coverage included, with optional coverage upgrades available.",
  },
  {
    iconSrc: "/icons/trust-flexible.svg",
    title: "Flexible Rental Options",
    copy: "Daily, weekly and monthly rentals, plus airport pickups and chauffeur services.",
  },
];

export default function WhyEliteFleet() {
  return (
    <section className={styles.section}>
      <Reveal className={styles.intro}>
        <p className={styles.eyebrow}>Why Elite Fleet</p>
        <h2 className={styles.heading}>Built Around Your Journey.</h2>
        <p className={styles.copy}>
          Everything you need for a smooth rental in Dubai — without the fine print.
        </p>
        <a href="#about" className={styles.cta}>
          Read about us →
        </a>
      </Reveal>

      <Reveal stagger delay={0.1} className={styles.grid}>
        {FEATURES.map((f) => (
          <div className={styles.item} key={f.title}>
            {f.Icon ? (
              <f.Icon size={22} className={styles.icon} />
            ) : (
              <Image src={f.iconSrc} alt="" width={22} height={22} className={styles.icon} />
            )}
            <p className={styles.title}>{f.title}</p>
            <p className={styles.itemCopy}>{f.copy}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

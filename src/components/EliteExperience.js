import Image from "next/image";
import { ArrowRightIcon } from "./icons/Icons";
import styles from "./EliteExperience.module.css";
import Reveal from "./Reveal";
import Link from "next/link";
import { LINKS } from "@/lib/links";
import MaskText from "./MaskText";
import Parallax from "./Parallax";

const POINTS = [
  {
    num: "01",
    title: "Premium Vehicles",
    copy: "From everyday comfort to Rolls-Royce, Lamborghini and Range Rover.",
  },
  {
    num: "02",
    title: "Flexible Rental Options",
    copy: "Daily, weekly and monthly rentals — delivered to you or ready for self pickup.",
  },
  {
    num: "03",
    title: "Reliable Service",
    copy: "Clear rates with no hidden charges, and insurance coverage included.",
  },
];

export default function EliteExperience() {
  return (
    <section className={styles.section} id="about">
      <Reveal className={styles.imageWrap}>
        <Parallax>
          <Image
            src="/images/elite-experience-dawn.png"
            alt="White Rolls-Royce Dawn convertible parked beside green plants"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.image}
          />
        </Parallax>
        <p className={styles.caption}>
          <span className={styles.captionLabel}>In the Fleet</span>
          <span className={styles.captionName}>Rolls-Royce Dawn</span>
        </p>
      </Reveal>

      <Reveal stagger delay={0.15} className={styles.content}>
        <p className={styles.eyebrow}>The Elite Experience</p>
        <h2 className={styles.heading}>
          <MaskText lines={["More Than a", "Rental."]} />
        </h2>
        <p className={styles.copy}>
          Elite Fleet makes renting a car in Dubai simple, fast and reliable. Choose from a broad
          selection of well-maintained vehicles at competitive rates — for daily use, weekend
          trips, airport transfers or extended rentals — with transparent pricing and convenient
          delivery.
        </p>

        <ol className={styles.list}>
          {POINTS.map((point) => (
            <li className={styles.listItem} key={point.num}>
              <span className={styles.num}>{point.num}</span>
              <div>
                <p className={styles.pointTitle}>{point.title}</p>
                <p className={styles.pointCopy}>{point.copy}</p>
              </div>
            </li>
          ))}
        </ol>

        <Link href={LINKS.fleetSection} className={styles.cta}>
          Discover Elite Fleet <ArrowRightIcon size={16} />
        </Link>
      </Reveal>
    </section>
  );
}

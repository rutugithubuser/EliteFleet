"use client";

import { useRef, useState } from "react";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons/Icons";
import SanityImage from "./SanityImage";
import { carPriceLabel } from "@/lib/format";
import styles from "./FeaturedVehicles.module.css";
import Reveal from "./Reveal";
import Link from "next/link";
import { LINKS } from "@/lib/links";
import MaskText from "./MaskText";

export default function FeaturedVehicles({ cars = [] }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  if (cars.length === 0) return null;

  function go(dir) {
    const next = Math.min(Math.max(index + dir, 0), cars.length - 1);
    setIndex(next);
    const track = trackRef.current;
    if (track) {
      const card = track.children[next];
      if (card) card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }
  }

  return (
    <section className={styles.section}>
      <Reveal className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Featured Vehicles</p>
          <h2 className={styles.heading}>
            <MaskText lines="The Signature Collection" />
          </h2>
          <p className={styles.sub}>Hand-picked icons from the Elite Fleet garage.</p>
        </div>
        <div className={styles.controls}>
          <Link href={LINKS.fleet} className={styles.viewAll}>
            View All Fleet <ArrowRightIcon size={16} />
          </Link>
          <button type="button" className={styles.arrowBtn} onClick={() => go(-1)} aria-label="Previous">
            <ChevronLeftIcon size={18} />
          </button>
          <button type="button" className={styles.arrowBtn} onClick={() => go(1)} aria-label="Next">
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.track} ref={trackRef}>
          {cars.map((car) => (
            <div className={styles.card} key={car._id}>
              <SanityImage
                image={car.image}
                alt={car.image?.alt || car.name}
                sizes="(max-width: 600px) 80vw, 47vw"
                className={styles.image}
              />
              <div className={styles.cardOverlay}>
                <p className={styles.cardMake}>{car.brand}</p>
                <div className={styles.cardBottom}>
                  <div>
                    <p className={styles.cardModel}>{car.name}</p>
                    <p className={styles.cardPrice}>{carPriceLabel(car)}</p>
                  </div>
                  <Link href={LINKS.car(car.slug)} className={styles.cardArrow} aria-label={`View ${car.name}`}>
                    <ArrowRightIcon size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className={styles.progressWrap}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.progress}>
          <span
            className={styles.progressFill}
            style={{ width: `${((index + 1) / cars.length) * 100}%` }}
          />
        </span>
        <span>{String(cars.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}

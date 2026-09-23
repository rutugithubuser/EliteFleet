"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons/Icons";
import styles from "./FeaturedVehicles.module.css";

const CARS = [
  {
    make: "Rolls-Royce",
    model: "2025 Rolls-Royce Cullinan",
    price: "From AED 6,499 / day",
    image: "/images/fleet/rolls-royce-cullinan.png",
  },
  {
    make: "Lamborghini",
    model: "Lamborghini",
    price: "Rates on request",
    image: "/images/fleet/lamborghini.png",
  },
  {
    make: "Mercedes-Benz",
    model: "Mercedes GLC 200",
    price: "Contact for pricing",
    image: "/images/fleet/mercedes-glc200.jpg",
  },
];

export default function FeaturedVehicles() {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  function go(dir) {
    const next = Math.min(Math.max(index + dir, 0), CARS.length - 1);
    setIndex(next);
    const track = trackRef.current;
    if (track) {
      const card = track.children[next];
      if (card) card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Featured Vehicles</p>
          <h2 className={styles.heading}>The Signature Collection</h2>
          <p className={styles.sub}>Hand-picked icons from the Elite Fleet garage.</p>
        </div>
        <div className={styles.controls}>
          <a href="#fleet" className={styles.viewAll}>
            View All Fleet <ArrowRightIcon size={16} />
          </a>
          <button type="button" className={styles.arrowBtn} onClick={() => go(-1)} aria-label="Previous">
            <ChevronLeftIcon size={18} />
          </button>
          <button type="button" className={styles.arrowBtn} onClick={() => go(1)} aria-label="Next">
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef}>
        {CARS.map((car) => (
          <div className={styles.card} key={car.model}>
            {car.image ? (
              <Image
                src={car.image}
                alt={car.model}
                fill
                sizes="(max-width: 600px) 78vw, 45vw"
                className={styles.image}
              />
            ) : (
              <div className={styles.imagePlaceholder} aria-hidden="true" />
            )}
            <div className={styles.cardOverlay}>
              <p className={styles.cardMake}>{car.make}</p>
              <div className={styles.cardBottom}>
                <div>
                  <p className={styles.cardModel}>{car.model}</p>
                  <p className={styles.cardPrice}>{car.price}</p>
                </div>
                <a href="#fleet" className={styles.cardArrow} aria-label={`View ${car.model}`}>
                  <ArrowRightIcon size={16} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.progressWrap}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.progress}>
          <span
            className={styles.progressFill}
            style={{ width: `${((index + 1) / CARS.length) * 100}%` }}
          />
        </span>
        <span>{String(CARS.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}

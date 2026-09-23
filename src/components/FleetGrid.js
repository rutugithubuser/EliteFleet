"use client";

import Image from "next/image";
import { ArrowRightIcon } from "./icons/Icons";
import { useBooking } from "@/context/BookingContext";
import styles from "./FleetGrid.module.css";

const CATEGORIES = ["All", "Luxury", "Sports", "SUV", "Exotic", "Economy", "Convertible"];

const CARS = [
  {
    badge: "SUV",
    make: "Rolls-Royce",
    model: "Rolls-Royce Cullinan",
    seats: "5 Seats",
    trans: "Automatic",
    range: "350 km",
    price: "3,999",
    category: "SUV",
    image: "/images/fleet/rolls-royce-cullinan.png",
  },
  {
    badge: "LUXURY",
    make: "Rolls-Royce",
    model: "Rolls-Royce Spectre",
    seats: "4 Seats",
    trans: "Automatic",
    range: "320 km",
    price: "7,199",
    category: "Luxury",
    image: "/images/fleet/rolls-royce-spectre.png",
  },
  {
    badge: "SPORTS",
    make: "BMW",
    model: "BMW M4 Competition",
    seats: "4 Seats",
    trans: "Automatic",
    range: "200 km",
    price: "1,499",
    category: "Sports",
    image: "/images/fleet/bmw-m4.png",
  },
  {
    badge: "LUXURY",
    make: "Rolls-Royce",
    model: "Rolls-Royce Ghost Mansory",
    seats: "4 Seats",
    trans: "Automatic",
    range: "260 km",
    price: "3,499",
    category: "Luxury",
    image: "/images/fleet/ghost-mansory.png",
  },
  {
    badge: "SUV",
    make: "Cadillac",
    model: "2025 Cadillac Escalade",
    seats: "7 Seats",
    trans: "Automatic",
    range: "300 km",
    price: "1,299",
    category: "SUV",
    image: "/images/fleet/cadillac-escalade.png",
  },
  {
    badge: "SUV",
    make: "GMC",
    model: "GMC Yukon 2023",
    seats: "7 Seats",
    trans: "Automatic",
    range: "280 km",
    price: "749",
    category: "SUV",
    image: "/images/fleet/gmc-yukon.png",
  },
];

export default function FleetGrid() {
  const { category: active, setCategory: setActive } = useBooking();
  const cars = active === "All" ? CARS : CARS.filter((c) => c.category === active);

  return (
    <section className={styles.section} id="fleet">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Explore Our Fleet</p>
          <h2 className={styles.heading}>Find Your Perfect Drive</h2>
          <p className={styles.sub}>From everyday comfort to extraordinary performance.</p>
        </div>
        <a href="#fleet" className={styles.viewAll}>
          View All Fleet <ArrowRightIcon size={16} />
        </a>
      </div>

      <div className={styles.tabs}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles.tab} ${active === cat ? styles.tabActive : ""}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {cars.map((car) => (
          <article className={styles.card} key={car.model}>
            <div className={styles.imageWrap}>
              <span className={styles.badge}>{car.badge}</span>
              <Image
                src={car.image}
                alt={car.model}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 1180px) 50vw, 33vw"
                className={styles.image}
              />
            </div>
            <div className={styles.body}>
              <p className={styles.make}>{car.make}</p>
              <h3 className={styles.model}>{car.model}</h3>
              <div className={styles.specs}>
                <span>{car.seats}</span>
                <span>{car.trans}</span>
                <span>{car.range}</span>
              </div>
              <div className={styles.footer}>
                <p className={styles.price}>
                  AED {car.price} <span>/ day</span>
                </p>
                <div className={styles.actions}>
                  <a href="#" className={styles.detailsBtn}>
                    View Details
                  </a>
                  <a href="#" className={styles.bookBtn}>
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.moreWrap}>
        <a href="#fleet" className={`${styles.moreBtn} ${styles.moreBtnWide}`}>
          View All Fleet <ArrowRightIcon size={16} />
        </a>
        <a href="#fleet" className={`${styles.moreBtn} ${styles.moreBtnMobile}`}>
          View All 12 Cars <ArrowRightIcon size={16} />
        </a>
        <p className={styles.moreNote}>
          Showing {cars.length} of 12 vehicles. Prices per day as listed on elitefleet.ae.
        </p>
      </div>
    </section>
  );
}

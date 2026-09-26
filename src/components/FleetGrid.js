"use client";

import { ArrowRightIcon } from "./icons/Icons";
import SanityImage from "./SanityImage";
import Reveal from "./Reveal";
import { useBooking } from "@/context/BookingContext";
import { carPriceLabel, carSpecs, formatAed } from "@/lib/format";
import styles from "./FleetGrid.module.css";
import Link from "next/link";
import { LINKS } from "@/lib/links";
import MaskText from "./MaskText";

// How many cars the grid shows at once
const MAX_VISIBLE = 6;

export default function FleetGrid({ cars = [], categoryNames = [] }) {
  const { category: active, setCategory: setActive } = useBooking();
  const tabs = ["All", ...categoryNames];

  const matching = active === "All" ? cars : cars.filter((c) => c.category === active);
  const visible = matching.slice(0, MAX_VISIBLE);

  return (
    <section className={styles.section} id="fleet">
      <Reveal className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Explore Our Fleet</p>
          <h2 className={styles.heading}>
            <MaskText lines="Find Your Perfect Drive" />
          </h2>
          <p className={styles.sub}>From everyday comfort to extraordinary performance.</p>
        </div>
        <Link href={LINKS.fleet} className={styles.viewAll}>
          View All Fleet <ArrowRightIcon size={16} />
        </Link>
      </Reveal>

      <div className={styles.tabs}>
        {tabs.map((cat) => (
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

      {visible.length === 0 ? (
        <p className={styles.empty}>No cars in this category yet. Check back soon.</p>
      ) : (
        // key={active}: switching category rebuilds the grid, so the cards animate in again
        <Reveal stagger key={active} className={styles.grid}>
          {visible.map((car, i) => (
            <article className={styles.card} key={car._id}>
              <div className={styles.imageWrap}>
                {car.category && <span className={styles.badge}>{car.category.toUpperCase()}</span>}
                <SanityImage
                  image={car.image}
                  alt={car.image?.alt || car.name}
                  eager={i === 0}
                  sizes="(max-width: 600px) 100vw, (max-width: 1180px) 50vw, 33vw"
                  className={styles.image}
                />
              </div>
              <div className={styles.body}>
                <p className={styles.make}>{car.brand}</p>
                <h3 className={styles.model}>{car.name}</h3>
                <div className={styles.specs}>
                  {carSpecs(car).map((spec) => (
                    <span key={spec}>{spec}</span>
                  ))}
                </div>
                <div className={styles.footer}>
                  <p className={styles.price}>
                    {car.priceOnRequest || car.pricePerDay == null ? (
                      carPriceLabel(car)
                    ) : (
                      <>
                        {formatAed(car.pricePerDay)} <span>/ day</span>
                      </>
                    )}
                  </p>
                  <div className={styles.actions}>
                    <Link href={LINKS.car(car.slug)} className={styles.detailsBtn}>
                      View Details
                    </Link>
                    <Link href={LINKS.bookCar(car.slug)} className={styles.bookBtn}>
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      )}

      <div className={styles.moreWrap}>
        <Link href={LINKS.fleet} className={`${styles.moreBtn} ${styles.moreBtnWide}`}>
          View All Fleet <ArrowRightIcon size={16} />
        </Link>
        <Link href={LINKS.fleet} className={`${styles.moreBtn} ${styles.moreBtnMobile}`}>
          View All {cars.length} Cars <ArrowRightIcon size={16} />
        </Link>
        <p className={styles.moreNote}>
          Showing {visible.length} of {matching.length}{" "}
          {matching.length === 1 ? "vehicle" : "vehicles"}. Prices per day as listed on elitefleet.ae.
        </p>
      </div>
    </section>
  );
}

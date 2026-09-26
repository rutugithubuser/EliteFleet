"use client";

import { ArrowRightIcon } from "./icons/Icons";
import SanityImage from "./SanityImage";
import { useBooking } from "@/context/BookingContext";
import { carPriceLabel, carSpecs, formatAed } from "@/lib/format";
import styles from "./FleetGrid.module.css";

// How many cars the grid shows at once
const MAX_VISIBLE = 6;

export default function FleetGrid({ cars = [], categoryNames = [] }) {
  const { category: active, setCategory: setActive } = useBooking();
  const tabs = ["All", ...categoryNames];

  const matching = active === "All" ? cars : cars.filter((c) => c.category === active);
  const visible = matching.slice(0, MAX_VISIBLE);

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
        <div className={styles.grid}>
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
      )}

      <div className={styles.moreWrap}>
        <a href="#fleet" className={`${styles.moreBtn} ${styles.moreBtnWide}`}>
          View All Fleet <ArrowRightIcon size={16} />
        </a>
        <a href="#fleet" className={`${styles.moreBtn} ${styles.moreBtnMobile}`}>
          View All {cars.length} Cars <ArrowRightIcon size={16} />
        </a>
        <p className={styles.moreNote}>
          Showing {visible.length} of {matching.length}{" "}
          {matching.length === 1 ? "vehicle" : "vehicles"}. Prices per day as listed on elitefleet.ae.
        </p>
      </div>
    </section>
  );
}

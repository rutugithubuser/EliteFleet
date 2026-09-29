"use client";

import Link from "next/link";
import { ArrowRightIcon, SeatsIcon, TransmissionIcon, MileageIcon } from "./icons/Icons";
import SanityImage from "./SanityImage";
import { formatAed } from "@/lib/format";
import styles from "./RelatedVehicles.module.css";

// "Related Vehicles" — the cross-sell grid under the vehicle detail page.
//
// Figma desktop (27:273): a 1440x823 white section, padding 96/64/120/64,
// a 48px gap between the header and the grid. The header pairs a heading
// block (gold rule + "YOU MAY ALSO LIKE", 48/54 title, 18/30 subtitle) with
// an outlined "View All Fleet" button, bottom-aligned. The grid is three
// 416px cards with a 32px gap.
//
// Figma mobile (28:533): a 390x691 section, padding 48 top / 120 bottom.
// Only the 22/30 title survives — the eyebrow, subtitle and button are
// dropped — and the grid becomes a horizontal scroller of 300px cards with a
// 16px gap and 20px side insets.
//
// Card anatomy (both breakpoints): a 280px photo with a white category badge
// at 16/16, then a body (24px top padding, 16px gaps) holding brand/model,
// three spec rows, a hairline divider, and a price row with "View Details"
// and an outlined "Book Now" button.
export default function RelatedVehicles({
  cars = [],
  subtitle = "From everyday comfort to extraordinary performance.",
  className,
}) {
  if (cars.length === 0) return null;

  return (
    <section className={className ? `${styles.section} ${className}` : styles.section}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            <span className={styles.eyebrow}>You may also like</span>
          </div>
          <h2 className={styles.title}>Related Vehicles</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <Link href="/#fleet" className={styles.viewAll}>
          View All Fleet <ArrowRightIcon size={16} />
        </Link>
      </div>

      <div className={styles.track} role="list">
        {cars.map((car) => (
          <VehicleCard key={car._id} car={car} />
        ))}
      </div>
    </section>
  );
}

function VehicleCard({ car }) {
  // Built explicitly rather than through carSpecs() so an icon can never end up
  // paired with the wrong label when one of the Sanity fields is empty.
  const specs = [
    { icon: SeatsIcon, text: car.seats ? `${car.seats} Seats` : null },
    { icon: TransmissionIcon, text: car.transmission || null },
    { icon: MileageIcon, text: car.dailyKmLimit ? `${car.dailyKmLimit} km` : null },
  ].filter((spec) => spec.text);

  const hasDailyRate = car?.pricePerDay != null && !car.priceOnRequest;

  return (
    <article className={styles.card} role="listitem">
      <div className={styles.media}>
        <SanityImage
          image={car.image}
          alt={car.image?.alt || car.name}
          sizes="(max-width: 600px) 300px, 416px"
          className={styles.image}
        />
        {car.category && <span className={styles.categoryBadge}>{car.category}</span>}
      </div>

      <div className={styles.body}>
        <div className={styles.cardHeading}>
          <p className={styles.cardMake}>{car.brand}</p>
          <p className={styles.cardModel}>{car.name}</p>
        </div>

        {specs.length > 0 && (
          <div className={styles.specs}>
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div key={spec.text} className={styles.specRow}>
                  <Icon size={18} className={styles.specIcon} />
                  <span className={styles.specText}>{spec.text}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.priceRow}>
          <p className={styles.price}>
            <span className={styles.priceValue}>
              {hasDailyRate ? formatAed(car.pricePerDay) : "Rates on request"}
            </span>
            {hasDailyRate && <span className={styles.priceUnit}>/ day</span>}
          </p>
          <div className={styles.actions}>
            <Link href={`/fleet/${car.slug}`} className={styles.viewDetails}>
              View Details
            </Link>
            <Link href={`/booking?car=${encodeURIComponent(car.slug)}`} className={styles.bookNow}>
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

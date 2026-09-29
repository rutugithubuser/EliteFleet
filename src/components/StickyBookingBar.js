"use client";

import Link from "next/link";
import { WhatsappIcon, ArrowRightIcon } from "./icons/Icons";
import { LINKS } from "@/lib/links";
import { carPriceLabel, formatAed, whatsappLink } from "@/lib/format";
import styles from "./StickyBookingBar.module.css";

// Mobile: a fixed bar at the bottom of the viewport with the price, WhatsApp
// icon and a "Book This Car" button. Matches the Figma mobile frame 0:664.
export default function StickyBookingBar({ car, settings = {} }) {
  const whatsapp = whatsappLink(settings.whatsappNumber);
  const dailyRate = car?.pricePerDay ? formatAed(car.pricePerDay) : carPriceLabel(car);

  return (
    <div className={styles.bar} role="region" aria-label="Quick booking">
      <div className={styles.price}>
        <span className={styles.priceValue}>{dailyRate}</span>
        <span className={styles.priceUnit}>per day</span>
      </div>

      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className={styles.whatsapp}
          aria-label="Chat on WhatsApp"
        >
          <WhatsappIcon size={22} />
        </a>
      )}

      <Link href={car?.slug ? LINKS.bookCar(car.slug) : LINKS.booking} className={styles.cta}>
        Book This Car <ArrowRightIcon size={18} />
      </Link>
    </div>
  );
}
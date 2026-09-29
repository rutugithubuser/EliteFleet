"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CalendarIcon, WhatsappIcon } from "./icons/Icons";
import FieldDropdown from "./FieldDropdown";
import { formatAed, whatsappLink } from "@/lib/format";
import { useToday } from "@/lib/useToday";
import { LINKS } from "@/lib/links";
import styles from "./BookingPanel.module.css";

// The sticky right-hand panel on the desktop detail page.
//
// Figma 27:78: a 416x868 card (32px padding, 24px gaps) holding a category
// badge, the brand, the year + name, the daily rate, a hairline, the two date
// fields and the pickup location, a cost summary, the two CTAs and the
// confirmation line. Below ~1180px it stops being sticky and flows with the page.
export default function BookingPanel({ car, settings = {} }) {
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [location, setLocation] = useState("Select location");
  const today = useToday();

  const locations = settings.pickupLocations ?? ["Dubai Marina", "Downtown Dubai", "DXB Airport"];

  const hasDailyRate = car?.pricePerDay != null && !car.priceOnRequest;
  const dailyRate = hasDailyRate ? formatAed(car.pricePerDay) : "Rates on request";
  const mileage = car?.dailyKmLimit ? `${car.dailyKmLimit} km` : "Unlimited";
  const whatsapp = whatsappLink(settings.whatsappNumber);

  // "Book This Car" opens the booking page with this car, and carries over
  // whatever the visitor already picked here (dates, pickup location).
  const bookingParams = new URLSearchParams();
  if (pickupDate) bookingParams.set("pickup", pickupDate);
  if (dropoffDate) bookingParams.set("dropoff", dropoffDate);
  if (locations.includes(location)) bookingParams.set("location", location);
  const extra = bookingParams.toString();
  const bookingHref = car?.slug
    ? `${LINKS.bookCar(car.slug)}${extra ? `&${extra}` : ""}`
    : LINKS.booking;

  return (
    <aside className={styles.panel} aria-label="Book this car">
      <div className={styles.title}>
        {car?.category && <span className={styles.badge}>{car.category}</span>}
        {car?.brand && <p className={styles.brand}>{car.brand}</p>}
        <p className={styles.name}>
          {[car?.year, car?.name].filter(Boolean).join(" ") || "This car"}
        </p>
      </div>

      <p className={styles.price}>
        <span className={styles.priceValue}>{dailyRate}</span>
        {hasDailyRate && <span className={styles.priceUnit}>/ day</span>}
      </p>

      <div className={styles.rule} aria-hidden="true" />

      <div className={styles.dates}>
        <FieldDropdown
          className={styles.field}
          labelOutside
          icon={<CalendarIcon size={20} className={styles.fieldIcon} />}
          label="Pickup Date"
          value={pickupDate}
          options={[]}
          onSelect={setPickupDate}
          date
          min={today || undefined}
        />
        <FieldDropdown
          className={styles.field}
          labelOutside
          icon={<CalendarIcon size={20} className={styles.fieldIcon} />}
          label="Drop-off Date"
          value={dropoffDate}
          options={[]}
          onSelect={setDropoffDate}
          date
          min={pickupDate || today || undefined}
        />
      </div>

      <FieldDropdown
        className={styles.field}
        labelOutside
        label="Pickup Location"
        value={location}
        options={locations}
        onSelect={setLocation}
      />

      <dl className={styles.summary}>
        <div className={styles.summaryRow}>
          <dt>Daily rate</dt>
          <dd>{dailyRate}</dd>
        </div>
        <div className={styles.summaryRow}>
          <dt>Mileage</dt>
          <dd>{mileage}</dd>
        </div>
        <div className={styles.summaryRow}>
          <dt>Insurance</dt>
          <dd>Included</dd>
        </div>
      </dl>

      <Link href={bookingHref} className={styles.cta}>
        Book This Car
        <ArrowRightIcon size={18} />
      </Link>

      {whatsapp && (
        <a href={whatsapp} target="_blank" rel="noreferrer" className={styles.ctaGhost}>
          <WhatsappIcon size={18} />
          WhatsApp Us
        </a>
      )}

      <p className={styles.confirm}>
        Your request is confirmed by our team before the booking is final.
      </p>
    </aside>
  );
}

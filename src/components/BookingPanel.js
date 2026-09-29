"use client";

import { useState } from "react";
import { ArrowRightIcon, CalendarIcon, WhatsappIcon } from "./icons/Icons";
import FieldDropdown from "./FieldDropdown";
import { formatAed, whatsappLink } from "@/lib/format";
import styles from "./BookingPanel.module.css";

function todayLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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

  const locations = settings.pickupLocations ?? ["Dubai Marina", "Downtown Dubai", "DXB Airport"];

  const hasDailyRate = car?.pricePerDay != null && !car.priceOnRequest;
  const dailyRate = hasDailyRate ? formatAed(car.pricePerDay) : "Rates on request";
  const mileage = car?.dailyKmLimit ? `${car.dailyKmLimit} km` : "Unlimited";
  const whatsapp = whatsappLink(settings.whatsappNumber);

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
          min={todayLocal()}
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
          min={pickupDate || todayLocal()}
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

      <button type="button" className={styles.cta}>
        Book This Car
        <ArrowRightIcon size={18} />
      </button>

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

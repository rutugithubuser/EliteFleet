"use client";

import { useState } from "react";
import { CalendarIcon } from "./icons/Icons";
import FieldDropdown from "./FieldDropdown";
import IncludesList from "./IncludesList";
import styles from "./MobileBooking.module.css";

function todayLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Mobile booking form — the "Booking" section of the Figma mobile frame:
// a "Book this car" heading, three input rows, then the rental includes.
export default function MobileBooking({ car, settings = {} }) {
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [location, setLocation] = useState("Select location");

  const locations = settings.pickupLocations ?? ["Dubai Marina", "Downtown Dubai", "DXB Airport"];

  return (
    <section className={styles.section} aria-labelledby="mobile-booking-heading">
      <h2 id="mobile-booking-heading" className={styles.heading}>Book this car</h2>

      <div className={styles.fields}>
        <FieldDropdown
          icon={<CalendarIcon size={20} className={styles.fieldIcon} />}
          label="PICKUP DATE"
          value={pickupDate}
          options={[]}
          onSelect={setPickupDate}
          date
          min={todayLocal()}
        />
        <FieldDropdown
          icon={<CalendarIcon size={20} className={styles.fieldIcon} />}
          label="DROP-OFF DATE"
          value={dropoffDate}
          options={[]}
          onSelect={setDropoffDate}
          date
          min={pickupDate || todayLocal()}
        />
        <FieldDropdown
          icon={<CalendarIcon size={20} className={styles.fieldIcon} />}
          label="PICKUP LOCATION"
          value={location}
          options={locations}
          onSelect={setLocation}
        />
      </div>

      <IncludesList items={car?.includes} />
    </section>
  );
}
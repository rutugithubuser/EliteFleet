"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  CalendarIcon,
  CarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "./icons/Icons";
import FieldDropdown from "./FieldDropdown";
import { useBooking } from "@/context/BookingContext";
import styles from "./Hero.module.css";

const LOCATIONS = [
  "Dubai International Airport (DXB)",
  "Downtown Dubai",
  "Dubai Marina",
  "Palm Jumeirah",
  "Business Bay",
  "Jumeirah Beach Residence (JBR)",
  "Al Maktoum International Airport (DWC)",
];

const CAR_TYPES = ["All categories", "Luxury", "SUV", "Sports", "Exotic", "Economy", "Convertible"];

function todayLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function BookingBar() {
  const { category, setCategory } = useBooking();
  const [location, setLocation] = useState("Select location");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [today, setToday] = useState("");

useEffect(() => {
  setToday(todayLocal());
}, []);

  const carTypeValue = category === "All" ? "All categories" : category;

  function handleCarType(value) {
    setCategory(value === "All categories" ? "All" : value);
  }

  function handleSearch() {
    const el = document.getElementById("fleet");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className={styles.bookingBar}>
      <FieldDropdown
        icon={<Image src="/icons/pin.png" alt="" width={22} height={22} className={styles.fieldIcon} />}
        label="PICKUP LOCATION"
        value={location}
        options={LOCATIONS}
        onSelect={setLocation}
      />

      <div className={styles.field}>
        <label className={styles.fieldButton} htmlFor="pickup-date">
          <CalendarIcon className={styles.fieldIcon} size={22} />
          <span className={styles.fieldText}>
            <span className={styles.fieldLabel}>PICKUP DATE</span>
            <input
              id="pickup-date"
              type="date"
              className={styles.dateInput}
              value={pickupDate}
              min={today || undefined}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </span>
        </label>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldButton} htmlFor="dropoff-date">
          <CalendarIcon className={styles.fieldIcon} size={22} />
          <span className={styles.fieldText}>
            <span className={styles.fieldLabel}>DROP-OFF DATE</span>
            <input
              id="dropoff-date"
              type="date"
              className={styles.dateInput}
              value={dropoffDate}
              min={pickupDate || today || undefined}
              onChange={(e) => setDropoffDate(e.target.value)}
            />
          </span>
        </label>
      </div>

      <FieldDropdown
        icon={<CarIcon className={styles.fieldIcon} size={22} />}
        label="CAR TYPE"
        value={carTypeValue}
        options={CAR_TYPES}
        onSelect={handleCarType}
      />

      <button type="button" className={styles.searchButton} onClick={handleSearch}>
        Search Cars <ArrowRightIcon size={18} />
      </button>
    </div>
  );
}

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.topRow}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          <span>Luxury &amp; Premium Car Rental &middot; Dubai, UAE</span>
        </div>
        <div className={styles.hours}>
          <span className={styles.hoursDot} />
          <span>Open today &middot; 8:00 AM – 10:00 PM</span>
        </div>
      </div>

      <h1 className={styles.headline}>
        Drive Dubai. <em>Your Way.</em>
      </h1>

      <div className={styles.copyRow}>
        <p className={styles.copy}>
          Premium and luxury cars delivered across Dubai. Choose your car and make every journey exceptional.
        </p>
        <div className={styles.ctas}>
          <a href="#fleet" className={styles.primaryCta}>
            Explore Fleet <ArrowRightIcon size={18} />
          </a>
          <a href="#fleet" className={styles.secondaryCta}>
            Book a Car
          </a>
        </div>
      </div>
    <div className={styles.stageWrap}>
      <div className={styles.stage}>
        <Image
          src="/images/hero-phantom.png"
          alt="Rolls-Royce Phantom in a Dubai parking structure"
          fill
          priority
          sizes="100vw"
          className={styles.stageImage}
        />
        <div className={styles.scrim} />

        <div className={styles.nowShowing}>
          <div className={styles.nowShowingText}>
            <span className={styles.nowShowingLabel}>Now Showing</span>
            <span className={styles.nowShowingModel}>Rolls-Royce Phantom</span>
          </div>
          <span className={styles.divider} />
          <div className={styles.price}>
            <span className={styles.priceValue}>AED 6,499</span>
            <span className={styles.priceUnit}>/ day</span>
          </div>
        </div>

        <div className={styles.slideControls}>
          <span className={styles.slideCount}>01 / 04</span>
          <span className={styles.progress}>
            <span className={styles.progressFill} />
          </span>
          <button type="button" className={styles.slideButton} aria-label="Previous car">
            <ChevronLeftIcon size={18} />
          </button>
          <button type="button" className={styles.slideButton} aria-label="Next car">
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>
        <BookingBar />
      </div>
    </section>
  );
}

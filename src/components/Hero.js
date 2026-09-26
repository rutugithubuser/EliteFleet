"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  CalendarIcon,
  CarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "./icons/Icons";
import FieldDropdown from "./FieldDropdown";
import SanityImage from "./SanityImage";
import { useBooking } from "@/context/BookingContext";
import { carPriceLabel, formatAed } from "@/lib/format";
import styles from "./Hero.module.css";

// Used only if a Homepage field is left empty in Sanity
const DEFAULTS = {
  heroLabel: "Luxury & Premium Car Rental · Dubai, UAE",
  heroHeadline: "Drive Dubai.",
  heroHeadlineAccent: "Your Way.",
  heroDescription:
    "Premium and luxury cars delivered across Dubai. Choose your car and make every journey exceptional.",
};

function todayLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Today's date is only known in the visitor's browser (the page is pre-built on the server).
// This returns "" while pre-building and the real date in the browser, without a hydration mismatch.
const noSubscribe = () => () => {};
function useToday() {
  return useSyncExternalStore(noSubscribe, todayLocal, () => "");
}

function BookingBar({ locations, categoryNames }) {
  const { category, setCategory } = useBooking();
  const [location, setLocation] = useState("Select location");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const today = useToday();

  const carTypes = ["All categories", ...categoryNames];
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
        options={locations}
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
        options={carTypes}
        onSelect={handleCarType}
      />

      <button type="button" className={styles.searchButton} onClick={handleSearch}>
        Search Cars <ArrowRightIcon size={18} />
      </button>
    </div>
  );
}

export default function Hero({ home = {}, settings = {}, categoryNames = [] }) {
  const slides = (home.heroSlides ?? []).filter((s) => s?.car);
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const hasMultipleSlides = slides.length > 1;

  const label = home.heroLabel || DEFAULTS.heroLabel;
  const headline = home.heroHeadline || DEFAULTS.heroHeadline;
  const accent = home.heroHeadlineAccent || DEFAULTS.heroHeadlineAccent;
  const description = home.heroDescription || DEFAULTS.heroDescription;

  function go(dir) {
    setIndex((i) => (i + dir + slides.length) % slides.length);
  }

  return (
    <section className={styles.hero} id="top">
      <div className={styles.topRow}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          <span>{label}</span>
        </div>
        {settings.openingHours && (
          <div className={styles.hours}>
            <span className={styles.hoursDot} />
            <span>Open today &middot; {settings.openingHours}</span>
          </div>
        )}
      </div>

      <h1 className={styles.headline}>
        {headline} <em>{accent}</em>
      </h1>

      <div className={styles.copyRow}>
        <p className={styles.copy}>{description}</p>
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
          {slide ? (
            <SanityImage
              key={slide._key}
              image={slide.image}
              alt={slide.image?.alt || slide.car.name}
              sizes="100vw"
              eager={index === 0}
              className={styles.stageImage}
            />
          ) : (
            <Image
              src="/images/hero-phantom.png"
              alt="Rolls-Royce Phantom in a Dubai parking structure"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
              className={styles.stageImage}
            />
          )}
          <div className={styles.scrim} />

          {slide && (
            <div className={styles.nowShowing}>
              <div className={styles.nowShowingText}>
                <span className={styles.nowShowingLabel}>Now Showing</span>
                <span className={styles.nowShowingModel}>{slide.car.name}</span>
              </div>
              <span className={styles.divider} />
              <div className={styles.price}>
                {slide.car.priceOnRequest || slide.car.pricePerDay == null ? (
                  <span className={styles.priceValue}>{carPriceLabel(slide.car)}</span>
                ) : (
                  <>
                    <span className={styles.priceValue}>{formatAed(slide.car.pricePerDay)}</span>
                    <span className={styles.priceUnit}>/ day</span>
                  </>
                )}
              </div>
            </div>
          )}

          {hasMultipleSlides && (
            <div className={styles.slideControls}>
              <span className={styles.slideCount}>
                {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
              <span className={styles.progress}>
                <span
                  className={styles.progressFill}
                  style={{ width: `${((index + 1) / slides.length) * 100}%` }}
                />
              </span>
              <button
                type="button"
                className={styles.slideButton}
                aria-label="Previous car"
                onClick={() => go(-1)}
              >
                <ChevronLeftIcon size={18} />
              </button>
              <button
                type="button"
                className={styles.slideButton}
                aria-label="Next car"
                onClick={() => go(1)}
              >
                <ChevronRightIcon size={18} />
              </button>
            </div>
          )}
        </div>
        <BookingBar locations={settings.pickupLocations ?? []} categoryNames={categoryNames} />
      </div>
    </section>
  );
}

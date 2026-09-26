"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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

// Splits text into words that slide in one after another (see .word in Hero.module.css)
function AnimatedWords({ text, startAt }) {
  return text.split(/\s+/).map((word, i) => (
    <span key={i}>
      {i > 0 && " "}
      <span className={styles.word} style={{ "--w": startAt + i }}>
        {word}
      </span>
    </span>
  ));
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

// How long each car stays on screen before the carousel moves on
const AUTOPLAY_MS = 5000;

// True if the visitor has asked their device to reduce motion
const subscribeToMotionPref = (callback) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotionPref,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

// True while the browser tab is in the background
const subscribeToVisibility = (callback) => {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
};
function usePageHidden() {
  return useSyncExternalStore(subscribeToVisibility, () => document.hidden, () => false);
}

export default function Hero({ home = {}, settings = {}, categoryNames = [] }) {
  // A slide uses its own wide photo if one was uploaded, otherwise the car's photo
  const slides = (home.heroSlides ?? [])
    .filter((s) => s?.car)
    .map((s) => ({ ...s, image: s.image?.asset ? s.image : s.car.image }))
    .filter((s) => s.image?.asset);
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const hasMultipleSlides = slides.length > 1;

  // Auto-play pauses while hovered, while a control has keyboard focus,
  // while the tab is in the background, and for visitors who prefer less motion
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const pageHidden = usePageHidden();
  const reducedMotion = usePrefersReducedMotion();
  const autoplay = hasMultipleSlides && !hovered && !focused && !pageHidden && !reducedMotion;

  const label = home.heroLabel || DEFAULTS.heroLabel;
  const headline = home.heroHeadline || DEFAULTS.heroHeadline;
  const accent = home.heroHeadlineAccent || DEFAULTS.heroHeadlineAccent;
  const description = home.heroDescription || DEFAULTS.heroDescription;

  // After the first manual switch, slide changes animate without the page-load delay
  const [hasSwitched, setHasSwitched] = useState(false);

  function go(dir) {
    setHasSwitched(true);
    setIndex((i) => (i + dir + slides.length) % slides.length);
  }

  function goTo(i) {
    setHasSwitched(true);
    setIndex(i);
  }

  // Move to the next car after AUTOPLAY_MS. Restarts whenever the slide changes,
  // so a manual click always gets a full 5 seconds before the next auto move.
  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(() => {
      setHasSwitched(true);
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [autoplay, index, slides.length]);

  // Swipe left/right on touch screens
  const touchStartX = useRef(null);
  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchStartX.current == null || !hasMultipleSlides) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
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
        <AnimatedWords text={headline} startAt={0} />{" "}
        <em>
          <AnimatedWords text={accent} startAt={headline.split(/\s+/).length} />
        </em>
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
        <div
          className={styles.stage}
          aria-roledescription={hasMultipleSlides ? "carousel" : undefined}
          aria-label={hasMultipleSlides ? "Featured cars" : undefined}
          onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
          // Only keyboard focus pauses auto-play (a tap on mobile also "focuses" a button)
          onFocus={(e) => e.target.matches(":focus-visible") && setFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {slides.length > 0 ? (
            // All slides are stacked; only the active one is visible, so switching crossfades
            slides.map((s, i) => (
              <div
                key={s._key}
                className={`${styles.slide} ${i === index ? styles.slideActive : ""}`}
                aria-hidden={i !== index}
              >
                <SanityImage
                  image={s.image}
                  alt={s.image?.alt || s.car.name}
                  sizes="100vw"
                  eager={i === 0}
                  className={styles.stageImage}
                />
              </div>
            ))
          ) : (
            <div className={`${styles.slide} ${styles.slideActive}`}>
              <Image
                src="/images/hero-phantom.png"
                alt="Rolls-Royce Phantom in a Dubai parking structure"
                fill
                loading="eager"
                fetchPriority="high"
                sizes="100vw"
                className={styles.stageImage}
              />
            </div>
          )}
          <div className={styles.scrim} />

          {slide && (
            <div className={`${styles.nowShowing} ${hasSwitched ? styles.noDelay : ""}`} key={slide._key}>
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

          {/* Dots: shown on mobile, where the arrows are hidden */}
          {hasMultipleSlides && (
            <div className={styles.dots}>
              {slides.map((s, i) => (
                <button
                  key={s._key}
                  type="button"
                  className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                  aria-label={`Show ${s.car.name}`}
                  aria-current={i === index}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          )}
        </div>
        <BookingBar locations={settings.pickupLocations ?? []} categoryNames={categoryNames} />
      </div>
    </section>
  );
}

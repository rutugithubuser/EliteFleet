"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  GearIcon,
  RoadIcon,
  SearchIcon,
  SeatIcon,
  SlidersIcon,
} from "./icons/Icons";
import CarImage from "./CarImage";
import Reveal from "./Reveal";
import FiltersDrawer from "./FiltersDrawer";
import PriceRange from "./PriceRange";
import { formatAed } from "@/lib/format";
import { LINKS } from "@/lib/links";
import styles from "./FleetShowcase.module.css";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

const INTRO =
  "Luxury, sports and SUVs – plus everyday comfort – available across Dubai. All prices are per day.";

// Shared outside-click / Escape handling for every toolbar popover
function usePopover(open, setOpen) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);
  return ref;
}

// One filter trigger + its checkbox-pill panel (Category, Brand, Seats, Transmission)
function OptionPopover({ label, options, selected, onToggle, align = "left" }) {
  const [open, setOpen] = useState(false);
  const ref = usePopover(open, setOpen);
  const count = selected.length;

  return (
    <div className={styles.pop} ref={ref}>
      <button
        type="button"
        className={`${styles.trigger} ${count ? styles.triggerActive : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        {count > 0 && <span className={styles.triggerCount}>({count})</span>}
        <ChevronDownIcon size={14} className={open ? styles.chevronOpen : ""} />
      </button>
      {open && (
        <div
          className={`${styles.popPanel} ${align === "right" ? styles.popPanelRight : ""}`}
          role="group"
          aria-label={label}
        >
          <div className={styles.pillGrid}>
            {options.map((opt) => {
              const on = selected.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  className={`${styles.pill} ${on ? styles.pillOn : ""}`}
                  onClick={() => onToggle(opt)}
                  aria-pressed={on}
                >
                  {on && <CheckIcon size={13} />}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// The Price trigger opens a compact panel with the dual-range slider
function PricePopover({ bounds, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = usePopover(open, setOpen);
  const untouched = value[0] === bounds[0] && value[1] === bounds[1];

  return (
    <div className={styles.pop} ref={ref}>
      <button
        type="button"
        className={`${styles.trigger} ${untouched ? "" : styles.triggerActive}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Price
        <ChevronDownIcon size={14} className={open ? styles.chevronOpen : ""} />
      </button>
      {open && (
        <div className={`${styles.popPanel} ${styles.pricePanel}`} role="group" aria-label="Price">
          <p className={styles.popLabel}>Price per day</p>
          <PriceRange min={bounds[0]} max={bounds[1]} value={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

function SortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = usePopover(open, setOpen);
  const current = SORTS.find((s) => s.value === value) ?? SORTS[0];

  return (
    <div className={styles.pop} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {current.label}
        <ChevronDownIcon size={14} className={open ? styles.chevronOpen : ""} />
      </button>
      {open && (
        <ul className={`${styles.popPanel} ${styles.sortPanel}`} role="listbox">
          {SORTS.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                className={`${styles.sortOption} ${opt.value === value ? styles.sortOptionActive : ""}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Reads /fleet?category=... and hands the slug up. Kept as its own component
// inside its own <Suspense/> so useSearchParams doesn't force the whole page to
// client-render — the rest of the fleet page stays prerendered
// (see "useSearchParams → Prerendering" in node_modules/next/dist/docs).
function CategoryParamReader({ onParam }) {
  const param = useSearchParams().get("category");
  useEffect(() => {
    onParam(param);
  }, [param, onParam]);
  return null;
}

export default function FleetShowcase({ cars = [], categoryOptions = [] }) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]); // [] = All
  const [brands, setBrands] = useState([]);
  const [seats, setSeats] = useState([]);
  const [transmission, setTransmission] = useState([]);
  const [price, setPrice] = useState(null); // null = untouched, full range
  const [sort, setSort] = useState("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // CMS text sometimes carries stray spaces/tabs — trim once, here, so the
  // brand pills, search matching and labels all agree.
  const fleet = useMemo(
    () =>
      cars.map((c) => ({
        ...c,
        name: (c.name ?? "").trim(),
        brand: (c.brand ?? "").trim(),
      })),
    [cars]
  );

  const bounds = useMemo(() => {
    const prices = fleet.filter((c) => c.pricePerDay != null).map((c) => c.pricePerDay);
    if (!prices.length) return [0, 0];
    return [Math.min(...prices), Math.max(...prices)];
  }, [fleet]);

  const brandOptions = useMemo(
    () => [...new Set(fleet.map((c) => c.brand).filter(Boolean))].sort(),
    [fleet]
  );
  const seatOptions = useMemo(
    () => [...new Set(fleet.map((c) => c.seats).filter(Boolean))].sort((a, b) => a - b),
    [fleet]
  );
  const transmissionOptions = useMemo(
    () => [...new Set(fleet.map((c) => c.transmission).filter(Boolean))],
    [fleet]
  );

  const categoryNames = useMemo(() => categoryOptions.map((c) => c.name), [categoryOptions]);

  const priceValue = price ?? bounds;
  const priceUntouched = priceValue[0] === bounds[0] && priceValue[1] === bounds[1];

  const toggle = (setter) => (value) =>
    setter((list) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]));

  const clearAll = () => {
    setQuery("");
    setCategories([]);
    setBrands([]);
    setSeats([]);
    setTransmission([]);
    setPrice(null);
  };

  // Pre-selects the category from /fleet?category=luxury-style links (navbar,
  // homepage tiles, footer). Reacts to the param changing, so clicking another
  // category in the navbar re-filters this page without a remount; picking
  // pills by hand never changes the URL, so it never re-runs and clobbers them.
  const lastParam = useRef(undefined);
  const applyCategoryParam = useCallback(
    (param) => {
      if (lastParam.current === param) return;
      const isInitial = lastParam.current === undefined;
      lastParam.current = param;
      const match = param
        ? categoryOptions.find((c) => (c.slug ?? "").toLowerCase() === param.toLowerCase())
        : null;
      setCategories(match ? [match.name] : []);
      // Arrived via a category link while already on this page: start at the top.
      if (!isInitial && !window.location.hash) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [categoryOptions]
  );

  const activeCount =
    categories.length +
    brands.length +
    seats.length +
    transmission.length +
    (priceUntouched ? 0 : 1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = fleet.filter((car) => {
      if (q && !`${car.name} ${car.brand} ${car.category ?? ""}`.toLowerCase().includes(q)) {
        return false;
      }
      if (categories.length && !categories.includes(car.category)) return false;
      if (brands.length && !brands.includes(car.brand)) return false;
      if (seats.length && !seats.includes(car.seats)) return false;
      if (transmission.length && !transmission.includes(car.transmission)) return false;
      if (!priceUntouched) {
        // "Rates on request" cars have no price to compare against, so they
        // only appear while the price filter is still on its full range.
        if (car.pricePerDay == null) return false;
        if (car.pricePerDay < priceValue[0] || car.pricePerDay > priceValue[1]) return false;
      }
      return true;
    });

    const order = (c) => c.order ?? Number.MAX_SAFE_INTEGER;
    const priceRank = (c) => (c.pricePerDay == null ? 1 : 0); // on-request sorts last
    if (sort === "price-asc") {
      list.sort(
        (a, b) => priceRank(a) - priceRank(b) || (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0)
      );
    } else if (sort === "price-desc") {
      list.sort(
        (a, b) => priceRank(a) - priceRank(b) || (b.pricePerDay ?? 0) - (a.pricePerDay ?? 0)
      );
    } else if (sort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => order(a) - order(b) || a.name.localeCompare(b.name));
    }
    return list;
  }, [fleet, query, categories, brands, seats, transmission, priceValue, priceUntouched, sort]);

  const carPrice = (car) =>
    car.priceOnRequest || car.pricePerDay == null ? (
      "Rates on request"
    ) : (
      <>
        {formatAed(car.pricePerDay)} <span>/ day</span>
      </>
    );

  return (
    <section className={styles.section}>
      <Suspense fallback={null}>
        <CategoryParamReader onParam={applyCategoryParam} />
      </Suspense>
      <header className={styles.header}>
        <div className={styles.headline}>
          <h1 className={styles.title}>Our Fleet</h1>
          <p className={styles.intro}>{INTRO}</p>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <SearchIcon size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search make or model"
            aria-label="Search make or model"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className={styles.searchClear}
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <CloseIcon size={14} />
            </button>
          )}
        </div>

        {/* Narrow screens: one button opens the full Filters drawer */}
        <button type="button" className={styles.drawerTrigger} onClick={() => setDrawerOpen(true)}>
          <SlidersIcon size={16} />
          Filters
          {activeCount > 0 && <span className={styles.triggerCount}>({activeCount})</span>}
        </button>

        <span className={styles.filterWord}>Filter</span>
        <div className={styles.triggers}>
          <OptionPopover
            label="Category"
            options={categoryNames}
            selected={categories}
            onToggle={toggle(setCategories)}
          />
          <OptionPopover
            label="Brand"
            options={brandOptions}
            selected={brands}
            onToggle={toggle(setBrands)}
          />
          <PricePopover bounds={bounds} value={priceValue} onChange={setPrice} />
          <OptionPopover
            label="Seats"
            options={seatOptions}
            selected={seats}
            onToggle={toggle(setSeats)}
          />
          <OptionPopover
            label="Transmission"
            options={transmissionOptions}
            selected={transmission}
            onToggle={toggle(setTransmission)}
            align="right"
          />
        </div>

        <button
          type="button"
          className={styles.clearAll}
          onClick={clearAll}
          disabled={activeCount === 0 && !query}
        >
          Clear all
        </button>

        <div className={styles.sort}>
          <span className={styles.sortLabel}>Sort by:</span>
          <SortMenu value={sort} onChange={setSort} />
        </div>
      </div>

      <div className={styles.catBar}>
        <div className={styles.catPills}>
          {["All", ...categoryNames].map((cat) => {
            const on = cat === "All" ? categories.length === 0 : categories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                className={`${styles.catPill} ${on ? styles.catPillOn : ""}`}
                onClick={() => setCategories(cat === "All" ? [] : [cat])}
              >
                {cat}
              </button>
            );
          })}
        </div>
        <p className={styles.count}>
          {filtered.length} {filtered.length === 1 ? "vehicle" : "vehicles"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No vehicles match your filters.</p>
          <button type="button" className={styles.emptyBtn} onClick={clearAll}>
            Clear filters
          </button>
        </div>
      ) : (
        // Re-keys on category change only, so switching category replays the
        // card animation without restarting it on every keystroke
        <Reveal stagger key={categories.join("|")} className={styles.grid}>
          {filtered.map((car, i) => (
            <article className={styles.card} key={car.slug ?? car._id}>
              <div className={styles.imageWrap}>
                {car.category && <span className={styles.badge}>{car.category.toUpperCase()}</span>}
                <CarImage
                  image={car.image}
                  alt={car.image?.alt || car.name}
                  // The first row of cards is visible straight away, so load those photos first
                  eager={i < 3}
                  sizes="(max-width: 600px) 100vw, (max-width: 1180px) 50vw, 33vw"
                  className={styles.image}
                />
              </div>
              <p className={styles.make}>{car.brand}</p>
              <h3 className={styles.model}>{car.name}</h3>
              <div className={styles.specs}>
                {car.seats && (
                  <span>
                    <SeatIcon size={15} /> {car.seats} Seats
                  </span>
                )}
                {car.transmission && (
                  <span>
                    <GearIcon size={15} /> {car.transmission}
                  </span>
                )}
                {car.dailyKmLimit != null && (
                  <span>
                    <RoadIcon size={15} /> {car.dailyKmLimit} km
                  </span>
                )}
              </div>
              <div className={styles.footer}>
                <p className={styles.price}>{carPrice(car)}</p>
                <div className={styles.actions}>
                  <Link href={LINKS.car(car.slug)} className={styles.detailsBtn}>
                    View Details
                  </Link>
                  <Link href={LINKS.bookCar(car.slug)} className={styles.bookBtn}>
                    Book Now
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      )}

      <div className={styles.endNote}>
        <p className={styles.endTitle}>
          You&rsquo;ve viewed all {filtered.length}{" "}
          {filtered.length === 1 ? "vehicle" : "vehicles"}.
        </p>
        <p className={styles.endSub}>
          New arrivals are added regularly — ask us about availability.
        </p>
      </div>

      <FiltersDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={categoryNames}
        brands={brandOptions}
        seats={seatOptions}
        transmissions={transmissionOptions}
        bounds={bounds}
        selectedCategories={categories}
        selectedBrands={brands}
        selectedSeats={seats}
        selectedTransmission={transmission}
        price={priceValue}
        onPrice={setPrice}
        onToggleCategory={toggle(setCategories)}
        onToggleBrand={toggle(setBrands)}
        onToggleSeat={toggle(setSeats)}
        onToggleTransmission={toggle(setTransmission)}
        onClear={clearAll}
        resultCount={filtered.length}
      />
    </section>
  );
}

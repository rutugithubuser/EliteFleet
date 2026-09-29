"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarIcon,
  ChevronDownIcon,
  WhatsappIcon,
  CheckIcon,
} from "@/components/icons/Icons";
import { useToday } from "@/lib/useToday";
import { whatsappLink, formatAed } from "@/lib/format";
import { VEHICLES } from "@/data/vehicles";
import { LINKS } from "@/lib/links";
import styles from "./BookingFlow.module.css";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysBetween(from, to) {
  if (!from || !to) return null;
  const diff = (new Date(`${to}T00:00:00`) - new Date(`${from}T00:00:00`)) / 86400000;
  return diff > 0 ? diff : null;
}

function buildWhatsAppText(vehicle, form) {
  const lines = [
    "Hello Elite Fleet, I'd like to request a car rental.",
    "",
    `Vehicle: ${vehicle.name}`,
    `Name: ${form.fullName.trim()}`,
    `Email: ${form.email.trim()}`,
    `WhatsApp: ${form.phone.trim()}`,
    `Pickup date: ${fmtDate(form.pickupDate)}`,
    `Drop-off date: ${fmtDate(form.dropoffDate)}`,
    `Pickup location: ${form.pickupLocation}`,
    `Drop-off location: ${form.dropoffLocation || form.pickupLocation}`,
  ];
  if (form.specialRequests.trim()) {
    lines.push(`Special requests: ${form.specialRequests.trim()}`);
  }
  return lines.join("\n");
}

const DEFAULT_LOCATIONS = [
  "Downtown Dubai",
  "Dubai Marina",
  "Palm Jumeirah",
  "Dubai International Airport (DXB)",
  "Al Maktoum Airport (DWC)",
  "Business Bay",
  "DIFC",
  "Jumeirah",
  "Dubai Hills",
  "Abu Dhabi",
];

function StepBar({ step }) {
  const steps = [
    { n: 1, label: "Vehicle" },
    { n: 2, label: "Details" },
    { n: 3, label: "Confirmation" },
  ];
  return (
    <nav className={styles.stepBar} aria-label="Booking steps">
      {steps.map((s, i) => {
        const done = step > s.n;
        const active = step === s.n;
        return (
          <div key={s.n} className={styles.stepGroup}>
            <div
              className={[
                styles.stepItem,
                active ? styles.stepActive : "",
                done ? styles.stepDone : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className={styles.stepCircle} aria-current={active ? "step" : undefined}>
                {done ? <CheckIcon size={13} /> : String(s.n).padStart(2, "0")}
              </span>
              <span className={styles.stepLabel}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={[styles.stepLine, done ? styles.stepLineDone : ""].filter(Boolean).join(" ")}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

function VehicleSummaryCard({ vehicle, form, onChangeClick }) {
  const days = daysBetween(form.pickupDate, form.dropoffDate);
  const total = days && vehicle.pricePerDay ? days * vehicle.pricePerDay : null;

  return (
    <aside className={styles.summaryCard}>
      <div className={styles.summaryImageWrap}>
        <Image
          src={vehicle.image}
          alt={vehicle.imageAlt || vehicle.name}
          fill
          className={styles.summaryImage}
          sizes="(max-width: 900px) 100vw, 360px"
          priority
        />
      </div>
      <div className={styles.summaryBody}>
        <div className={styles.summaryTopRow}>
          <span className={styles.summaryBadge}>01 VEHICLE</span>
          <button type="button" className={styles.summaryChange} onClick={onChangeClick}>
            Change
          </button>
        </div>
        <p className={styles.summaryName}>{vehicle.name}</p>
        <div className={styles.summaryRows}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryRowLabel}>Daily rate</span>
            <span className={styles.summaryRowValue}>
              {vehicle.pricePerDay ? formatAed(vehicle.pricePerDay) : "On request"}
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryRowLabel}>Pickup</span>
            <span className={styles.summaryRowValue}>{form.pickupDate ? fmtDate(form.pickupDate) : "—"}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryRowLabel}>Drop-off</span>
            <span className={styles.summaryRowValue}>{form.dropoffDate ? fmtDate(form.dropoffDate) : "—"}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryRowLabel}>Mileage</span>
            <span className={styles.summaryRowValue}>
              {vehicle.dailyKmLimit ? `${vehicle.dailyKmLimit} km` : "—"}
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryRowLabel}>Insurance</span>
            <span className={styles.summaryRowValue}>Included</span>
          </div>
          <div className={[styles.summaryRow, styles.summaryTotal].join(" ")}>
            <span className={styles.summaryRowLabel}>Estimated total</span>
            <span className={styles.summaryRowValue}>
              {total ? formatAed(total) : "Select dates"}
            </span>
          </div>
        </div>
        <ul className={styles.trustList}>
          <li className={styles.trustItem}>
            <CheckIcon size={13} className={styles.trustIcon} />
            Clear rates, no hidden charges
          </li>
          <li className={styles.trustItem}>
            <CheckIcon size={13} className={styles.trustIcon} />
            Confirmed by our team before it&apos;s final
          </li>
          <li className={styles.trustItem}>
            <CheckIcon size={13} className={styles.trustIcon} />
            +971 58 521 0105 · 8:00 AM – 10:00 PM
          </li>
        </ul>
      </div>
    </aside>
  );
}

function MobileVehicleBar({ vehicle, onChangeClick, whatsapp }) {
  return (
    <div className={styles.mobileBar}>
      <div className={styles.mobileBarRow}>
        <div className={styles.mobileBarImgWrap}>
          <Image
            src={vehicle.image}
            alt={vehicle.imageAlt || vehicle.name}
            fill
            className={styles.mobileBarImg}
            sizes="72px"
          />
        </div>
        <div className={styles.mobileBarInfo}>
          <p className={styles.mobileBarName}>{vehicle.name}</p>
          <p className={styles.mobileBarPrice}>
            {vehicle.pricePerDay ? `${formatAed(vehicle.pricePerDay)} / day` : "Price on request"}
          </p>
        </div>
        <button type="button" className={styles.summaryChange} onClick={onChangeClick}>
          Change
        </button>
      </div>
      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className={styles.mobileWaBtn}
          id="booking-whatsapp-mobile"
        >
          <WhatsappIcon size={17} />
          Book via WhatsApp
        </a>
      )}
    </div>
  );
}

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  pickupDate: "",
  dropoffDate: "",
  pickupLocation: "",
  dropoffLocation: "",
  specialRequests: "",
  agreed: false,
};

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Please enter your full name";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Please enter a valid email address";
  const digits = form.phone.replace(/\D/g, "");
  if (digits.length < 7) errors.phone = "Please enter a valid WhatsApp number";
  if (!form.pickupDate) errors.pickupDate = "Please choose a pickup date";
  if (!form.dropoffDate) errors.dropoffDate = "Please choose a drop-off date";
  else if (form.pickupDate && form.dropoffDate <= form.pickupDate)
    errors.dropoffDate = "Drop-off must be after pickup";
  if (!form.pickupLocation) errors.pickupLocation = "Please choose a pickup location";
  if (!form.agreed) errors.agreed = "You must agree to the Terms & Conditions";
  return errors;
}

function errEl(errors, name) {
  if (!errors[name]) return null;
  return (
    <span className={styles.fieldError} id={`${name}-error`} role="alert">
      {errors[name]}
    </span>
  );
}

function DetailsForm({ vehicle, form, onChange, onSubmit, errors, locations, whatsapp, phone }) {
  const pickup1Ref = useRef(null);
  const pickup2Ref = useRef(null);
  const today = useToday();
  const allLocations = locations?.length ? locations : DEFAULT_LOCATIONS;

  const ctrl = (name) => ({
    id: `booking-${name}`,
    name,
    value: form[name],
    onChange: (e) => onChange(name, e.target.value),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form className={styles.detailsForm} onSubmit={onSubmit} noValidate id="booking-details-form">
      {/* Your Details */}
      <div className={styles.formSection}>
        <h2 className={styles.formSectionTitle}>Your Details</h2>
        <label className={styles.fieldWrap} htmlFor="booking-fullName">
          <span className={styles.fieldLabel}>Full Name</span>
          <input
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            className={[styles.control, errors.fullName ? styles.controlError : ""].filter(Boolean).join(" ")}
            {...ctrl("fullName")}
          />
          {errEl(errors, "fullName")}
        </label>
        <div className={styles.formRow2}>
          <label className={styles.fieldWrap} htmlFor="booking-email">
            <span className={styles.fieldLabel}>Email</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={[styles.control, errors.email ? styles.controlError : ""].filter(Boolean).join(" ")}
              {...ctrl("email")}
            />
            {errEl(errors, "email")}
          </label>
          <label className={styles.fieldWrap} htmlFor="booking-phone">
            <span className={styles.fieldLabel}>WhatsApp Phone</span>
            <input
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+971 50 000 0000"
              className={[styles.control, errors.phone ? styles.controlError : ""].filter(Boolean).join(" ")}
              {...ctrl("phone")}
            />
            {errEl(errors, "phone")}
          </label>
        </div>
      </div>

      {/* Trip Details */}
      <div className={styles.formSection}>
        <h2 className={styles.formSectionTitle}>Trip Details</h2>
        <div className={styles.formRow2}>
          <label className={styles.fieldWrap} htmlFor="booking-pickupDate">
            <span className={styles.fieldLabel}>Pickup Date</span>
            <span className={styles.dateWrap}>
              <CalendarIcon size={18} className={styles.calendarIcon} aria-hidden="true" />
              <input
                ref={pickup1Ref}
                type="date"
                id="booking-pickupDate"
                name="pickupDate"
                min={today || undefined}
                value={form.pickupDate}
                onChange={(e) => onChange("pickupDate", e.target.value)}
                onClick={() => pickup1Ref.current?.showPicker?.()}
                className={[
                  styles.control,
                  styles.dateInput,
                  !form.pickupDate ? styles.dateEmpty : "",
                  errors.pickupDate ? styles.controlError : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-invalid={errors.pickupDate ? true : undefined}
                aria-describedby={errors.pickupDate ? "pickupDate-error" : undefined}
              />
              {!form.pickupDate && (
                <span className={styles.datePlaceholder} aria-hidden="true">Select date</span>
              )}
            </span>
            {errEl(errors, "pickupDate")}
          </label>
          <label className={styles.fieldWrap} htmlFor="booking-dropoffDate">
            <span className={styles.fieldLabel}>Drop-off Date</span>
            <span className={styles.dateWrap}>
              <CalendarIcon size={18} className={styles.calendarIcon} aria-hidden="true" />
              <input
                ref={pickup2Ref}
                type="date"
                id="booking-dropoffDate"
                name="dropoffDate"
                min={form.pickupDate || today || undefined}
                value={form.dropoffDate}
                onChange={(e) => onChange("dropoffDate", e.target.value)}
                onClick={() => pickup2Ref.current?.showPicker?.()}
                className={[
                  styles.control,
                  styles.dateInput,
                  !form.dropoffDate ? styles.dateEmpty : "",
                  errors.dropoffDate ? styles.controlError : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-invalid={errors.dropoffDate ? true : undefined}
                aria-describedby={errors.dropoffDate ? "dropoffDate-error" : undefined}
              />
              {!form.dropoffDate && (
                <span className={styles.datePlaceholder} aria-hidden="true">Select date</span>
              )}
            </span>
            {errEl(errors, "dropoffDate")}
          </label>
        </div>
        <div className={styles.formRow2}>
          <label className={styles.fieldWrap} htmlFor="booking-pickupLocation">
            <span className={styles.fieldLabel}>Pickup Location</span>
            <span className={styles.selectWrap}>
              <select
                id="booking-pickupLocation"
                name="pickupLocation"
                value={form.pickupLocation}
                onChange={(e) => onChange("pickupLocation", e.target.value)}
                className={[
                  styles.control,
                  styles.selectControl,
                  !form.pickupLocation ? styles.selectPlaceholder : "",
                  errors.pickupLocation ? styles.controlError : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-invalid={errors.pickupLocation ? true : undefined}
                aria-describedby={errors.pickupLocation ? "pickupLocation-error" : undefined}
              >
                <option value="" disabled>Select location</option>
                {allLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronDownIcon size={18} className={styles.selectChevron} aria-hidden="true" />
            </span>
            {errEl(errors, "pickupLocation")}
          </label>
          <label className={styles.fieldWrap} htmlFor="booking-dropoffLocation">
            <span className={styles.fieldLabel}>Drop-off Location</span>
            <span className={styles.selectWrap}>
              <select
                id="booking-dropoffLocation"
                name="dropoffLocation"
                value={form.dropoffLocation}
                onChange={(e) => onChange("dropoffLocation", e.target.value)}
                className={[
                  styles.control,
                  styles.selectControl,
                  !form.dropoffLocation ? styles.selectPlaceholder : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <option value="">Same as pickup</option>
                {allLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronDownIcon size={18} className={styles.selectChevron} aria-hidden="true" />
            </span>
          </label>
        </div>
      </div>

      {/* Special Requests */}
      <div className={styles.formSection}>
        <label className={styles.fieldWrap} htmlFor="booking-specialRequests">
          <span className={styles.fieldLabel}>
            Special Requests <span className={styles.optional}>(optional)</span>
          </span>
          <textarea
            id="booking-specialRequests"
            name="specialRequests"
            rows={4}
            placeholder="Flight number, child seat, chauffeur requests…"
            className={[styles.control, styles.textarea].join(" ")}
            value={form.specialRequests}
            onChange={(e) => onChange("specialRequests", e.target.value)}
          />
        </label>
      </div>

      {/* Terms */}
      <div className={styles.checkboxWrap}>
        <label className={styles.checkboxLabel} htmlFor="booking-agreed">
          <input
            type="checkbox"
            id="booking-agreed"
            name="agreed"
            checked={form.agreed}
            onChange={(e) => onChange("agreed", e.target.checked)}
            className={styles.checkbox}
          />
          <span>
            I agree to the{" "}
            <Link href={LINKS.legal("terms-and-conditions")} className={styles.legalLink}>
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link href={LINKS.legal("privacy-policy")} className={styles.legalLink}>
              Privacy Policy
            </Link>
          </span>
        </label>
        {errEl(errors, "agreed")}
      </div>

      {/* Actions */}
      <div className={styles.formActions}>
        <Link href={LINKS.fleet} className={styles.backLink}>
          ← Back to vehicle
        </Link>
        <button type="submit" className={[styles.submitBtn, "shimmer"].join(" ")} id="booking-submit">
          Request Booking
          <ArrowRightIcon size={16} className={styles.submitIcon} />
        </button>
      </div>

      {/* WhatsApp alternative */}
      {whatsapp && (
        <div className={styles.waCard}>
          <WhatsappIcon size={22} className={styles.waIcon} aria-hidden="true" />
          <div className={styles.waText}>
            <p className={styles.waHeadline}>Prefer WhatsApp?</p>
            <p className={styles.waSub}>
              Message us your car and dates on {phone || "+971 58 521 0105"} — we&apos;ll reply there
            </p>
          </div>
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className={styles.waBtn}
            id="booking-whatsapp-alt"
          >
            Open WhatsApp
          </a>
        </div>
      )}
    </form>
  );
}

function ConfirmationStep({ vehicle, form, whatsapp }) {
  const dropoff = form.dropoffLocation || form.pickupLocation;
  const waMsgUrl = whatsapp
    ? `${whatsapp}?text=${encodeURIComponent(buildWhatsAppText(vehicle, form))}`
    : null;

  return (
    <div className={styles.confirmWrap}>
      <div className={styles.confirmCard}>
        <div className={styles.confirmIconWrap} aria-hidden="true">
          <CheckIcon size={28} />
        </div>
        <h1 className={styles.confirmTitle}>Booking request received.</h1>
        <p className={styles.confirmSub}>
          Thank you, {form.fullName.trim().split(" ")[0]}. Our team will review your request and
          confirm availability and your rate by WhatsApp or email.
        </p>
        <div className={styles.receipt}>
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Vehicle</span>
            <span className={styles.receiptValue}>{vehicle.name}</span>
          </div>
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Pickup</span>
            <span className={styles.receiptValue}>
              {fmtDate(form.pickupDate)} · {form.pickupLocation}
            </span>
          </div>
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Drop-off</span>
            <span className={styles.receiptValue}>
              {fmtDate(form.dropoffDate)} · {dropoff}
            </span>
          </div>
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Daily rate</span>
            <span className={styles.receiptValue}>
              {vehicle.pricePerDay ? formatAed(vehicle.pricePerDay) : "On request"}
            </span>
          </div>
        </div>
        <div className={styles.confirmActions}>
          <Link href={LINKS.home} className={[styles.confirmBtnPrimary, "shimmer"].join(" ")} id="booking-back-home">
            Back to Home
          </Link>
          {waMsgUrl && (
            <a
              href={waMsgUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.confirmBtnSecondary}
              id="booking-whatsapp-confirm"
            >
              <WhatsappIcon size={18} />
              Message us on WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingFlow({ carSlug, settings = {} }) {
  const vehicle =
    (carSlug ? VEHICLES.find((v) => v.slug === carSlug) : null) ?? VEHICLES[0];

  const [step, setStep] = useState(2);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const waBase = whatsappLink(settings?.whatsappNumber) || "https://wa.me/971585210105";
  const phone = settings?.phone || "+971 58 521 0105";

  const handleChange = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstKey = Object.keys(EMPTY_FORM).find((k) => found[k]);
      document.getElementById(`booking-${firstKey}`)?.focus();
      return;
    }
    const url = `${waBase}?text=${encodeURIComponent(buildWhatsAppText(vehicle, form))}`;
    const win = window.open(url, "_blank");
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    if (!win) window.location.assign(url);
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChangeVehicle = () => {
    window.location.href = LINKS.fleet;
  };

  const locations = settings?.pickupLocations ?? [];

  return (
    <div className={styles.page}>
      {step === 2 && (
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderInner}>
            <div>
              <h1 className={styles.pageTitle}>Request a Booking</h1>
              <p className={styles.pageSubtitle}>
                Send your details and our team will confirm availability and your rate.
              </p>
            </div>
            <StepBar step={step} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={styles.pageHeaderConfirm}>
          <div className={styles.pageHeaderInner}>
            <StepBar step={step} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.layout}>
          <div className={styles.layoutInner}>
            <MobileVehicleBar
              vehicle={vehicle}
              onChangeClick={handleChangeVehicle}
              whatsapp={waBase}
            />
            <div className={styles.formCard}>
              <DetailsForm
                vehicle={vehicle}
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                errors={errors}
                locations={locations}
                whatsapp={waBase}
                phone={phone}
              />
            </div>
            <VehicleSummaryCard vehicle={vehicle} form={form} onChangeClick={handleChangeVehicle} />
          </div>
        </div>
      )}

      {step === 3 && (
        <ConfirmationStep vehicle={vehicle} form={form} whatsapp={waBase} phone={phone} />
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { ArrowRightIcon, CalendarIcon, CheckIcon, ChevronDownIcon, WhatsappIcon } from "../icons/Icons";
import Reveal from "../Reveal";
import SectionHeading from "./SectionHeading";
import { useToday } from "@/lib/useToday";
import { whatsappLink } from "@/lib/format";
import { sendEnquiry } from "@/lib/sendEnquiry";
import styles from "./ChauffeurRequest.module.css";

const EMPTY = { name: "", phone: "", service: "", date: "", pickup: "", destination: "" };

// "2026-10-03" -> "3 October 2026"
function readableDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function checkForm(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name";
  const digits = values.phone.replace(/\D/g, "");
  if (digits.length < 8) errors.phone = "Please enter a WhatsApp number we can reach";
  if (!values.service) errors.service = "Please choose a service";
  if (!values.date) errors.date = "Please choose a date";
  if (!values.pickup) errors.pickup = "Please choose a pickup location";
  return errors;
}

// The message that opens in WhatsApp, ready for the visitor to send
function buildMessage(values) {
  const lines = [
    "Hello Elite Fleet, I'd like to request a chauffeur.",
    "",
    `Name: ${values.name.trim()}`,
    `WhatsApp: ${values.phone.trim()}`,
    `Service: ${values.service}`,
    `Date: ${readableDate(values.date)}`,
    `Pickup: ${values.pickup}`,
  ];
  if (values.destination.trim()) lines.push(`Destination: ${values.destination.trim()}`);
  return lines.join("\n");
}

/**
 * Chauffeur request form.
 * "Request" emails the details to the team (via Web3Forms, see src/lib/sendEnquiry.js),
 * then shows a thank-you with a WhatsApp button that has the same details typed in.
 */
export default function ChauffeurRequest({ services = [], locations = [], settings = {} }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  // "idle" → "sending" → "sent" (thank-you shown) or "error" (message + WhatsApp fallback)
  const [status, setStatus] = useState("idle");
  const today = useToday();
  const dateRef = useRef(null);

  const whatsapp = whatsappLink(settings.whatsappNumber);

  function update(field) {
    return (e) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      // Clear a field's error as soon as it is fixed
      if (errors[field]) setErrors(({ [field]: _removed, ...rest }) => rest);
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = checkForm(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move to the first field that needs fixing
      const first = Object.keys(EMPTY).find((key) => found[key]);
      e.currentTarget.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    const result = await sendEnquiry({
      subject: `New chauffeur request — ${values.service}`,
      name: values.name.trim(),
      fields: {
        "Full name": values.name.trim(),
        "WhatsApp phone": values.phone.trim(),
        Service: values.service,
        Date: readableDate(values.date),
        "Pickup location": values.pickup,
        Destination: values.destination.trim(),
      },
    });
    setStatus(result.ok ? "sent" : "error");
  }

  function startOver() {
    setValues(EMPTY);
    setStatus("idle");
  }

  // The same request, typed into WhatsApp (used on the thank-you and error messages)
  const whatsappWithDetails = whatsapp
    ? `${whatsapp}?text=${encodeURIComponent(buildMessage(values))}`
    : null;

  // Shared props for each field's error message
  const errorFor = (field) =>
    errors[field] ? (
      <span className={styles.error} id={`${field}-error`}>
        {errors[field]}
      </span>
    ) : null;
  const a11y = (field) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });

  return (
    <section className={styles.section} id="request">
      <div className={styles.inner}>
        <Reveal className={styles.intro}>
          <SectionHeading
            dark
            hideExtrasOnMobile
            eyebrow="Request a Chauffeur"
            title="Tell us about your trip."
            subtitle="Share the details and our team will get back to you to confirm the car, driver and rate."
          />
          {whatsapp && settings.phone && (
            <a href={whatsapp} target="_blank" rel="noreferrer" className={`${styles.whatsapp} ${styles.whatsappDesktop}`}>
              <WhatsappIcon size={22} className={styles.whatsappIcon} /> Or WhatsApp {settings.phone}
            </a>
          )}
        </Reveal>

        <Reveal delay={0.1} className={styles.cardWrap}>
          {status === "sent" ? (
            <div className={`${styles.card} ${styles.sent}`} role="status">
              <span className={styles.sentIcon} aria-hidden="true">
                <CheckIcon size={24} />
              </span>
              <h3 className={styles.sentTitle}>
                Thank you{values.name.trim() ? `, ${values.name.trim().split(" ")[0]}` : ""}.
                Your request has been sent.
              </h3>
              <p className={styles.sentText}>
                Our team will get back to you to confirm the car, driver and rate. Want a quicker
                reply? Send the same details on WhatsApp.
              </p>
              <div className={styles.sentActions}>
                {whatsappWithDetails && (
                  <a href={whatsappWithDetails} target="_blank" rel="noreferrer" className={styles.submit}>
                    <WhatsappIcon size={18} /> Chat on WhatsApp
                  </a>
                )}
                <button type="button" className={styles.sentSecondary} onClick={startOver}>
                  Send another request
                </button>
              </div>
            </div>
          ) : (
            <form className={styles.card} onSubmit={handleSubmit} noValidate>
              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>Full Name</span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    className={styles.control}
                    placeholder="Enter your full name"
                    value={values.name}
                    onChange={update("name")}
                    {...a11y("name")}
                  />
                  {errorFor("name")}
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>WhatsApp Phone</span>
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    className={styles.control}
                    placeholder="+971 50 000 0000"
                    value={values.phone}
                    onChange={update("phone")}
                    {...a11y("phone")}
                  />
                  {errorFor("phone")}
                </label>
              </div>

              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>Service</span>
                  <span className={styles.selectWrap}>
                    <select
                      name="service"
                      className={`${styles.control} ${styles.select} ${values.service ? "" : styles.placeholder}`}
                      value={values.service}
                      onChange={update("service")}
                      {...a11y("service")}
                    >
                      <option value="" disabled>
                        Select service
                      </option>
                      {services.map((s) => (
                        <option key={s._key} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className={styles.chevron} size={20} aria-hidden="true" />
                  </span>
                  {errorFor("service")}
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Date</span>
                  <span className={styles.dateWrap}>
                    <CalendarIcon className={styles.calendar} size={20} aria-hidden="true" />
                    <input
                      ref={dateRef}
                      name="date"
                      type="date"
                      className={`${styles.control} ${styles.date} ${values.date ? "" : styles.dateEmpty}`}
                      min={today || undefined}
                      value={values.date}
                      onChange={update("date")}
                      // Open the calendar wherever the field is clicked (where the browser supports it)
                      onClick={() => dateRef.current?.showPicker?.()}
                      {...a11y("date")}
                    />
                    {!values.date && (
                      <span className={styles.datePlaceholder} aria-hidden="true">
                        Select date
                      </span>
                    )}
                  </span>
                  {errorFor("date")}
                </label>
              </div>

              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>Pickup Location</span>
                  <span className={styles.selectWrap}>
                    <select
                      name="pickup"
                      className={`${styles.control} ${styles.select} ${values.pickup ? "" : styles.placeholder}`}
                      value={values.pickup}
                      onChange={update("pickup")}
                      {...a11y("pickup")}
                    >
                      <option value="" disabled>
                        Select location
                      </option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className={styles.chevron} size={20} aria-hidden="true" />
                  </span>
                  {errorFor("pickup")}
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Destination</span>
                  <input
                    name="destination"
                    type="text"
                    className={styles.control}
                    placeholder="Where to?"
                    value={values.destination}
                    onChange={update("destination")}
                  />
                </label>
              </div>

              <button type="submit" className={styles.submit} disabled={status === "sending"}>
                {status === "sending" ? (
                  "Sending…"
                ) : (
                  <>
                    Request Chauffeur Service <ArrowRightIcon size={18} className={styles.submitIcon} />
                  </>
                )}
              </button>

              {status === "error" && (
                <p className={styles.sendError} role="alert">
                  Sorry, your request couldn&apos;t be sent. Please try again
                  {whatsappWithDetails && (
                    <>
                      {" "}or{" "}
                      <a href={whatsappWithDetails} target="_blank" rel="noreferrer">
                        send it on WhatsApp
                      </a>
                    </>
                  )}
                  .
                </p>
              )}
            </form>
          )}
        </Reveal>

        {whatsapp && settings.phone && (
          <a href={whatsapp} target="_blank" rel="noreferrer" className={`${styles.whatsapp} ${styles.whatsappMobile}`}>
            <WhatsappIcon size={20} className={styles.whatsappIcon} /> Or WhatsApp {settings.phone}
          </a>
        )}
      </div>
    </section>
  );
}

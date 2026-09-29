"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { phoneLink, siteAddress, whatsappLink } from "@/lib/format";
import { sendEnquiry } from "@/lib/sendEnquiry";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  ChevronDownIcon,
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsappIcon,
  YouTubeIcon,
} from "./icons/Icons";
import styles from "./Contact.module.css";

// Shown when a field in Studio → Site Settings is empty, so the page always
// matches the design (the real details come from Sanity, see SITE_QUERY).
// The address is handled by siteAddress() in @/lib/format instead.
const FALLBACK = {
  phone: "+971 58 521 0105",
  email: "hi@elitefleet.ae",
  hours: "8:00 AM – 10:00 PM",
};

const ENQUIRY_TYPES = [
  "Car rental booking",
  "Chauffeur service",
  "Long-term rental",
  "Airport transfer",
  "Corporate account",
  "Other",
];

// Stylised street grid behind the pin: pure vector, so no map SDK or API key.
// The lines run long past the viewBox and are cropped by the SVG viewport.
const ROAD_COLS = [
  -80, 40, 170, 300, 430, 560, 690, 820, 950, 1080, 1210, 1340, 1470, 1600,
];
const ROAD_ROWS = [-60, 70, 200, 330, 460, 590, 720];

export default function Contact({ settings = {} }) {
  const phone = settings.phone || FALLBACK.phone;
  const email = settings.email || FALLBACK.email;
  const address = siteAddress(settings.address);
  const hours = settings.openingHours || FALLBACK.hours;
  const tel = phoneLink(phone);
  const wa = whatsappLink((settings.whatsappNumber || phone).replace(/\D/g, ""));
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const cards = [
    {
      key: "whatsapp",
      label: "Whatsapp",
      value: phone,
      href: wa,
      Icon: WhatsappIcon,
      dark: true,
      external: true,
    },
    { key: "call", label: "Call", value: phone, href: tel, Icon: PhoneIcon },
    { key: "email", label: "Email", value: email, href: `mailto:${email}`, Icon: MailIcon },
  ];

  const details = [
    { label: "Address", value: address, Icon: PinIcon },
    { label: "Opening hours", value: hours, Icon: ClockIcon },
    { label: "Phone & WhatsApp", value: phone, href: tel, Icon: PhoneIcon },
    { label: "Email", value: email, href: `mailto:${email}`, Icon: MailIcon },
  ];

  const socials = [
    { name: "Instagram", href: settings.instagramUrl, Icon: InstagramIcon },
    { name: "Facebook", href: settings.facebookUrl, Icon: FacebookIcon },
    { name: "YouTube", href: settings.youtubeUrl, Icon: YouTubeIcon },
  ];

  // The two date fields are controlled so their "Select date" placeholder can
  // sit on top of the native date input (which has no placeholder of its own).
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  // Set once the enquiry has been emailed to the team (Web3Forms): shows the
  // thank-you, with a WhatsApp button that has the same message typed in.
  const [reply, setReply] = useState(null);
  // "idle" | "sending" | "error" (the email couldn't be sent)
  const [sendState, setSendState] = useState("idle");
  const [fallbackHref, setFallbackHref] = useState(null);

  function openPicker(event) {
    const input = event.currentTarget;
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch {
        /* the browser refused (no user gesture) — the native field still works */
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const text = [
      "Hi Elite Fleet, I'd like to make an enquiry.",
      data.name && `Name: ${data.name}`,
      data.email && `Email: ${data.email}`,
      data.phone && `WhatsApp: ${data.phone}`,
      data.type && `Enquiry type: ${data.type}`,
      data.pickup && `Pickup date: ${data.pickup}`,
      data.dropoff && `Drop-off date: ${data.dropoff}`,
      data.message && `Message: ${data.message}`,
    ]
      .filter(Boolean)
      .join("\n");

    const href = wa ? `${wa}?text=${encodeURIComponent(text)}` : tel;

    setSendState("sending");
    const result = await sendEnquiry({
      subject: `New website enquiry${data.type ? ` — ${data.type}` : ""}`,
      name: data.name || "",
      email: data.email || "",
      fields: {
        "Full name": data.name,
        Email: data.email,
        "WhatsApp phone": data.phone,
        "Enquiry type": data.type,
        "Pickup date": data.pickup,
        "Drop-off date": data.dropoff,
        Message: data.message,
      },
    });
    if (!result.ok) {
      setFallbackHref(href);
      setSendState("error");
      return;
    }
    setSendState("idle");
    setReply({ name: data.name || "", href });
  }

  return (
    <>
      {/* ------------------------------- Hero ------------------------------- */}
      <section className={styles.hero}>
        <Reveal stagger className={styles.heroTop}>
          <div className={styles.heroMain}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              Contact us
            </p>
            <h1 className={styles.title}>
              Let’s get you
              <br />
              on the road.
            </h1>
          </div>
          <p className={styles.heroSub}>
            Questions about a car, a booking or a chauffeur? Call, message or send us a note —
            we’re here from 8:00 AM to 10:00 PM.
          </p>
        </Reveal>

        {/* --------------------------- Quick actions ------------------------ */}
        <Reveal stagger className={styles.cards}>
          {cards.map(({ key, label, value, href, Icon, dark, external }) => (
            <a
              key={key}
              href={href || undefined}
              className={`${styles.card} ${dark ? styles.cardDark : ""}`}
              {...(external && href ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <span className={styles.cardIcon}>
                <Icon size={22} />
              </span>
              <span className={styles.cardArrow}>
                <ArrowUpRightIcon size={18} />
              </span>
              <span className={styles.cardBody}>
                <span className={styles.cardLabel}>{label}</span>
                <span className={styles.cardValue}>{value}</span>
              </span>
            </a>
          ))}
        </Reveal>
      </section>

      {/* --------------------- Details + map + form ------------------------- */}
      <section className={styles.main}>
        <Reveal stagger className={styles.mainGrid}>
          {/* ------------------- Visit or reach us ------------------- */}
          <div className={styles.details}>
            <h2 className={styles.detailsTitle}>Visit or reach us</h2>
            <div className={styles.detailList}>
              {details.map(({ label, value, href, Icon }) => (
                <div key={label} className={styles.detail}>
                  <span className={styles.detailIcon}>
                    <Icon size={18} />
                  </span>
                  <span className={styles.detailText}>
                    <span className={styles.detailLabel}>{label}</span>
                    {href ? (
                      <a className={styles.detailValue} href={href}>
                        {value}
                      </a>
                    ) : (
                      <span className={styles.detailValue}>{value}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.social}>
              {socials.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href || undefined}
                  className={styles.socialBox}
                  aria-label={name}
                  {...(href ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ---------------------- Send us a message --------------------- */}
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Send us a message</h2>
            <p className={styles.formNote}>
              For bookings, include your preferred car and dates.
            </p>

            {reply ? (
              <div className={styles.sent} role="status">
                <h3 className={styles.sentTitle}>
                  Thanks{reply.name ? `, ${reply.name.split(" ")[0]}` : ""} — your message has
                  been sent.
                </h3>
                <p className={styles.sentText}>
                  We’ll get back to you soon — every day from 8:00 AM to 10:00 PM. Want a quicker
                  reply? Send the same message on WhatsApp.
                </p>
                <div className={styles.sentActions}>
                  <a
                    href={reply.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.sentPrimary}
                  >
                    Chat on WhatsApp <ArrowUpRightIcon size={16} />
                  </a>
                  <button
                    type="button"
                    className={styles.sentSecondary}
                    onClick={() => setReply(null)}
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="contact-name">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="contact-phone">
                    WhatsApp Phone
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+971 50 000 0000"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="contact-type">
                    Enquiry Type
                  </label>
                  <div className={styles.control}>
                    <select
                      id="contact-type"
                      name="type"
                      defaultValue={ENQUIRY_TYPES[0]}
                      className={`${styles.input} ${styles.select}`}
                    >
                      {ENQUIRY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon size={16} className={styles.controlIcon} />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="contact-pickup">
                    Pickup Date
                  </label>
                  <div className={styles.control}>
                    <CalendarIcon size={16} className={styles.controlIconLeft} />
                    <input
                      id="contact-pickup"
                      name="pickup"
                      type="date"
                      value={pickup}
                      onChange={(event) => setPickup(event.target.value)}
                      onClick={openPicker}
                      className={`${styles.input} ${styles.date} ${
                        pickup ? "" : styles.inputBlank
                      }`}
                    />
                    {!pickup && <span className={styles.datePlaceholder}>Select date</span>}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="contact-dropoff">
                    Drop-off Date
                  </label>
                  <div className={styles.control}>
                    <CalendarIcon size={16} className={styles.controlIconLeft} />
                    <input
                      id="contact-dropoff"
                      name="dropoff"
                      type="date"
                      value={dropoff}
                      onChange={(event) => setDropoff(event.target.value)}
                      onClick={openPicker}
                      className={`${styles.input} ${styles.date} ${
                        dropoff ? "" : styles.inputBlank
                      }`}
                    />
                    {!dropoff && <span className={styles.datePlaceholder}>Select date</span>}
                  </div>
                </div>

                <div className={`${styles.field} ${styles.fieldWide}`}>
                  <label className={styles.label} htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Tell us what you need..."
                    className={`${styles.input} ${styles.textarea}`}
                  />
                </div>

                <button type="submit" className={styles.submit} disabled={sendState === "sending"}>
                  {sendState === "sending" ? (
                    "Sending…"
                  ) : (
                    <>
                      Send Message <ArrowRightIcon size={16} />
                    </>
                  )}
                </button>

                {sendState === "error" && (
                  <p className={styles.sendError} role="alert">
                    Sorry, your message couldn’t be sent. Please try again or{" "}
                    <a href={fallbackHref} target="_blank" rel="noreferrer">
                      send it on WhatsApp
                    </a>
                    .
                  </p>
                )}
              </form>
            )}
          </div>

          {/* --------------------------- Map banner ------------------------- */}
          <div className={styles.mapWrap}>
            <div className={styles.map} aria-hidden="true">
              <svg
                className={styles.mapSvg}
                viewBox="0 0 1440 520"
                preserveAspectRatio="xMidYMid slice"
              >
                <rect className={styles.mapBg} x="0" y="0" width="1440" height="520" />
                <g className={styles.mapRoads} transform="rotate(-16 720 260)">
                  {ROAD_COLS.map((x, i) => (
                    <line
                      key={`c${x}`}
                      x1={x}
                      y1={-420}
                      x2={x}
                      y2={940}
                      strokeWidth={i % 4 === 0 ? 16 : 7}
                    />
                  ))}
                  {ROAD_ROWS.map((y, i) => (
                    <line
                      key={`r${y}`}
                      x1={-520}
                      y1={y}
                      x2={1960}
                      y2={y}
                      strokeWidth={i % 3 === 0 ? 14 : 7}
                    />
                  ))}
                </g>
                <path
                  className={styles.mapRoads}
                  strokeWidth="12"
                  d="M-120 470 C 240 430 430 340 720 355 C 1010 370 1240 445 1560 410"
                />
                <path
                  className={styles.mapRoads}
                  strokeWidth="7"
                  d="M-120 545 C 300 505 470 415 760 430 C 1050 445 1270 515 1560 480"
                />
              </svg>
              <span className={styles.mapPin}>
                <PinIcon size={22} />
              </span>
            </div>

            <div className={styles.mapCard}>
              <p className={styles.mapEyebrow}>Elite Fleet</p>
              <p className={styles.mapAddress}>{address}</p>
              <p className={styles.mapHours}>Open {hours}</p>
              <a
                className={styles.mapLink}
                href={directions}
                target="_blank"
                rel="noreferrer"
              >
                Get directions <ArrowUpRightIcon size={16} />
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

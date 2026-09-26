"use client";

import { useState, useSyncExternalStore } from "react";
import Logo from "./Logo";
import { WhatsappIcon, MenuIcon, CloseIcon, ArrowRightIcon } from "./icons/Icons";
import { useBooking } from "@/context/BookingContext";
import { whatsappLink } from "@/lib/format";
import styles from "./Navbar.module.css";

const LINKS = [
  { label: "Home", href: "#top", active: true },
  { label: "Fleet", href: "#fleet" },
  { label: "Luxury", href: "#fleet", category: "Luxury" },
  { label: "SUV", href: "#fleet", category: "SUV" },
  { label: "Sports", href: "#fleet", category: "Sports" },
  { label: "About", href: "#about" },
  { label: "Chauffeur", href: "#contact" },
  { label: "Contact", href: "#contact" },
];

// True once the page is scrolled more than 80px (always false while pre-building on the server)
function subscribeToScroll(callback) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}
function useScrolledPast(px) {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > px,
    () => false
  );
}

export default function Navbar({ settings = {} }) {
  const scrolled = useScrolledPast(80);
  const [open, setOpen] = useState(false);
  const { setCategory } = useBooking();
  const whatsapp = whatsappLink(settings.whatsappNumber);

  function handleNavClick(link) {
    if (link.category) setCategory(link.category);
    setOpen(false);
  }

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.navbarSolid : ""}`}>
      <div className={styles.inner}>
        <a
          href="#top"
          className={styles.logoLink}
          aria-label="Elite Fleet home"
          onClick={() => handleNavClick({})}
        >
          <Logo height={44} />
        </a>

        <nav className={styles.links} aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`${styles.link} ${link.active ? styles.linkActive : ""}`}
              onClick={() => handleNavClick(link)}
            >
              {link.label}
              <span className={styles.dot} />
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className={styles.iconButton}
              aria-label="Chat on WhatsApp"
            >
              <WhatsappIcon />
            </a>
          )}
          <a href="#fleet" className={styles.bookButton} onClick={() => handleNavClick({})}>
            Book Now
          </a>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}>
        <div className={styles.overlayTop}>
          <Logo height={40} />
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.overlayLinks}>
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`${styles.overlayLink} ${link.active ? styles.overlayLinkActive : ""}`}
              onClick={() => handleNavClick(link)}
            >
              {link.label}
              <ArrowRightIcon size={18} />
            </a>
          ))}
        </div>

        <div className={styles.overlaySpacer} />

        <div className={styles.overlayActions}>
          <a href="#fleet" className={styles.overlayBook} onClick={() => handleNavClick({})}>
            Book Now <ArrowRightIcon size={18} />
          </a>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noreferrer" className={styles.overlayWhatsapp}>
              WhatsApp&nbsp;&nbsp;{settings.phone}
            </a>
          )}
          <p className={styles.overlayMeta}>
            {[settings.email, settings.openingHours].filter(Boolean).join("  ·  ")}
          </p>
        </div>
      </div>
    </header>
  );
}

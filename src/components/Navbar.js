"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { WhatsappIcon, MenuIcon, CloseIcon, ArrowRightIcon } from "./icons/Icons";
import { useBooking } from "@/context/BookingContext";
import { whatsappLink } from "@/lib/format";
import { LINKS as ROUTES } from "@/lib/links";
import styles from "./Navbar.module.css";

// isActive: which page makes this link show as the current one
const LINKS = [
  { label: "Home", href: ROUTES.home, isActive: (path) => path === "/" },
  { label: "Fleet", href: ROUTES.fleetSection, isActive: (path) => path.startsWith("/fleet") },
  { label: "Luxury", href: ROUTES.fleetSection, category: "Luxury" },
  { label: "SUV", href: ROUTES.fleetSection, category: "SUV" },
  { label: "Sports", href: ROUTES.fleetSection, category: "Sports" },
  { label: "About", href: ROUTES.about },
  { label: "Chauffeur", href: ROUTES.chauffeur, isActive: (path) => path.startsWith("/chauffeur") },
  { label: "Contact", href: ROUTES.contact },
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
  const pathname = usePathname() ?? "/";

  function handleNavClick(link) {
    if (link.category) setCategory(link.category);
    setOpen(false);
  }

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.navbarSolid : ""}`}>
      <div className={styles.inner}>
        <Link
          href={ROUTES.home}
          className={styles.logoLink}
          aria-label="Elite Fleet home"
          onClick={() => handleNavClick({})}
        >
          <Logo height={44} />
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`${styles.link} ${link.isActive?.(pathname) ? styles.linkActive : ""}`}
              onClick={() => handleNavClick(link)}
            >
              {link.label}
              <span className={styles.dot} />
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle className={styles.iconButton} />
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
          <Link href={ROUTES.booking} className={styles.bookButton} onClick={() => handleNavClick({})}>
            Book Now
          </Link>
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
            <Link
              key={link.label}
              href={link.href}
              className={`${styles.overlayLink} ${link.isActive?.(pathname) ? styles.overlayLinkActive : ""}`}
              onClick={() => handleNavClick(link)}
            >
              {link.label}
              <ArrowRightIcon size={18} />
            </Link>
          ))}
        </div>

        <div className={styles.overlaySpacer} />

        <div className={styles.overlayActions}>
          <Link href={ROUTES.booking} className={`${styles.overlayBook} shimmer`} onClick={() => handleNavClick({})}>
            Book Now <ArrowRightIcon size={18} />
          </Link>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noreferrer" className={styles.overlayWhatsapp}>
              WhatsApp&nbsp;&nbsp;{settings.phone}
            </a>
          )}
          <ThemeToggle variant="row" className={styles.overlayTheme} />
          <p className={styles.overlayMeta}>
            {[settings.email, settings.openingHours].filter(Boolean).join("  ·  ")}
          </p>
        </div>
      </div>
    </header>
  );
}

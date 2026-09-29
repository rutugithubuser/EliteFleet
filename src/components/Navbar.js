"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { WhatsappIcon, MenuIcon, CloseIcon, ArrowRightIcon } from "./icons/Icons";
import { whatsappLink } from "@/lib/format";
import { LINKS as ROUTES } from "@/lib/links";
import styles from "./Navbar.module.css";

// isActive: does this link match the current URL? It gets one state object —
// { pathname, category, hash } — where `category` is the (lowercased)
// ?category= filter and `hash` the homepage section (#about / #contact).
// Exactly one link matches at a time; that's the one under the gold dot.
const NAV_CATEGORIES = ["luxury", "suv", "sports"];
const HOME_SECTION_HASHES = ["#about", "#contact"];

// Category links win only on /fleet itself, with their own filter in the URL.
// (?category=exotic and friends have no navbar link, so "Fleet" stays lit.)
function isCategoryActive(slug) {
  return ({ pathname, category }) => pathname === "/fleet" && category === slug;
}

const LINKS = [
  {
    label: "Home",
    href: ROUTES.home,
    isActive: ({ pathname, hash }) => pathname === "/" && !HOME_SECTION_HASHES.includes(hash),
  },
  {
    label: "Fleet",
    href: ROUTES.fleet,
    isActive: ({ pathname, category }) =>
      pathname.startsWith("/fleet") &&
      !(pathname === "/fleet" && NAV_CATEGORIES.includes(category)),
  },
  { label: "Luxury", href: ROUTES.fleetCategory("luxury"), isActive: isCategoryActive("luxury") },
  { label: "SUV", href: ROUTES.fleetCategory("suv"), isActive: isCategoryActive("suv") },
  { label: "Sports", href: ROUTES.fleetCategory("sports"), isActive: isCategoryActive("sports") },
  {
    label: "About",
    href: ROUTES.about,
    // The real /about page, or the homepage #about section (legacy links).
    isActive: ({ pathname, hash }) =>
      pathname === "/about" || (pathname === "/" && hash === "#about"),
  },
  {
    label: "Chauffeur",
    href: ROUTES.chauffeur,
    isActive: ({ pathname }) => pathname.startsWith("/chauffeur"),
  },
  {
    label: "Contact",
    href: ROUTES.contact,
    // The real /contact page, or the homepage footer section (legacy links).
    isActive: ({ pathname, hash }) =>
      pathname === "/contact" || (pathname === "/" && hash === "#contact"),
  },
];

// --- URL tracking for the category filter and section hashes ---------------
// The pathname comes from usePathname(), but Next has no hook for ?category=
// or the #hash without useSearchParams(), which would push the whole navbar
// behind a <Suspense> boundary (see "useSearchParams → Prerendering" in
// node_modules/next/dist/docs). Instead we watch the one thing every
// client-side navigation goes through — the public history API (Next calls
// history.pushState / replaceState on each navigation, verified) — plus
// popstate/hashchange for back/forward and plain hash links. The hooks return
// plain strings, so React bails out when a notification changes nothing.
const urlListeners = new Set();
let unpatchHistory = null;

function notifyUrlListeners() {
  for (const listener of urlListeners) listener();
}

function subscribeToUrl(listener) {
  urlListeners.add(listener);
  if (!unpatchHistory) {
    const { pushState, replaceState } = window.history;
    const onHistoryChange = () => notifyUrlListeners();

    window.history.pushState = function patchedPushState(...args) {
      const result = pushState.apply(this, args);
      onHistoryChange();
      return result;
    };
    window.history.replaceState = function patchedReplaceState(...args) {
      const result = replaceState.apply(this, args);
      onHistoryChange();
      return result;
    };
    window.addEventListener("popstate", onHistoryChange);
    window.addEventListener("hashchange", onHistoryChange);

    unpatchHistory = () => {
      window.history.pushState = pushState;
      window.history.replaceState = replaceState;
      window.removeEventListener("popstate", onHistoryChange);
      window.removeEventListener("hashchange", onHistoryChange);
      unpatchHistory = null;
    };
  }
  return () => {
    urlListeners.delete(listener);
    if (urlListeners.size === 0 && unpatchHistory) unpatchHistory();
  };
}

// "" while pre-building/hydrating (so the markup matches the server HTML),
// the live value afterwards — same pattern as useScrolledPast below.
function useUrlSearch() {
  return useSyncExternalStore(subscribeToUrl, () => window.location.search, () => "");
}
function useUrlHash() {
  return useSyncExternalStore(subscribeToUrl, () => window.location.hash, () => "");
}

// Pages whose top section is a dark photo: the see-through navbar uses white text there
const DARK_HERO_PAGES = ["/chauffeur"];

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
  const whatsapp = whatsappLink(settings.whatsappNumber);
  const pathname = usePathname() ?? "/";
  const search = useUrlSearch();
  const hash = useUrlHash();
  // Lowercased like the fleet page's own param reader, so "?category=Luxury"
  // and Sanity's lowercase slugs agree.
  const category = new URLSearchParams(search).get("category")?.toLowerCase() ?? null;
  const activeState = { pathname, category, hash };
  const onDarkHero = !scrolled && DARK_HERO_PAGES.some((page) => pathname.startsWith(page));

  return (
    <header
      className={`${styles.navbar} ${scrolled ? styles.navbarSolid : ""} ${onDarkHero ? styles.navbarOnDark : ""}`}
    >
      <div className={styles.inner}>
        <Link
          href={ROUTES.home}
          className={styles.logoLink}
          aria-label="Elite Fleet home"
          onClick={() => setOpen(false)}
        >
          <Logo height={44} />
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {LINKS.map((link) => {
            const active = link.isActive(activeState);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`${styles.link} ${active ? styles.linkActive : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
                <span className={styles.dot} />
              </Link>
            );
          })}
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
          <Link href={ROUTES.booking} className={styles.bookButton} onClick={() => setOpen(false)}>
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
          <Link
            href={ROUTES.home}
            aria-label="Elite Fleet home"
            onClick={() => setOpen(false)}
          >
            <Logo height={40} />
          </Link>
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
          {LINKS.map((link) => {
            const active = link.isActive(activeState);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`${styles.overlayLink} ${active ? styles.overlayLinkActive : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
                <ArrowRightIcon size={18} />
              </Link>
            );
          })}
        </div>

        <div className={styles.overlaySpacer} />

        <div className={styles.overlayActions}>
          <Link href={ROUTES.booking} className={`${styles.overlayBook} shimmer`} onClick={() => setOpen(false)}>
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

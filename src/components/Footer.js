import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import CategoryLink from "./CategoryLink";
import { phoneLink } from "@/lib/format";
import { LINKS } from "@/lib/links";
import styles from "./Footer.module.css";

const EXPLORE = [
  { label: "Home", href: LINKS.home },
  { label: "Fleet", href: LINKS.fleetSection },
  { label: "About", href: LINKS.about },
  { label: "Chauffeur", href: LINKS.chauffeur },
  { label: "Contact", href: LINKS.contact },
];

export default function Footer({ settings = {}, categories = [], legalPages = [] }) {
  // Only show social icons that have a link filled in, in Site Settings
  const socials = [
    { name: "Instagram", href: settings.instagramUrl, icon: "/icons/instagram.png" },
    { name: "Facebook", href: settings.facebookUrl, icon: "/icons/facebook.png" },
    { name: "YouTube", href: settings.youtubeUrl, icon: "/icons/youtube.png" },
  ].filter((s) => s.href);

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.top}>
        <div className={styles.brand}>
          <Logo height={40} />
          <p className={styles.tagline}>
            Elite Fleet makes renting a car in Dubai simple, fast and reliable — from everyday
            comfort to extraordinary performance.
          </p>
          {socials.length > 0 && (
            <div className={styles.social}>
              {socials.map((s) => (
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  key={s.name}
                  className={styles.socialIcon}
                >
                  <Image src={s.icon} alt="" width={16} height={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>Explore</p>
          {EXPLORE.map((item) => (
            <Link href={item.href} key={item.label} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>Fleet</p>
          {categories.map((cat) => (
            <CategoryLink key={cat._id} category={cat.name} className={styles.link}>
              {cat.name}
            </CategoryLink>
          ))}
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>Contact</p>
          {settings.phone && (
            <a href={phoneLink(settings.phone)} className={styles.contactLine}>
              <Image src="/icons/phone.png" alt="" width={16} height={16} />
              {settings.phone}
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className={styles.contactLine}>
              <Image src="/icons/mail.png" alt="" width={16} height={16} />
              {settings.email}
            </a>
          )}
          {settings.address && (
            <p className={styles.contactLine}>
              <Image src="/icons/pin.png" alt="" width={16} height={16} />
              {settings.address}
            </p>
          )}
          {settings.openingHours && (
            <p className={styles.contactLine}>
              <Image src="/icons/clock.png" alt="" width={16} height={16} />
              {settings.openingHours}
            </p>
          )}
        </div>
      </div>

      <div className={styles.watermark} aria-hidden="true">
        ELITE FLEET
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Elite Fleet. All rights reserved.</p>
        {/* Pages added in Studio → Legal pages (Privacy Policy, Terms, FAQ...) */}
        {legalPages.length > 0 && (
          <div className={styles.bottomLinks}>
            {legalPages.map((page) => (
              <Link href={LINKS.legal(page.slug)} key={page._id}>
                {page.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}

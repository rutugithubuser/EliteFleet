import Image from "next/image";
import Logo from "./Logo";
import CategoryLink from "./CategoryLink";
import { phoneLink } from "@/lib/format";
import styles from "./Footer.module.css";

const EXPLORE = [
  { label: "Home", href: "#top" },
  { label: "Fleet", href: "#fleet" },
  { label: "About", href: "#about" },
  { label: "Chauffeur", href: "#contact" },
  { label: "Contact", href: "#contact" },
];

export default function Footer({ settings = {}, categories = [] }) {
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
            <a href={item.href} key={item.label} className={styles.link}>
              {item.label}
            </a>
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
        <div className={styles.bottomLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms &amp; Conditions</a>
          <a href="#">FAQ</a>
        </div>
      </div>
    </footer>
  );
}

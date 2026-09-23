import Image from "next/image";
import Logo from "./Logo";
import styles from "./Footer.module.css";

const EXPLORE = [
  { label: "Home", href: "#top" },
  { label: "Fleet", href: "#fleet" },
  { label: "About", href: "#about" },
  { label: "Chauffeur", href: "#contact" },
  { label: "Contact", href: "#contact" },
];

const FLEET_LINKS = [
  { label: "Luxury", href: "#fleet" },
  { label: "SUV", href: "#fleet" },
  { label: "Sports", href: "#fleet" },
  { label: "Exotic", href: "#fleet" },
  { label: "Economy", href: "#fleet" },
];

const SOCIALS = [
  { name: "Instagram", href: "#", icon: "/icons/instagram.png" },
  { name: "Facebook", href: "#", icon: "/icons/facebook.png" },
  { name: "YouTube", href: "#", icon: "/icons/youtube.png" },
];

export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.top}>
        <div className={styles.brand}>
          <Logo height={40} />
          <p className={styles.tagline}>
            Elite Fleet makes renting a car in Dubai simple, fast and reliable — from everyday
            comfort to extraordinary performance.
          </p>
          <div className={styles.social}>
            {SOCIALS.map((s) => (
              <a href={s.href} aria-label={s.name} key={s.name} className={styles.socialIcon}>
                <Image src={s.icon} alt="" width={16} height={16} />
              </a>
            ))}
          </div>
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
          {FLEET_LINKS.map((item) => (
            <a href={item.href} key={item.label} className={styles.link}>
              {item.label}
            </a>
          ))}
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>Contact</p>
          <p className={styles.contactLine}>
            <Image src="/icons/phone.png" alt="" width={16} height={16} />
            +971 58 521 0105
          </p>
          <p className={styles.contactLine}>
            <Image src="/icons/mail.png" alt="" width={16} height={16} />
            hi@elitefleet.ae
          </p>
          <p className={styles.contactLine}>
            <Image src="/icons/pin.png" alt="" width={16} height={16} />
            Al Tayer Warehouses, Al Quoz Industrial First, UAE
          </p>
          <p className={styles.contactLine}>
            <Image src="/icons/clock.png" alt="" width={16} height={16} />
            8:00 AM – 10:00 PM
          </p>
        </div>
      </div>

      <div className={styles.watermark} aria-hidden="true">
        ELITE FLEET
      </div>

      <div className={styles.bottom}>
        <p>© 2026 Elite Fleet. All rights reserved.</p>
        <div className={styles.bottomLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms &amp; Conditions</a>
          <a href="#">FAQ</a>
        </div>
      </div>
    </footer>
  );
}

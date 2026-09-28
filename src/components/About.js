import Image from "next/image";
import Link from "next/link";
import { LINKS } from "@/lib/links";
import Reveal from "./Reveal";
import MaskText from "./MaskText";
import { ArrowRightIcon } from "./icons/Icons";
import styles from "./About.module.css";

const PILL_TAGS = [
  "Daily, weekly & monthly rentals",
  "Luxury car rentals",
  "Business class rentals",
  "Airport pickups",
  "Chauffeur services",
];

const FEATURES = [
  {
    num: "01",
    title: "Wide Range of Cars",
    copy: "From economy to luxury — SUVs, sports cars and prestige sedans.",
  },
  {
    num: "02",
    title: "Clear Rates, No Hidden Charges",
    copy: "Transparent daily pricing, so you always know what you pay.",
  },
  {
    num: "03",
    title: "Insurance & Safety Coverage",
    copy: "Insurance and safety coverage included, with optional upgrades.",
  },
  {
    num: "04",
    title: "Flexible Rentals & Delivery",
    copy: "Daily, weekly and monthly rentals, delivered across Dubai or ready for self-pickup.",
  },
];

const BRANDS = [
  "Rolls-Royce",
  "Lamborghini",
  "Bentley",
  "Ferrari",
  "Mercedes-Benz",
  "BMW",
  "Land Rover",
  "Cadillac",
  "GMC",
  "Audi",
  "Toyota",
  "Nissan",
];

export default function About() {
  return (
    <>
      {/* ------------------------------- Hero ------------------------------- */}
      <section className={styles.hero}>
        <Reveal stagger className={styles.heroRow}>
          <div className={styles.heroMain}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              About Elite Fleet
            </p>
            <h1 className={styles.title}>
              Redefining premium
              <br />
              <em>car rental</em> in Dubai.
            </h1>
          </div>
          <p className={styles.subtitle}>
            Premium cars at affordable prices, with reliable rides from the first message to the
            final mile.
          </p>
        </Reveal>
      </section>

      {/* --------------------------- Showroom banner ------------------------ */}
      <div className={styles.banner}>
        <Image
          src="/images/about/showroom.png"
          alt="A Rolls-Royce parked in the Elite Fleet showroom"
          fill
          priority
          sizes="100vw"
          className={styles.bannerImg}
        />
      </div>

      {/* ----------------------------- Who we are --------------------------- */}
      <section className={styles.who}>
        <Reveal stagger className={styles.whoInner}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            Who We Are
          </p>
          <div className={styles.whoGrid}>
            <h2 className={styles.whoTitle}>
              <MaskText lines={["Simple, fast", "and reliable."]} />
            </h2>
            <div className={styles.whoBody}>
              <p className={styles.whoCopy}>
                Elite Fleet makes renting a car in Dubai simple, fast and reliable. We offer a
                broad selection of well-maintained vehicles at competitive rates — from everyday
                comfort to Rolls-Royce, Lamborghini and Range Rover.
              </p>
              <p className={styles.whoCopy}>
                Our services cover daily usage, weekend trips, airport transfers and extended
                rentals, with transparent pricing, convenient delivery and dependable mobility
                across Dubai.
              </p>
              <ul className={styles.pills}>
                {PILL_TAGS.map((tag) => (
                  <li key={tag} className={styles.pill}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------ Mission ----------------------------- */}
      <section className={styles.mission}>
        <Reveal stagger className={styles.missionInner}>
          <p className={`${styles.eyebrow} ${styles.eyebrowGold}`}>
            — OUR MISSION —
          </p>
          <p className={styles.quote}>
            To make every rental in<br className="inline md:hidden" /> Dubai effortless —
            <br className="hidden md:inline" /> premium<br className="inline md:hidden" /> cars, transparent pricing
            <br className="inline md:hidden" /> and<br className="hidden md:inline" /> dependable service, for
            <br className="inline md:hidden" /> every kind of journey.
          </p>
        </Reveal>
      </section>

      {/* --------------------- Why choose us + gallery ---------------------- */}
      <section className={styles.standard}>
        <Reveal stagger className={styles.standardInner}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            Why Choose Us
          </p>
          <h2 className={styles.standardTitle}>
            <MaskText lines="The Elite Fleet Standard" />
          </h2>
          <div className={styles.features}>
            {FEATURES.map((feature) => (
              <article key={feature.num} className={styles.feature}>
                <h3 className={styles.featureTitle}>
                  <span className={styles.featureNum}>{feature.num}</span>
                  {feature.title}
                </h3>
                <p className={styles.featureCopy}>{feature.copy}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal stagger className={styles.gallery}>
          <div className={styles.galleryGrid}>
            <div className={`${styles.galleryCell} ${styles.galleryTall}`}>
              <Image
                src="/images/about/spectre.png"
                alt="Teal Rolls-Royce Spectre on display"
                width={640}
                height={560}
                sizes="(min-width: 900px) 640px, 100vw"
                className={styles.galleryImg}
              />
            </div>
            <div className={styles.galleryCell}>
              <Image
                src="/images/about/bmw-m4.png"
                alt="Blue BMW M4 in front of a mural"
                width={648}
                height={268}
                sizes="(min-width: 900px) 648px, 100vw"
                className={styles.galleryImg}
              />
            </div>
            <div className={styles.galleryCell}>
              <Image
                src="/images/about/escalade.png"
                alt="Black Cadillac Escalade at night"
                width={648}
                height={268}
                sizes="(min-width: 900px) 648px, 100vw"
                className={styles.galleryImg}
              />
            </div>
          </div>
          <div className={styles.brandsContainer}>
            <div className={styles.brandsList}>
              {BRANDS.map((brand, i) => (
                <span key={brand} className={styles.brandItem}>
                  <span className={styles.brandName}>{brand}</span>
                  {i < BRANDS.length - 1 && <span className={styles.brandDot}>·</span>}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------- Closing CTA --------------------------- */}
      <section className={styles.cta}>
        <Reveal stagger className={styles.ctaRow}>
          <div className={styles.ctaText}>
            <h2 className={styles.ctaTitle}>
              <MaskText lines="Ready to Drive?" />
            </h2>
            <p className={styles.ctaCopy}>Choose your car and start your Dubai journey.</p>
          </div>
          <div className={styles.ctas}>
            <Link href={LINKS.fleet} className={styles.exploreBtn}>
              Explore Fleet
            </Link>
            <Link href={LINKS.booking} className={`${styles.bookBtn} shimmer`}>
              Book Now
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

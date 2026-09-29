import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, SeatsIcon } from "../icons/Icons";
import { LINKS } from "@/lib/links";
import SanityImage from "../SanityImage";
import Parallax from "../Parallax";
import Reveal from "../Reveal";
import SectionHeading from "./SectionHeading";
import styles from "./ChauffeurFleet.module.css";

export default function ChauffeurFleet({ image, cars }) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Reveal className={styles.imageWrap}>
          <Parallax>
            {image?.asset ? (
              <SanityImage image={image} alt={image.alt || "Rolls-Royce Dawn at dusk"} sizes="(max-width: 900px) 100vw, 40vw" className={styles.image} />
            ) : (
              <Image
                src="/images/chauffeur-fleet.jpg"
                alt="Rolls-Royce Dawn convertible outside a villa at dusk"
                fill
                sizes="(max-width: 900px) 100vw, 40vw"
                className={styles.image}
              />
            )}
          </Parallax>
        </Reveal>

        <div className={styles.content}>
          <Reveal className={styles.desktopIntro}>
            <SectionHeading
              eyebrow="Chauffeur-Ready Fleet"
              title={["Choose the car.", "We'll handle the drive."]}
              subtitle="Pair a chauffeur with selected vehicles from the Elite Fleet collection — from the Rolls-Royce Phantom for a grand arrival to spacious SUVs for groups and luggage."
              className={styles.heading}
            />
          </Reveal>
          {/* Phones show a short title instead (as in the mobile design) */}
          <h2 className={styles.mobileTitle}>Chauffeur-ready fleet</h2>

          {cars.length > 0 && (
            <Reveal as="ul" stagger delay={0.1} className={styles.list}>
              {cars.map((car) => {
                const details = (
                  <>
                    <span className={styles.name}>
                      {car.name}
                      {car.slug && <ArrowRightIcon size={16} className={styles.arrow} aria-hidden="true" />}
                    </span>
                    {car.seats && (
                      <span className={styles.seats}>
                        <SeatsIcon className={styles.seatsIcon} aria-hidden="true" />
                        {car.seats} seats
                      </span>
                    )}
                  </>
                );
                return (
                  <li key={car._id}>
                    {/* Each car opens its details page */}
                    {car.slug ? (
                      <Link href={LINKS.car(car.slug)} className={`${styles.row} ${styles.rowLink}`}>
                        {details}
                      </Link>
                    ) : (
                      <div className={styles.row}>{details}</div>
                    )}
                  </li>
                );
              })}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

import { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "../icons/Icons";
import SanityImage from "../SanityImage";
import Parallax from "../Parallax";
import Reveal from "../Reveal";
import MaskText from "../MaskText";
import { whatsappLink } from "@/lib/format";
import styles from "./ChauffeurHero.module.css";

// Until a hero photo is uploaded in Studio: the two crops from the Figma design,
// a wide one for desktop and a taller one for phones and tablets.
function FallbackPhoto() {
  const common = { alt: "Black Rolls-Royce Phantom ready for a chauffeur-driven trip", fill: true };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/images/chauffeur-hero.jpg", sizes: "55vw" });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: "/images/chauffeur-hero-mobile.jpg", sizes: "100vw" });
  return (
    <picture>
      <source media="(min-width: 901px)" srcSet={desktop} sizes="55vw" />
      <source media="(max-width: 900px)" srcSet={mobile} sizes="100vw" />
      {/* The alt text comes from getImageProps above */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...rest} loading="eager" fetchPriority="high" className={styles.image} />
    </picture>
  );
}

export default function ChauffeurHero({ image, settings = {} }) {
  const whatsapp = whatsappLink(settings.whatsappNumber);

  return (
    <section className={styles.hero}>
      <div className={styles.imageWrap}>
        <Parallax strength={0.025} className={styles.parallax}>
          {image?.asset ? (
            <SanityImage image={image} alt={image.alt || "Chauffeur-driven luxury car"} sizes="(max-width: 900px) 100vw, 55vw" eager className={styles.image} />
          ) : (
            <FallbackPhoto />
          )}
        </Parallax>
        <div className={styles.fade} />
      </div>

      <Reveal stagger className={styles.content}>
        <p className={styles.eyebrow}>
          <span className={styles.rule} />
          Chauffeur Service
        </p>
        <h1 className={styles.title}>
          <MaskText lines={["Arrive", <em key="accent">in Style.</em>]} />
        </h1>
        <p className={styles.copy}>
          Chauffeur-driven luxury across Dubai — for airport arrivals, business schedules and the
          moments that matter.
        </p>
        <div className={styles.ctas}>
          <Link href="#request" className={`${styles.primary} shimmer`}>
            Request Chauffeur Service <ArrowRightIcon size={18} />
          </Link>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noreferrer" className={styles.secondary}>
              WhatsApp Us
            </a>
          )}
        </div>
      </Reveal>
    </section>
  );
}

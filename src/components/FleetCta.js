import { ArrowRightIcon } from "./icons/Icons";
import Reveal from "./Reveal";
import { whatsappLink } from "@/lib/format";
import styles from "./FleetCta.module.css";

// Dark banner above the footer on the Fleet page: one last push to WhatsApp
export default function FleetCta({ settings = {} }) {
  const whatsapp = whatsappLink(settings.whatsappNumber);

  return (
    <section className={styles.section}>
      <Reveal className={styles.inner}>
        <div>
          <h2 className={styles.title}>Can&rsquo;t find the right car?</h2>
          <p className={styles.text}>
            Tell us your dates and what you need — our team will help you choose.
          </p>
        </div>
        {whatsapp && (
          <a href={whatsapp} target="_blank" rel="noreferrer" className={styles.button}>
            Chat on WhatsApp <ArrowRightIcon size={16} />
          </a>
        )}
      </Reveal>
    </section>
  );
}

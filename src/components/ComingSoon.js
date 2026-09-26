import Link from "next/link";
import { ArrowRightIcon, WhatsappIcon } from "./icons/Icons";
import Reveal from "./Reveal";
import { whatsappLink } from "@/lib/format";
import { LINKS } from "@/lib/links";
import styles from "./ComingSoon.module.css";

// Placeholder for pages whose Figma design isn't built yet.
// Visitors can still go back home or book on WhatsApp, so no button is a dead end.
export default function ComingSoon({ eyebrow = "Coming soon", title, text, settings = {}, children }) {
  const whatsapp = whatsappLink(settings.whatsappNumber);

  return (
    <section className={styles.section}>
      <Reveal stagger className={styles.inner}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        {text && <p className={styles.text}>{text}</p>}
        {children}
        <div className={styles.actions}>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noreferrer" className={styles.primary}>
              <WhatsappIcon size={18} /> Book on WhatsApp
            </a>
          )}
          <Link href={LINKS.home} className={styles.secondary}>
            Back to homepage <ArrowRightIcon size={16} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

import Image from "next/image";
import { whatsappLink } from "@/lib/format";
import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    num: "01",
    title: "Choose Your Car",
    copy: "Browse the fleet and pick the car that suits your trip.",
  },
  {
    num: "02",
    title: "Send Your Details",
    copy: "Share your dates, pickup location and contact details — online or on WhatsApp.",
  },
  {
    num: "03",
    title: "Confirm Your Booking",
    copy: "Our team confirms availability and your rate before anything is final.",
  },
  {
    num: "04",
    title: "Enjoy Your Drive",
    copy: "Collect your car or have it delivered, and enjoy the road.",
  },
];

export default function HowItWorks({ settings = {} }) {
  const whatsapp = whatsappLink(settings.whatsappNumber);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>How It Works</p>
        <h2 className={styles.heading}>Booked in Four Simple Steps</h2>
        <p className={styles.sub}>From choosing your car to picking up the keys — quick, clear and personal.</p>
      </div>

      <ol className={styles.steps}>
        {STEPS.map((step) => (
          <li className={styles.step} key={step.num}>
            <span className={styles.dot}>{step.num}</span>
            <p className={styles.title}>{step.title}</p>
            <p className={styles.copy}>{step.copy}</p>
          </li>
        ))}
      </ol>

      {whatsapp && (
        <a href={whatsapp} target="_blank" rel="noreferrer" className={styles.whatsappPill}>
          <Image src="/icons/phone.png" alt="" width={16} height={16} />
          Prefer to chat? Book directly on WhatsApp <strong>{settings.phone}</strong>
        </a>
      )}
    </section>
  );
}

import Image from "next/image";
import styles from "./Trust.module.css";
import Reveal from "./Reveal";

const ITEMS = [
  {
    icon: "/icons/trust-diamond.svg",
    title: "Premium Fleet",
    copy: "Rolls-Royce, Range Rover, BMW & more",
  },
  {
    icon: "/icons/trust-flexible.svg",
    title: "Flexible Rentals",
    copy: "Daily, weekly and monthly options",
  },
  {
    icon: "/icons/trust-shield.svg",
    title: "Well-Maintained Vehicles",
    copy: "Quality and safety checked",
  },
  {
    icon: "/icons/trust-map.svg",
    title: "Dubai-Wide Service",
    copy: "Delivery and airport pickups",
  },
];

export default function Trust() {
  return (
    <section className={styles.trust}>
      <Reveal stagger className={styles.grid}>
        {ITEMS.map((item) => (
          <div className={styles.item} key={item.title}>
            <Image src={item.icon} alt="" width={28} height={28} className={styles.icon} />
            <div>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.copy}>{item.copy}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

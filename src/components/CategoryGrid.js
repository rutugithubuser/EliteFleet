import Image from "next/image";
import { ArrowRightIcon } from "./icons/Icons";
import styles from "./CategoryGrid.module.css";

const CATEGORIES = [
  { name: "Luxury", image: "/images/category/luxury.png", large: true },
  { name: "Sports", image: "/images/category/sports.png" },
  { name: "Exotic", image: "/images/category/exotic.png" },
  { name: "SUV", image: "/images/category/suv.png" },
  { name: "Economy", image: "/images/category/economy.png" },
];

export default function CategoryGrid() {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>Browse by Category</p>
      <h2 className={styles.heading}>A Car for Every Occasion</h2>

      <div className={styles.grid}>
        {CATEGORIES.map((cat) => (
          <a
            href="#fleet"
            key={cat.name}
            className={`${styles.tile} ${cat.large ? styles.tileLarge : ""}`}
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes={cat.large ? "(max-width: 600px) 100vw, 45vw" : "(max-width: 600px) 50vw, 22vw"}
              className={styles.tileImage}
            />
            <span className={styles.tileOverlay} />
            <span className={styles.tileContent}>
              <span className={styles.tileName}>{cat.name}</span>
              <span className={styles.tileLink}>
                Explore <ArrowRightIcon size={14} />
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

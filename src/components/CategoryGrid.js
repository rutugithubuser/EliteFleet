import { ArrowRightIcon } from "./icons/Icons";
import SanityImage from "./SanityImage";
import CategoryLink from "./CategoryLink";
import styles from "./CategoryGrid.module.css";

// The design has room for 5 tiles: 1 large + 4 small
const MAX_TILES = 5;

export default function CategoryGrid({ categories = [] }) {
  const tiles = categories.filter((c) => c.image?.asset).slice(0, MAX_TILES);
  if (tiles.length === 0) return null;

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>Browse by Category</p>
      <h2 className={styles.heading}>A Car for Every Occasion</h2>

      <div className={styles.grid}>
        {tiles.map((cat, i) => (
          <CategoryLink
            key={cat._id}
            category={cat.name}
            className={`${styles.tile} ${i === 0 ? styles.tileLarge : ""}`}
          >
            <SanityImage
              image={cat.image}
              alt={cat.image?.alt || cat.name}
              sizes={i === 0 ? "(max-width: 600px) 100vw, 45vw" : "(max-width: 600px) 50vw, 22vw"}
              className={styles.tileImage}
            />
            <span className={styles.tileOverlay} />
            <span className={styles.tileContent}>
              <span className={styles.tileName}>{cat.name}</span>
              <span className={styles.tileLink}>
                Explore <ArrowRightIcon size={14} />
              </span>
            </span>
          </CategoryLink>
        ))}
      </div>
    </section>
  );
}

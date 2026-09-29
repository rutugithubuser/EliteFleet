"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon } from "./icons/Icons";
import SanityImage from "./SanityImage";
import styles from "./VehicleGallery.module.css";

// Figma 27:78 — the detail page's left column: a 864x576 (3:2) main image with
// white prev/next chevrons and a "1 / 4" counter, then a 864x136 row of
// thumbnails 16px apart. The active thumb carries a 2px ink stroke; the rest sit
// under a 40% white wash ("Dim" in Figma).
//
// Only rendered when a car has more than one photo.
//
// The dataset has no gallery photos yet, so until editors upload them we repeat
// the car's own main photo to fill the design's four-up thumbnail row. Delete
// the PLACEHOLDER_THUMBS block once real photos exist — `gallery` then wins
// automatically and the duplicates disappear.
const PLACEHOLDER_THUMBS = 4;

export default function VehicleGallery({ car }) {
  const gallery = (car?.gallery ?? []).filter((img) => img?.asset);
  const fallback = car?.image?.asset
    ? Array.from({ length: PLACEHOLDER_THUMBS }, (_, i) => ({ ...car.image, _key: `main-${i}` }))
    : [];
  const images = gallery.length ? gallery : fallback;
  const [main, setMain] = useState(0);

  if (images.length === 0) return null;

  const current = images[main];
  const multiple = images.length > 1;
  const step = (delta) => setMain((i) => (i + delta + images.length) % images.length);

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <SanityImage
          image={current}
          alt={current.alt || car.name}
          sizes="(max-width: 1180px) 100vw, 864px"
          eager
          className={styles.image}
        />

        {multiple && (
          <>
            <button
              type="button"
              className={`${styles.nav} ${styles.navPrev}`}
              onClick={() => step(-1)}
              aria-label="Previous photo"
            >
              <ChevronLeftIcon size={20} />
            </button>
            <button
              type="button"
              className={`${styles.nav} ${styles.navNext}`}
              onClick={() => step(1)}
              aria-label="Next photo"
            >
              <ChevronRightIcon size={20} />
            </button>
            <p className={styles.counter}>
              <span>
                {main + 1} / {images.length}
              </span>
              <ExpandIcon size={16} />
            </p>
          </>
        )}
      </div>

      {multiple && (
        <div className={styles.thumbs} role="tablist" aria-label="Gallery thumbnails">
          {images.map((img, i) => (
            <button
              key={img._key ?? `${img.asset?._ref ?? "img"}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === main}
              aria-label={`View photo ${i + 1} of ${images.length}`}
              className={`${styles.thumb} ${i === main ? styles.thumbActive : ""}`}
              onClick={() => setMain(i)}
            >
              <SanityImage
                image={img}
                alt={img.alt || car.name}
                sizes="203px"
                className={styles.thumbImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

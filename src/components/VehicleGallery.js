"use client";

import { useState } from "react";
import SanityImage from "./SanityImage";
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon } from "./icons/Icons";
import styles from "./VehicleGallery.module.css";

// Figma 27:78 — the detail page's left column: an 864x576 (3:2) main image with
// white prev/next chevrons and a "1 / 4" counter, then a 864x136 row of
// thumbnails 16px apart. The active thumb carries a 2px ink stroke; the rest sit
// under a 40% white wash ("Dim" in Figma).
//
// Photos come from the car in Sanity: its main "Photo" first, then any
// "Gallery photos". With only one photo there are no arrows or thumbnails.
export default function VehicleGallery({ car }) {
  const photos = [car?.image, ...(car?.gallery ?? [])].filter((p) => p?.asset);
  const altFor = (photo) => photo?.alt || car?.name || "";

  const [main, setMain] = useState(0);
  if (photos.length === 0) return null;

  const current = Math.min(main, photos.length - 1);
  const multiple = photos.length > 1;
  const step = (delta) => setMain((i) => (i + delta + photos.length) % photos.length);

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <SanityImage
          image={photos[current]}
          alt={altFor(photos[current])}
          eager
          sizes="(max-width: 1180px) 100vw, 864px"
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
                {current + 1} / {photos.length}
              </span>
              <ExpandIcon size={16} />
            </p>
          </>
        )}
      </div>

      {multiple && (
        <div className={styles.thumbs} role="tablist" aria-label="Gallery thumbnails">
          {photos.map((photo, i) => (
            <button
              key={`${photo.asset?._ref ?? "photo"}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`View photo ${i + 1} of ${photos.length}`}
              className={`${styles.thumb} ${i === current ? styles.thumbActive : ""}`}
              onClick={() => setMain(i)}
            >
              <SanityImage
                image={photo}
                alt={altFor(photo)}
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

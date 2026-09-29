"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon } from "./icons/Icons";
import styles from "./VehicleGallery.module.css";

// Figma 27:78 — the detail page's left column: an 864x576 (3:2) main image with
// white prev/next chevrons and a "1 / 4" counter, then a 864x136 row of
// thumbnails 16px apart. The active thumb carries a 2px ink stroke; the rest sit
// under a 40% white wash ("Dim" in Figma).
//
// Photos come from /public/images/fleet and are referenced by plain path on the
// vehicle entry (see src/data/vehicles.js) — the same public-folder source the
// /fleet grid uses. Nothing here talks to Sanity, so the gallery renders even
// though the dataset has no uploaded gallery photos.
//
// Each car currently has a single photo, so until more are added the same one
// fills the four-up thumbnail row. Give a car a `gallery` array of public paths
// and it takes over automatically; delete PLACEHOLDER_THUMBS when every car has
// real multi-photo sets.
const PLACEHOLDER_THUMBS = 4;

export default function VehicleGallery({ car }) {
  const alt = car?.imageAlt || car?.name || "";

  // Real multi-photo list if the car has one, otherwise repeat its single photo.
  const photos =
    Array.isArray(car?.gallery) && car.gallery.length
      ? car.gallery
      : typeof car?.image === "string" && car.image
        ? Array.from({ length: PLACEHOLDER_THUMBS }, () => car.image)
        : [];

  const [main, setMain] = useState(0);
  if (photos.length === 0) return null;

  const current = Math.min(main, photos.length - 1);
  const multiple = photos.length > 1;
  const step = (delta) => setMain((i) => (i + delta + photos.length) % photos.length);

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <Image
          src={photos[current]}
          alt={alt}
          fill
          priority
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
          {photos.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`View photo ${i + 1} of ${photos.length}`}
              className={`${styles.thumb} ${i === current ? styles.thumbActive : ""}`}
              onClick={() => setMain(i)}
            >
              <Image
                src={src}
                alt={alt}
                fill
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

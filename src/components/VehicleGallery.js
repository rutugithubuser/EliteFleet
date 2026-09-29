"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SanityImage from "./SanityImage";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, ExpandIcon } from "./icons/Icons";
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
  const [fullscreen, setFullscreen] = useState(false);

  // While the full-screen view is open: Esc closes it, ← → change photo,
  // and the page behind it can't scroll.
  useEffect(() => {
    if (!fullscreen) return;
    const count = photos.length;
    function onKey(e) {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowRight") setMain((i) => (i + 1) % count);
      if (e.key === "ArrowLeft") setMain((i) => (i - 1 + count) % count);
    }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [fullscreen, photos.length]);

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
          </>
        )}

        {/* Opens the full-screen view */}
        <button
          type="button"
          className={styles.counter}
          onClick={() => setFullscreen(true)}
          aria-label="View photos full screen"
        >
          {multiple && (
            <span>
              {current + 1} / {photos.length}
            </span>
          )}
          <ExpandIcon size={16} />
        </button>
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

      {/* Full-screen view: click outside the photo, press Esc or × to close.
          Rendered straight into <body> so nothing on the page can cover or clip it. */}
      {fullscreen && createPortal(
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${car?.name ?? "Car"} photos`}
          onClick={() => setFullscreen(false)}
        >
          <div className={styles.lightboxPhoto} onClick={(e) => e.stopPropagation()}>
            <SanityImage
              image={photos[current]}
              alt={altFor(photos[current])}
              sizes="100vw"
              className={styles.lightboxImage}
            />
          </div>

          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setFullscreen(false)}
            aria-label="Close full screen"
            autoFocus
          >
            <CloseIcon size={22} />
          </button>

          {multiple && (
            <>
              <button
                type="button"
                className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous photo"
              >
                <ChevronLeftIcon size={24} />
              </button>
              <button
                type="button"
                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next photo"
              >
                <ChevronRightIcon size={24} />
              </button>
              <p className={styles.lightboxCount}>
                {current + 1} / {photos.length}
              </p>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

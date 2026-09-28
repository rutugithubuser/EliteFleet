"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

// Converts the focus point set in the Studio into a CSS object-position,
// so the car stays in frame whatever shape the image box is.
function focusPosition(image) {
  const { hotspot, crop } = image;
  if (!hotspot) return "50% 50%";
  const left = crop?.left ?? 0;
  const right = crop?.right ?? 0;
  const top = crop?.top ?? 0;
  const bottom = crop?.bottom ?? 0;
  const x = ((hotspot.x - left) / (1 - left - right)) * 100;
  const y = ((hotspot.y - top) / (1 - top - bottom)) * 100;
  const clamp = (n) => Math.min(100, Math.max(0, n));
  return `${clamp(x).toFixed(1)}% ${clamp(y).toFixed(1)}%`;
}

/**
 * Shows an image uploaded in Sanity.
 * Fills its parent box (the parent needs position: relative and a size),
 * loads a correctly sized version from Sanity's image servers,
 * and respects the focus point set in the Studio.
 *
 * Set `eager` on the most important image near the top of the page,
 * so it starts loading right away instead of when scrolled into view.
 */
export default function SanityImage({ image, alt, sizes, eager = false, className }) {
  if (!image?.asset) return null;

  const loader = ({ width, quality }) =>
    urlFor(image)
      .width(width)
      .quality(quality || 75)
      .auto("format")
      .url();

  return (
    <Image
      loader={loader}
      src={urlFor(image).width(1600).url()}
      alt={alt ?? image.alt ?? ""}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      className={className}
      style={{ objectFit: "cover", objectPosition: focusPosition(image) }}
    />
  );
}

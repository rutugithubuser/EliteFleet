"use client";

import Image from "next/image";
import SanityImage from "./SanityImage";

/**
 * A vehicle's photo. Cars come from Sanity, so this is normally a Sanity
 * image; a plain public-folder path (e.g. "/images/fleet/car.png") also works.
 *
 * Fills its parent box exactly like SanityImage, so card styles and
 * image boxes stay identical whichever source is used.
 */
export default function CarImage({ image, alt, sizes, eager = false, className }) {
  if (typeof image === "string") {
    return (
      <Image
        src={image}
        alt={alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        className={className}
      />
    );
  }
  return <SanityImage image={image} alt={alt} sizes={sizes} eager={eager} className={className} />;
}

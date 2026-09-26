"use client";

import { useBooking } from "@/context/BookingContext";
import Link from "next/link";
import { LINKS } from "@/lib/links";

// A link that jumps to the Fleet section and switches its filter to one category.
export default function CategoryLink({ category, className, children }) {
  const { setCategory } = useBooking();

  return (
    <Link href={LINKS.fleetSection} className={className} onClick={() => setCategory(category)}>
      {children}
    </Link>
  );
}

"use client";

import { useBooking } from "@/context/BookingContext";

// A link that jumps to the Fleet section and switches its filter to one category.
export default function CategoryLink({ category, className, children }) {
  const { setCategory } = useBooking();

  return (
    <a href="#fleet" className={className} onClick={() => setCategory(category)}>
      {children}
    </a>
  );
}

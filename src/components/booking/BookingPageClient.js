"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import BookingFlow from "./BookingFlow";

// Inner component that reads the URL: ?car=<slug> and, when coming from a
// car page's "Book This Car" button, &pickup=, &dropoff= and &location=
function BookingInner({ cars, settings }) {
  const params = useSearchParams();
  const carSlug = params.get("car") || null;
  const prefill = {
    pickupDate: params.get("pickup"),
    dropoffDate: params.get("dropoff"),
    pickupLocation: params.get("location"),
  };
  return <BookingFlow carSlug={carSlug} cars={cars} prefill={prefill} settings={settings} />;
}

// Suspense boundary required by Next.js when using useSearchParams
export default function BookingPageClient({ cars = [], settings }) {
  return (
    <Suspense fallback={<BookingFlow carSlug={null} cars={cars} settings={settings} />}>
      <BookingInner cars={cars} settings={settings} />
    </Suspense>
  );
}

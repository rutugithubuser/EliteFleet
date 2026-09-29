"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import BookingFlow from "./BookingFlow";

// Inner component that reads the URL search params
function BookingInner({ settings }) {
  const params = useSearchParams();
  const carSlug = params.get("car") || null;
  return <BookingFlow carSlug={carSlug} settings={settings} />;
}

// Suspense boundary required by Next.js when using useSearchParams
export default function BookingPageClient({ settings }) {
  return (
    <Suspense fallback={<BookingFlow carSlug={null} settings={settings} />}>
      <BookingInner settings={settings} />
    </Suspense>
  );
}

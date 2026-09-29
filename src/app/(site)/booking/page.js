import BookingPageClient from "@/components/booking/BookingPageClient";
import { sanityFetch } from "@/sanity/lib/client";
import { BOOKING_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata = {
  title: "Request a Booking — Elite Fleet",
  description:
    "Send your trip details and our team will confirm availability and your rate. Luxury car rental in Dubai.",
};

export default async function BookingPage() {
  const data = await sanityFetch({ query: BOOKING_QUERY });
  const settings = data?.settings ?? {};

  return <BookingPageClient settings={settings} />;
}


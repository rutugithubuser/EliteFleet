import ComingSoon from "@/components/ComingSoon";
import { sanityFetch } from "@/sanity/lib/client";
import { SITE_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata = { title: "Book a Car — Elite Fleet" };

// Placeholder until the Booking form design is built.
// "Book Now" on a car links here as /booking?car=<slug>, so the real form can pre-select that car.
export default async function BookingPage() {
  const data = await sanityFetch({ query: SITE_QUERY });
  return (
    <ComingSoon
      title="Book Your Car"
      text="Online booking is coming soon. Until then, send us your dates and pickup location on WhatsApp and we'll confirm your booking."
      settings={data?.settings ?? {}}
    />
  );
}

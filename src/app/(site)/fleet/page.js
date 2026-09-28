import FleetShowcase from "@/components/FleetShowcase";
import FleetCta from "@/components/FleetCta";
import { sanityFetch } from "@/sanity/lib/client";
import { FLEET_META_QUERY } from "@/sanity/lib/queries";
import { VEHICLES } from "@/data/vehicles";

export const revalidate = 60;

export const metadata = {
  title: "Our Fleet — Elite Fleet",
  description:
    "Browse every car in the Elite Fleet — luxury, sports, SUV, exotic and economy cars for rent in Dubai. Filter by category, brand, price, seats and transmission.",
};

// The 12-car line-up lives in src/data/vehicles.js; categories (pill row) and
// the WhatsApp line still come from Sanity. Search, filters and the Filters
// drawer all run client-side over this data (see FleetShowcase).
export default async function FleetPage() {
  const data = await sanityFetch({ query: FLEET_META_QUERY });

  // The design's pill row puts SUV before Exotic; Sanity's `order` field has
  // it the other way round, so sort the pills to match the design (anything
  // not listed falls to the end, alphabetically).
  const PILL_ORDER = ["Luxury", "Sports", "SUV", "Exotic", "Economy", "Convertible"];
  const rank = (name) => {
    const i = PILL_ORDER.indexOf(name);
    return i === -1 ? PILL_ORDER.length : i;
  };
  const categoryOptions = [...(data?.categories ?? [])].sort(
    (a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name)
  );

  return (
    <>
      <FleetShowcase
        cars={VEHICLES}
        // name + slug, so /fleet?category=... can pre-select a filter
        categoryOptions={categoryOptions}
      />
      <FleetCta settings={data?.settings ?? {}} />
    </>
  );
}

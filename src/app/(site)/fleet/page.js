import FleetShowcase from "@/components/FleetShowcase";
import FleetCta from "@/components/FleetCta";
import { sanityFetch } from "@/sanity/lib/client";
import { FLEET_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata = {
  title: "Our Fleet — Elite Fleet",
  description:
    "Browse every car in the Elite Fleet — luxury, sports, SUV, exotic and economy cars for rent in Dubai. Filter by category, brand, price, seats and transmission.",
};

// Cars, category pills and the WhatsApp line all come from Sanity.
// Search, filters and the Filters drawer run in the browser over this data (see FleetShowcase).
export default async function FleetPage() {
  const data = await sanityFetch({ query: FLEET_QUERY });

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
        cars={data?.cars ?? []}
        // name + slug, so /fleet?category=... can pre-select a filter
        categoryOptions={categoryOptions}
      />
      <FleetCta settings={data?.settings ?? {}} />
    </>
  );
}

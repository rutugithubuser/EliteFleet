import ComingSoon from "@/components/ComingSoon";
import { sanityFetch } from "@/sanity/lib/client";
import { SITE_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata = { title: "Our Fleet — Elite Fleet" };

// Placeholder until the Fleet page design is built
export default async function FleetPage() {
  const data = await sanityFetch({ query: SITE_QUERY });
  return (
    <ComingSoon
      title="The Full Fleet"
      text="Our complete fleet page is on its way. Until then, message us and we'll help you pick the right car."
      settings={data?.settings ?? {}}
    />
  );
}

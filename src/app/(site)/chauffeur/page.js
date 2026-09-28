import ComingSoon from "@/components/ComingSoon";
import { sanityFetch } from "@/sanity/lib/client";
import { SITE_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata = { title: "Chauffeur Service — Elite Fleet" };

// Placeholder until the Chauffeur page design is built
export default async function ChauffeurPage() {
  const data = await sanityFetch({ query: SITE_QUERY });
  return (
    <ComingSoon
      title="Chauffeur Service"
      text="Our chauffeur page is coming soon. Message us to arrange a driver for your trip."
      settings={data?.settings ?? {}}
    />
  );
}

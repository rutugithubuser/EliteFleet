import ComingSoon from "@/components/ComingSoon";
import { sanityFetch } from "@/sanity/lib/client";
import { SITE_QUERY } from "@/sanity/lib/queries";

// Shown for any web address that doesn't exist (with the normal navbar and footer)
export default async function NotFound() {
  const data = await sanityFetch({ query: SITE_QUERY });
  return (
    <ComingSoon
      eyebrow="Page not found"
      title="Wrong turn."
      text="This page doesn't exist or may have moved. Head back to the homepage, or message us and we'll help you find your car."
      settings={data?.settings ?? {}}
    />
  );
}

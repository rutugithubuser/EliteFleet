import Hero from "@/components/Hero";
import Trust from "@/components/Trust";
import FleetGrid from "@/components/FleetGrid";
import EliteExperience from "@/components/EliteExperience";
import FeaturedVehicles from "@/components/FeaturedVehicles";
import WhyEliteFleet from "@/components/WhyEliteFleet";
import HowItWorks from "@/components/HowItWorks";
import CategoryGrid from "@/components/CategoryGrid";
import Testimonials from "@/components/Testimonials";
import FinalCta from "@/components/FinalCta";
import { sanityFetch } from "@/sanity/lib/client";
import { HOME_QUERY } from "@/sanity/lib/queries";

// Rebuild this page with fresh Sanity content at most once every 60 seconds
export const revalidate = 60;

export default async function Home() {
  const data = await sanityFetch({ query: HOME_QUERY });

  const settings = data?.settings ?? {};
  const home = data?.home ?? {};
  const cars = data?.cars ?? [];
  const categories = data?.categories ?? [];
  const testimonials = data?.testimonials ?? [];
  // Skip featured cars that were deleted after being picked
  const featured = (home.featured ?? []).filter(Boolean);
  const categoryNames = categories.map((c) => c.name);

  // Navbar and footer come from (site)/layout.js
  return (
    <>
      <Hero home={home} settings={settings} categoryNames={categoryNames} />
      <Trust />
      <FleetGrid cars={cars} categoryNames={categoryNames} />
      <EliteExperience />
      <FeaturedVehicles cars={featured} />
      <WhyEliteFleet />
      <HowItWorks settings={settings} />
      <CategoryGrid categories={categories} />
      <Testimonials testimonials={testimonials} />
      <FinalCta settings={settings} />
    </>
  );
}

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
import { VEHICLES } from "@/data/vehicles";

// Rebuild this page with fresh Sanity content at most once every 60 seconds
export const revalidate = 60;

export default async function Home() {
  const data = await sanityFetch({ query: HOME_QUERY });

  const settings = data?.settings ?? {};
  const home = data?.home ?? {};
  const categories = data?.categories ?? [];
  const testimonials = data?.testimonials ?? [];
  // Fleet grid comes from the static 12-car list. The featured carousel keeps
  // its CMS picks (home singleton, in pick order), but each pick is re-served
  // from the 12-car list when it exists there, so photos and prices match the
  // fleet grid. The Lamborghini isn't part of the 12-car list — it stays
  // served from Sanity until it's added.
  const cars = VEHICLES;
  const featured = (home.featured ?? [])
    .filter(Boolean)
    .map((car) => VEHICLES.find((v) => v.slug === car.slug) ?? car);
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

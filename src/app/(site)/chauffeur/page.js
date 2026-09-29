import ChauffeurHero from "@/components/chauffeur/ChauffeurHero";
import ChauffeurServices from "@/components/chauffeur/ChauffeurServices";
import ChauffeurFleet from "@/components/chauffeur/ChauffeurFleet";
import ChauffeurRequest from "@/components/chauffeur/ChauffeurRequest";
import { DEFAULT_CARS, DEFAULT_SERVICES } from "@/components/chauffeur/content";
import { sanityFetch } from "@/sanity/lib/client";
import { CHAUFFEUR_QUERY } from "@/sanity/lib/queries";

// Rebuild this page with fresh Sanity content at most once every 60 seconds
export const revalidate = 60;

export const metadata = {
  title: "Chauffeur Service in Dubai — Elite Fleet",
  description:
    "Chauffeur-driven luxury across Dubai — airport transfers, corporate travel, events and special occasions.",
};

export default async function ChauffeurPage() {
  const data = await sanityFetch({ query: CHAUFFEUR_QUERY });
  const settings = data?.settings ?? {};
  const page = data?.page ?? {};

  // Anything not filled in Studio → Chauffeur Page falls back to the Figma content
  const services = page.services?.length ? page.services : DEFAULT_SERVICES;
  const cars = (page.cars ?? []).filter(Boolean);

  return (
    <>
      <ChauffeurHero image={page.heroImage} settings={settings} />
      <ChauffeurServices services={services} />
      <ChauffeurFleet image={page.fleetImage} cars={cars.length ? cars : DEFAULT_CARS} />
      <ChauffeurRequest
        services={services}
        locations={settings.pickupLocations ?? []}
        settings={settings}
      />
    </>
  );
}

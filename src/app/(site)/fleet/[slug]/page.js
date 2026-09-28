import { notFound } from "next/navigation";
import ComingSoon from "@/components/ComingSoon";
import { sanityFetch } from "@/sanity/lib/client";
import { CAR_QUERY, CAR_SLUGS_QUERY, SITE_QUERY } from "@/sanity/lib/queries";
import { VEHICLES } from "@/data/vehicles";
import { carPriceLabel } from "@/lib/format";

export const revalidate = 60;

// Pre-build one page per car: the static /fleet line-up plus the cars in Sanity
export async function generateStaticParams() {
  const slugs = (await sanityFetch({ query: CAR_SLUGS_QUERY })) ?? [];
  return [...new Set([...slugs, ...VEHICLES.map((v) => v.slug)])].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const staticCar = VEHICLES.find((v) => v.slug === slug);
  if (staticCar) return { title: `${staticCar.name} — Elite Fleet` };
  const car = await sanityFetch({ query: CAR_QUERY, params: { slug } });
  return { title: car ? `${car.name} — Elite Fleet` : "Car not found — Elite Fleet" };
}

// Placeholder until the Car Details page design is built
export default async function CarPage({ params }) {
  const { slug } = await params;
  const staticCar = VEHICLES.find((v) => v.slug === slug);
  const [sanityCar, site] = await Promise.all([
    sanityFetch({ query: CAR_QUERY, params: { slug } }),
    sanityFetch({ query: SITE_QUERY }),
  ]);
  const car = staticCar ?? sanityCar;
  if (!car) notFound();

  return (
    <ComingSoon
      eyebrow={car.brand || "Elite Fleet"}
      title={car.name}
      text={`${carPriceLabel(car)}. The full details page for this car is coming soon — message us to book it today.`}
      settings={site?.settings ?? {}}
    />
  );
}

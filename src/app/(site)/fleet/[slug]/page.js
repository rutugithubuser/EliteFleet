import { notFound } from "next/navigation";
import ComingSoon from "@/components/ComingSoon";
import { sanityFetch } from "@/sanity/lib/client";
import { CAR_QUERY, CAR_SLUGS_QUERY, SITE_QUERY } from "@/sanity/lib/queries";
import { carPriceLabel } from "@/lib/format";

export const revalidate = 60;

// Pre-build one page per car in Sanity
export async function generateStaticParams() {
  const slugs = (await sanityFetch({ query: CAR_SLUGS_QUERY })) ?? [];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const car = await sanityFetch({ query: CAR_QUERY, params: { slug } });
  return { title: car ? `${car.name} — Elite Fleet` : "Car not found — Elite Fleet" };
}

// Placeholder until the Car Details page design is built
export default async function CarPage({ params }) {
  const { slug } = await params;
  const [car, site] = await Promise.all([
    sanityFetch({ query: CAR_QUERY, params: { slug } }),
    sanityFetch({ query: SITE_QUERY }),
  ]);
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

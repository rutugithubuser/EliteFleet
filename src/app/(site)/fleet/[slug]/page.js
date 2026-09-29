import { notFound } from "next/navigation";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/client";
import { CAR_PAGE_QUERY, CAR_QUERY, CAR_SLUGS_QUERY } from "@/sanity/lib/queries";
import { LINKS } from "@/lib/links";
import VehicleGallery from "@/components/VehicleGallery";
import SpecCard from "@/components/SpecCard";
import IncludesList from "@/components/IncludesList";
import BookingPanel from "@/components/BookingPanel";
import RelatedVehicles from "@/components/RelatedVehicles";
import StickyBookingBar from "@/components/StickyBookingBar";
import TitlePrice from "@/components/TitlePrice";
import MobileBooking from "@/components/MobileBooking";
import {
  CarIcon,
  EngineIcon,
  FuelIcon,
  MileageIcon,
  SeatsIcon,
  ShieldIcon,
  SpeedIcon,
  SteeringIcon,
  TransmissionIcon,
} from "@/components/icons/Icons";
import { carPriceLabel, phoneLink } from "@/lib/format";
import styles from "./page.module.css";

export const revalidate = 60;

// Pre-build one page per car in Sanity (Studio → Cars)
export async function generateStaticParams() {
  const slugs = (await sanityFetch({ query: CAR_SLUGS_QUERY })) ?? [];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const car = await sanityFetch({ query: CAR_QUERY, params: { slug } });
  return { title: car ? `${car.name} — Elite Fleet` : "Car not found — Elite Fleet" };
}

export default async function CarPage({ params }) {
  const { slug } = await params;
  const data = await sanityFetch({ query: CAR_PAGE_QUERY, params: { slug } });
  const car = data?.car;
  if (!car) notFound();

  const settings = data?.settings ?? {};
  // Up to 3 other cars from the same category
  const relatedCars = data?.related ?? [];

  // Breadcrumb path
  const breadcrumb = (
    <>
      <Link href={LINKS.home} className={styles.breadcrumbLink}>Home</Link>
      <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
      <Link href={LINKS.fleet} className={styles.breadcrumbLink}>Fleet</Link>
      <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
      <span className={styles.breadcrumbCurrent} aria-current="page">{car.name}</span>
    </>
  );

  // Spec grid data. Order matches the 8 "Spec /" cells in Figma 27:102: four
  // across on desktop, two across on mobile. Every value comes from the car in
  // Sanity; a spec left empty there shows as a blank cell, so the grid keeps its 4 × 2 shape.
  const specs = [
    { label: "Seats", value: car.seats ? `${car.seats} Adults` : null, icon: SeatsIcon },
    { label: "Transmission", value: car.transmission, icon: TransmissionIcon },
    { label: "Mileage", value: car.dailyKmLimit ? `${car.dailyKmLimit} km` : null, icon: MileageIcon },
    { label: "Top speed", value: car.topSpeed, icon: SpeedIcon },
    { label: "Engine", value: car.engine, icon: EngineIcon },
    { label: "Fuel", value: car.fuel, icon: FuelIcon },
    { label: "Drive type", value: car.driveType, icon: SteeringIcon },
    { label: "Category", value: car.category, icon: CarIcon },
  ];

  return (
    <article className={styles.carPage}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <div className={styles.breadcrumbInner}>{breadcrumb}</div>
      </nav>

      {/* Page body. Desktop: two columns (gallery+info | sticky panel).
         Mobile: a single flex column whose order matches the Figma mobile frame. */}
      <div className={styles.body}>

        {/* 1. Desktop layout (gallery + info | sticky panel).
            On mobile this unwraps so its children can be reordered. */}
        <div className={styles.desktopLayout}>
          <div className={styles.leftColumn}>
            <VehicleGallery car={car} />

            <section className={styles.overview} aria-labelledby="overview-heading">
              <h2 id="overview-heading" className={styles.overviewHeading}>Overview</h2>
              <p className={styles.overviewText}>
                {car.overview ||
                  "Experience the perfect blend of luxury and performance. This vehicle represents the pinnacle of automotive engineering, designed to make every journey exceptional."}
              </p>
            </section>

            <section className={styles.specs} aria-labelledby="specs-heading">
              <h2 id="specs-heading" className={styles.specsHeading}>Specifications</h2>
              <div className={styles.specGrid} role="list">
                {specs.map((s) => (
                  <SpecCard key={s.label} icon={s.icon} label={s.label} value={s.value} />
                ))}
              </div>
            </section>

            <IncludesList items={car.includes} />
          </div>

          <BookingPanel car={car} settings={settings} />
        </div>

        {/* 2. Mobile-only: title + price, between the gallery and the specs. */}
        <section className={styles.titlePriceMobile} aria-labelledby="mobile-title-heading">
          <TitlePrice car={car} />
        </section>

        {/* 5. Related vehicles (appears on both desktop and mobile) */}
        <RelatedVehicles cars={relatedCars} className={styles.related} />

        {/* 6. Mobile sticky booking bar */}
        <StickyBookingBar car={car} settings={settings} />
      </div>
    </article>
  );
}
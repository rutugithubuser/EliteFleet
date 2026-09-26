import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingProvider } from "@/context/BookingContext";
import { sanityFetch } from "@/sanity/lib/client";
import { SITE_QUERY } from "@/sanity/lib/queries";

// The frame shared by every website page (not the Studio): navbar, footer,
// and the fleet filter state. New pages go inside this (site) folder.

export const revalidate = 60;

export default async function SiteLayout({ children }) {
  const data = await sanityFetch({ query: SITE_QUERY });
  const settings = data?.settings ?? {};

  return (
    <BookingProvider>
      <Navbar settings={settings} />
      <main>{children}</main>
      <Footer
        settings={settings}
        categories={data?.categories ?? []}
        legalPages={data?.legalPages ?? []}
      />
    </BookingProvider>
  );
}

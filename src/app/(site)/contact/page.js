import Contact from "@/components/Contact";
import { sanityFetch } from "@/sanity/lib/client";
import { SITE_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata = {
  title: "Contact Us — Elite Fleet",
  description:
    "Call, WhatsApp or email Elite Fleet in Dubai — or send us a message with your dates and preferred car. We're open every day from 8:00 AM to 10:00 PM.",
};

export default async function ContactPage() {
  const data = await sanityFetch({ query: SITE_QUERY });
  return <Contact settings={data?.settings ?? {}} />;
}

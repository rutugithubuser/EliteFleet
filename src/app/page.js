import Navbar from "@/components/Navbar";
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
import Footer from "@/components/Footer";
import { BookingProvider } from "@/context/BookingContext";

export default function Home() {
  return (
    <BookingProvider>
      <Navbar />
      <main>
        <Hero />
        <Trust />
        <FleetGrid />
        <EliteExperience />
        <FeaturedVehicles />
        <WhyEliteFleet />
        <HowItWorks />
        <CategoryGrid />
        <Testimonials />
        <FinalCta />
      </main>
      <Footer />
    </BookingProvider>
  );
}

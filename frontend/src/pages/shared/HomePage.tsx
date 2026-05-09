import { HeroSection } from "@/components/sections/home/hero-section";
import { ServicesSection } from "@/components/sections/home/services-section";
import { ReviewsSection } from "@/components/sections/home/reviews-section";

function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ReviewsSection />
    </>
  );
}

export default HomePage;

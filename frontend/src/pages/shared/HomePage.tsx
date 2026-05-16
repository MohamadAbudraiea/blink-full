import { HeroSection } from "@/components/sections/home/hero-section";
import { ServicesSection } from "@/components/sections/home/services-section";
import { ReviewsSection } from "@/components/sections/home/reviews-section";
import { HowItWorksSection } from "@/components/sections/home/how-it-works-section";
import { CtaSection } from "@/components/sections/home/cta-section";

function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <ReviewsSection />
      <CtaSection />
    </>
  );
}

export default HomePage;

import { HeroServicesSection } from "@/components/sections/services/hero-services-section";
import { ServicesListSection } from "@/components/sections/services/services-list-section";
import { ComparisonTableSection } from "@/components/sections/services/comparison-table-section";
import { CtaServicesSection } from "@/components/sections/services/cta-services-section";

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroServicesSection />
      <ServicesListSection />
      <ComparisonTableSection />
      <CtaServicesSection />
    </div>
  );
}

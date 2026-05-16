import { HeroSubscriptionsSection } from "@/components/sections/subscriptions/hero-subscriptions-section";
import { PlansDetailSection } from "@/components/sections/subscriptions/plans-detail-section";
import { HowSubscriptionsWorkSection } from "@/components/sections/subscriptions/how-subscriptions-work-section";
import { FaqSubscriptionsSection } from "@/components/sections/subscriptions/faq-subscriptions-section";
import { CtaSubscriptionsSection } from "@/components/sections/subscriptions/cta-subscriptions-section";

export default function SubscriptionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSubscriptionsSection />
      <PlansDetailSection />
      <HowSubscriptionsWorkSection />
      <FaqSubscriptionsSection />
      <CtaSubscriptionsSection />
    </div>
  );
}

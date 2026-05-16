import ContactInfoSection from "@/components/sections/contact/contact-info-section";
import { HeroContactSection } from "@/components/sections/contact/hero-contact-section";
import QuestionsSection from "@/components/sections/contact/questions-section";
import { SocialProofStrip } from "@/components/shared/SocialProofStrip";

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroContactSection />

      {/* Contact Form & Info Section */}
      <ContactInfoSection />

      {/* FAQ Section */}
      <QuestionsSection />

      {/* Social Proof Section */}
      <SocialProofStrip />
    </>
  );
}

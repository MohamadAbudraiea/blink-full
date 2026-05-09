import ContactInfoSection from "@/components/sections/contact/contact-info-section";
import { HeroContactSection } from "@/components/sections/contact/hero-contact-section";
import QuestionsSection from "@/components/sections/contact/questions-section";

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroContactSection />

      {/* Contact Form & Info Section */}
      <ContactInfoSection />

      {/* FAQ Section */}
      <QuestionsSection />
    </>
  );
}

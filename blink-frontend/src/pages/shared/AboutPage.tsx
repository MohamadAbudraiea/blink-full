import { HeroAboutSection } from "@/components/sections/about/hero-about-section";
import { StorySection } from "@/components/sections/about/story-section";
import { ValuesSection } from "@/components/sections/about/values-section";
import { TeamSection } from "@/components/sections/about/team-section";

function AboutPage() {
  return (
    <>
      <HeroAboutSection />
      <StorySection />
      <ValuesSection />
      <TeamSection />
    </>
  );
}

export default AboutPage;

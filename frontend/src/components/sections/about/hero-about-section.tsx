import { useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { useRef, useEffect } from "react";
import { useTheme } from "@/context/theme-provider";
import AOS from "aos";

export function HeroAboutSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const ref = useRef(null);
  
  // Keep framer-motion strictly for the parallax effect since AOS doesn't do parallax
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    // Refresh AOS when component mounts to ensure it picks up elements
    AOS.refresh();
  }, []);

  return (
    <section
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ transform: `translateY(${y.get()})` }} // Apply the parallax transform manually
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/80 z-10" />
        <img
          src="/about_hero_bg.png"
          alt="About Hero"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <div
          data-aos="fade-up"
          data-aos-duration="1200"
          className="flex flex-col items-center gap-8"
        >
          {/* Logo with fade/scale animation */}
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            <img
              src={theme === "light" ? "/white-logo.png" : "/dark-logo.png"}
              alt="BLINK Logo"
              className="h-24 md:h-36 w-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            />
          </div>

          {/* Tagline and content */}
          <div
            data-aos="fade"
            data-aos-delay="1200"
            data-aos-duration="1000"
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic drop-shadow-lg">
              {t("about.hero.tagline")}
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">
              {t("about.hero.content")}
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        data-aos="fade"
        data-aos-delay="2000"
        data-aos-duration="1000"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce-scroll"
      >
        <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">
          Scroll
        </span>
        <ChevronDown className="w-8 h-8 text-white/30" />
      </div>
    </section>
  );
}

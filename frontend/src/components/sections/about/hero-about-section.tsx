import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { useTheme } from "@/context/theme-provider";

export function HeroAboutSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Parallax Background */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/80 z-10" />
        <img
          src="/about_hero_bg.png"
          alt="About Hero"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-8"
        >
          {/* Logo with fade/scale animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <img
              src={theme === "light" ? "/white-logo.png" : "/dark-logo.png"}
              alt="BLINK Logo"
              className="h-24 md:h-36 w-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            />
          </motion.div>

          {/* Tagline and content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic drop-shadow-lg">
              {t("about.hero.tagline")}
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">
              {t("about.hero.content")}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 2, duration: 1 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">
          Scroll
        </span>
        <ChevronDown className="w-8 h-8 text-white/30" />
      </motion.div>
    </section>
  );
}

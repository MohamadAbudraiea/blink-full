import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";

export function HeroSubscriptionsSection() {
  const { t } = useTranslation();

  const planLabels = [
    t("subscriptionsPage.hero.marquee.starter"),
    t("subscriptionsPage.hero.marquee.pro"),
    t("subscriptionsPage.hero.marquee.elite"),
    t("subscriptionsPage.hero.marquee.flexible"),
    t("subscriptionsPage.hero.marquee.any_service"),
  ];

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden bg-black">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/20 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-48 h-48 bg-violet-500/10 rounded-full blur-[60px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary text-xs font-black uppercase tracking-[0.4em]">
              {t("subscriptionsPage.hero.badge")}
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-white mb-8 tracking-tighter uppercase italic leading-[0.9]">
            {t("subscriptionsPage.hero.title")}
          </h1>

          <p className="text-xl sm:text-2xl text-white/60 mb-6 leading-relaxed font-light max-w-3xl mx-auto">
            {t("subscriptionsPage.hero.subtitle")}
          </p>

          {/* Highlight badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {["2", "4", "8"].map((num, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.15, type: "spring" }}
                className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full"
              >
                <span className="text-2xl font-black text-primary">{num}</span>
                <span className="text-sm text-white/70 font-medium">
                  {t("subscriptionsPage.hero.services_text")}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Auto-scrolling Marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden w-full bg-white/5 py-6 backdrop-blur-xl border-t border-white/10">
        <motion.div
          className="flex whitespace-nowrap items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
        >
          {[...planLabels, ...planLabels, ...planLabels].map((label, index) => (
            <div key={index} className="flex items-center px-12">
              <span className="text-xl font-black text-white/40 tracking-[0.2em] uppercase italic hover:text-primary transition-colors cursor-default">
                {label}
              </span>
              <div className="mx-12 w-2 h-2 rounded-full bg-primary/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

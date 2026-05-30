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
      <div
        className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] animate-[pulse_6s_ease-in-out_infinite]"
      />
      <div
        className="absolute bottom-20 left-20 w-48 h-48 bg-violet-500/10 rounded-full blur-[60px] animate-[pulse_5s_ease-in-out_infinite_reverse]"
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
        <div
          data-aos="fade-up"
          data-aos-duration="800"
          className="text-center max-w-5xl mx-auto"
        >
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            data-aos-duration="500"
            className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary text-xs font-black uppercase tracking-[0.4em]">
              {t("subscriptionsPage.hero.badge")}
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-white mb-8 tracking-tighter uppercase italic leading-[0.9]">
            {t("subscriptionsPage.hero.title")}
          </h1>

          <p className="text-xl sm:text-2xl text-white/60 mb-6 leading-relaxed font-light max-w-3xl mx-auto">
            {t("subscriptionsPage.hero.subtitle")}
          </p>

          {/* Highlight badges */}
          <div
            data-aos="fade-up"
            data-aos-delay="600"
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {["2", "4", "8"].map((num, i) => (
              <div
                key={num}
                data-aos="zoom-in"
                data-aos-delay={800 + i * 150}
                className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full"
              >
                <span className="text-2xl font-black text-primary">{num}</span>
                <span className="text-sm text-white/70 font-medium">
                  {t("subscriptionsPage.hero.services_text")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auto-scrolling Marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden w-full bg-white/5 py-6 backdrop-blur-xl border-t border-white/10">
        <div
          className="flex whitespace-nowrap items-center animate-[marquee_25s_linear_infinite]"
        >
          {[...planLabels, ...planLabels, ...planLabels].map((label, index) => (
            <div key={index} className="flex items-center px-12">
              <span className="text-xl font-black text-white/40 tracking-[0.2em] uppercase italic hover:text-primary transition-colors cursor-default">
                {label}
              </span>
              <div className="mx-12 w-2 h-2 rounded-full bg-primary/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

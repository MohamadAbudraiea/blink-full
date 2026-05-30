import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function CtaSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Full-width gradient banner */}
      <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/80 to-background/90" />

      {/* Subtle car silhouette or particles (using CSS patterns) */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          data-aos="zoom-in"
          data-aos-duration="600"
          className="max-w-4xl mx-auto text-center p-8 md:p-12 rounded-3xl bg-background/10 backdrop-blur-md border border-white/10 shadow-2xl"
        >
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-lg"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {t("home.ctaBanner.title")}
          </h2>

          <div className="mt-8">
            <Link to="/booking">
              <button
                className="bg-background text-foreground hover:bg-background/90 px-8 py-4 rounded-full text-lg font-bold shadow-xl flex items-center mx-auto gap-2 group cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                {t("home.ctaBanner.button")}
                <span className="relative flex h-3 w-3 ml-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

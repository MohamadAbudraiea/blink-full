import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCheckAuth } from "@/hooks/useAuth";

export default function DrycleanServicePage() {
  const { isAuthenticated, isUser } = useCheckAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const isRTL = locale === "ar";

  const levels = ["premium", "Blink"];

  return (
    <>
      {/* Immersive Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent z-10" />
          <img
            src="/dryclean.webp"
            alt="Dryclean Service"
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <Link
            to="/services"
            className={`inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 text-sm font-bold uppercase tracking-widest ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("services.back")}</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center mb-8"
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase mb-6">
              {t("services.items.dryclean.title")}
            </h1>

            <p className="text-xl text-white/60 leading-relaxed font-light mb-10 max-w-xl">
              {t("services.items.dryclean.description")}
            </p>

            {isAuthenticated ? (
              isUser && (
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 rounded-full font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                >
                  {t("services.book")}
                </Link>
              )
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 rounded-full font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
              >
                {t("services.login")}
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Service Tiers */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-4">
              {t("services.choose")}
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter italic uppercase">
              {t("services.packages")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {levels.map((level, index) => {
              const isFeatured = level === "Blink";
              const points = t(`services.items.dryclean.${level}.points`, {
                returnObjects: true,
              }) as string[];

              return (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={`relative group rounded-4xl border p-10 transition-all duration-500 ${
                    isFeatured
                      ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20 scale-[1.02]"
                      : "bg-muted/30 border-border/50 hover:border-primary/30"
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full">
                      Recommended
                    </div>
                  )}

                  <h3
                    className={`text-3xl font-black tracking-tight mb-3 ${isFeatured ? "" : "text-foreground"}`}
                  >
                    {t(`services.items.dryclean.${level}.title`)}
                  </h3>
                  <p
                    className={`text-lg mb-8 font-light ${isFeatured ? "opacity-80" : "text-muted-foreground"}`}
                  >
                    {t(`services.items.dryclean.${level}.desc`)}
                  </p>

                  <ul className="space-y-4">
                    {points.map((point: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            isFeatured
                              ? "bg-primary-foreground/20"
                              : "bg-primary/10"
                          }`}
                        >
                          <Check
                            className={`w-3 h-3 ${isFeatured ? "text-primary-foreground" : "text-primary"}`}
                          />
                        </div>
                        <span
                          className={`leading-relaxed ${isFeatured ? "opacity-90" : "text-muted-foreground"}`}
                        >
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

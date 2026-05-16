import { motion } from "framer-motion";
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center p-8 md:p-12 rounded-3xl bg-background/10 backdrop-blur-md border border-white/10 shadow-2xl"
        >
          <motion.div
            initial={{ rotate: -10, scale: 0 }}
            whileInView={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            viewport={{ once: true }}
            className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-lg"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {t("home.ctaBanner.title")}
          </h2>

          <div className="mt-8">
            <Link to="/booking">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-background text-foreground hover:bg-background/90 px-8 py-4 rounded-full text-lg font-bold shadow-xl flex items-center mx-auto gap-2 group cursor-pointer"
              >
                {t("home.ctaBanner.button")}
                <span className="relative flex h-3 w-3 ml-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

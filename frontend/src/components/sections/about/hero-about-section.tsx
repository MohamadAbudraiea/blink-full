import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function HeroAboutSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <section className="relative bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              {t("about.hero.title")}
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {t("about.hero.content")}
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t("about.hero.subtitle")}
            </p>
            <Link
              to="/booking"
              className="bg-primary hover:bg-primary/90 py-3 px-6 rounded-full"
            >
              {t("home.hero.cta")}
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img src="/phone.png" alt="BLINK Mobile App" className="w-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

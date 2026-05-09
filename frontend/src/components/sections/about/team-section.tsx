import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function TeamSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              {t("about.team.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {t("about.team.content1")}
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t("about.team.content2")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img
              src="/t-shirt.png"
              alt="BLINK Team Uniform"
              className="w-full max-w-md mx-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

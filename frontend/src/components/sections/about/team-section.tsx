import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function TeamSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const isRTL = locale === "ar";

  return (
    <section className="py-24 bg-muted/10 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-6">
              {t("about.team.title")}
            </h2>
            <p className="text-3xl md:text-5xl font-black text-foreground mb-8 tracking-tighter italic uppercase">
              Driven by Passion
            </p>
            <div className="space-y-6">
              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                {t("about.team.content1")}
              </p>
              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                {t("about.team.content2")}
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <img
              src="/t-shirt.png"
              alt="BLINK Team Uniform"
              className="relative w-full max-w-md mx-auto drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}


import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function StorySection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const isRTL = locale === "ar";

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`relative group ${isRTL ? "lg:order-2" : ""}`}
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
            <img
              src="/paper.png"
              alt="BLINK Brand Materials"
              className="relative w-full rounded-4xl shadow-2xl border border-border/50"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className={isRTL ? "lg:order-1" : ""}
          >
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-6">
              {t("about.story.title")}
            </h2>
            <p className="text-3xl md:text-5xl font-black text-foreground mb-8 tracking-tighter italic uppercase">
              How It All Started
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              {t("about.story.content")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

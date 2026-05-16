import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Heart, Zap } from "lucide-react";
import { useState } from "react";

export function ValuesSection() {
  const { t } = useTranslation();

  const values = [
    {
      titleKey: "about.values.items.quality.title",
      descriptionKey: "about.values.items.quality.desc",
      icon: ShieldCheck,
      color: "from-cyan-500 to-blue-500",
    },
    {
      titleKey: "about.values.items.customer.title",
      descriptionKey: "about.values.items.customer.desc",
      icon: Heart,
      color: "from-purple-500 to-pink-500",
    },
    {
      titleKey: "about.values.items.innovation.title",
      descriptionKey: "about.values.items.innovation.desc",
      icon: Zap,
      color: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-4">
            {t("about.values.title")}
          </h2>
          <p className="text-3xl md:text-5xl font-black text-foreground max-w-3xl mx-auto tracking-tighter">
            {t("about.values.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <ValueCard key={index} value={value} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueCard({ value }: { value: any }) {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = value.icon;

  return (
    <div
      className="perspective-[1000px] h-[400px] cursor-pointer group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="relative w-full h-full transform-3d"
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-muted/30 rounded-[2.5rem] p-8 flex flex-col items-center justify-center border border-border/50 group-hover:border-primary/50 transition-colors duration-500">
          <div className="relative mb-8">
            {/* Animated Gradient Border */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className={`absolute -inset-3 rounded-full bg-linear-to-r ${value.color} blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-500`}
            />
            <div className="relative w-28 h-28 rounded-full bg-background flex items-center justify-center z-10 border border-border shadow-inner">
              <Icon className="w-12 h-12 text-foreground" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground text-center mb-4">
            {t(value.titleKey)}
          </h3>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-4 text-primary text-[10px] font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity"
          >
            {t("about.values.learn_more")}
          </motion.div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)] bg-primary rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-primary-foreground text-center shadow-2xl shadow-primary/20">
          <Icon className="w-20 h-20 mb-8 opacity-20 absolute top-10" />
          <h3 className="text-2xl font-bold mb-6">{t(value.titleKey)}</h3>
          <p className="text-lg leading-relaxed opacity-90 font-medium">
            {t(value.descriptionKey)}
          </p>
          <div className="mt-8 pt-6 border-t border-white/20 w-full text-[10px] font-bold uppercase tracking-widest opacity-70">
            {t("about.values.back")}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

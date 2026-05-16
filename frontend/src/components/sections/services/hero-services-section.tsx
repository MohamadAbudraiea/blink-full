import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function HeroServicesSection() {
  const { t } = useTranslation();

  const servicesList = [
    t("services.items.wash.title"),
    t("services.items.polish.title"),
    t("services.items.nano.title"),
    t("services.items.graphene.title"),
    t("services.items.dryclean.title")
  ];

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden bg-black">
      {/* Cinematic Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: 'url(/moody_car_hero_bg_1778832658102.png)' }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/40 to-black/90" />
      </motion.div>

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
            className="inline-block px-4 py-1.5 mb-8 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20"
          >
            <span className="text-primary text-xs font-black uppercase tracking-[0.4em]">
              The Blink Standard
            </span>
          </motion.div>
          
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black text-white mb-8 tracking-tighter uppercase italic leading-[0.9]">
            {t("services.hero.title")}
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/60 mb-12 leading-relaxed font-light max-w-3xl mx-auto">
            {t("services.hero.subtitle")}
          </p>
        </motion.div>
      </div>

      {/* Auto-scrolling Marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden w-full bg-white/5 py-6 backdrop-blur-xl border-t border-white/10">
        <motion.div 
          className="flex whitespace-nowrap items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 30 
          }}
        >
          {[...servicesList, ...servicesList, ...servicesList].map((service, index) => (
            <div key={index} className="flex items-center px-12">
              <span className="text-xl font-black text-white/40 tracking-[0.2em] uppercase italic hover:text-primary transition-colors cursor-default">
                {service}
              </span>
              <div className="mx-12 w-2 h-2 rounded-full bg-primary/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

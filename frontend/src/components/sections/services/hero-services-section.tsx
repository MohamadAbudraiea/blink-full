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
      <div 
        className="absolute inset-0 z-0 animate-[kenburns_10s_ease-out_forwards]"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: 'url(/moody_car_hero_bg_1778832658102.png)' }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/40 to-black/90" />
      </div>

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
            className="inline-block px-4 py-1.5 mb-8 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20"
          >
            <span className="text-primary text-xs font-black uppercase tracking-[0.4em]">
              The Blink Standard
            </span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black text-white mb-8 tracking-tighter uppercase italic leading-[0.9]">
            {t("services.hero.title")}
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/60 mb-12 leading-relaxed font-light max-w-3xl mx-auto">
            {t("services.hero.subtitle")}
          </p>
        </div>
      </div>

      {/* Auto-scrolling Marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden w-full bg-white/5 py-6 backdrop-blur-xl border-t border-white/10">
        <div 
          className="flex whitespace-nowrap items-center animate-[marquee_30s_linear_infinite]"
        >
          {[...servicesList, ...servicesList, ...servicesList].map((service, index) => (
            <div key={index} className="flex items-center px-12">
              <span className="text-xl font-black text-white/40 tracking-[0.2em] uppercase italic hover:text-primary transition-colors cursor-default">
                {service}
              </span>
              <div className="mx-12 w-2 h-2 rounded-full bg-primary/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Add custom CSS animations for the marquee and kenburns effect since they were looping/one-off framer-motion animations */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes kenburns {
          0% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </section>
  );
}

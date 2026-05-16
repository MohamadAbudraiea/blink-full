import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Phone, CalendarCheck } from "lucide-react";

export function CtaServicesSection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/15 via-black to-black" />

      {/* Glowing car silhouette effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 opacity-40 pointer-events-none"
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 0.4 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true }}
        style={{
          background:
            "radial-gradient(ellipse at bottom, theme(colors.primary.DEFAULT) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Decorative lines */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGwyMCAyME00MCAwTDIwIDIwTTAgNDBsMjAtMjBNNDAgNDBMMjAgMjAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] mask-[linear-gradient(to_bottom,transparent,black,transparent)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 mb-10 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20"
          >
            <span className="text-primary text-xs font-black uppercase tracking-[0.4em]">
              Ready for Perfection?
            </span>
          </motion.div>

          <h2 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-12 tracking-tighter uppercase italic leading-[0.9] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {t("services.ctaBanner.title")}
          </h2>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-12">
            <Link to="/booking" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 rounded-full text-xl font-black uppercase italic tracking-widest shadow-[0_20px_40px_rgba(var(--primary),0.3)] flex items-center justify-center gap-3 group cursor-pointer"
              >
                <CalendarCheck className="w-6 h-6" />
                {t("services.ctaBanner.book")}
              </motion.button>
            </Link>

            <Link to="/contact" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-white/5 backdrop-blur-md border-2 border-white/10 text-white hover:bg-white/10 hover:border-white/20 px-12 py-6 rounded-full text-xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                <Phone className="w-6 h-6" />
                {t("services.ctaBanner.contact")}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

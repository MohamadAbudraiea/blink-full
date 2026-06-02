import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CalendarCheck, Phone } from "lucide-react";

export function CtaSubscriptionsSection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/15 via-black to-black" />

      {/* Glowing effect */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 opacity-40 pointer-events-none"
        data-aos="fade-up"
        data-aos-duration="1500"
        style={{
          background:
            "radial-gradient(ellipse at bottom, var(--color-primary) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          data-aos="zoom-in"
          data-aos-duration="800"
          className="text-center max-w-4xl mx-auto"
        >
          <div
            data-aos="fade-down"
            data-aos-delay="200"
            className="inline-block px-4 py-1.5 mb-10 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20"
          >
            <span className="text-primary text-xs font-black uppercase tracking-[0.4em]">
              {t("subscriptionsPage.cta.badge")}
            </span>
          </div>

          <h2 className="font-nativera text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-12 tracking-tighter uppercase italic leading-[0.9] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {t("subscriptionsPage.cta.title")}
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Link
              to="/my-bookings?tab=subscriptions"
              className="w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 rounded-full text-lg font-black uppercase italic tracking-widest shadow-[0_20px_40px_rgba(var(--primary),0.3)] flex items-center justify-center gap-3 cursor-pointer transition-transform duration-200 hover:scale-105 hover:-translate-y-1 active:scale-95">
                <CalendarCheck className="w-6 h-6" />
                {t("subscriptionsPage.cta.subscribe_button")}
              </button>
            </Link>

            <Link to="/contact" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white/5 backdrop-blur-md border-2 border-white/10 text-white hover:bg-white/10 hover:border-white/20 px-12 py-6 rounded-full text-lg font-black uppercase italic tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer duration-200 hover:scale-105 hover:-translate-y-1 active:scale-95">
                <Phone className="w-6 h-6" />
                {t("subscriptionsPage.cta.contact_button")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

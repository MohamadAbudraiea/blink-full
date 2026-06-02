import { useCheckAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function NanoCeramicServicePage() {
  const { isAuthenticated, isUser } = useCheckAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const isRTL = locale === "ar";

  const nanoPoints = t("services.items.nano.points", {
    returnObjects: true,
  }) as string[];

  const graphenePoints = t("services.items.graphene.points", {
    returnObjects: true,
  }) as string[];

  const BookButton = () =>
    isAuthenticated ? (
      isUser ? (
        <Link
          to="/booking"
          className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 rounded-full font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          {t("services.book")}
        </Link>
      ) : null
    ) : (
      <Link
        to="/login"
        className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 rounded-full font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
      >
        {t("services.login")}
      </Link>
    );

  return (
    <>
      {/* Immersive Hero — Nano Ceramic */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent z-10" />
          <img
            src="/nano1.webp"
            alt="Nano Ceramic Coating"
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <Link
            to="/services"
            className={`inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 text-sm font-bold uppercase tracking-widest ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("services.back")}</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center mb-8"
            >
              <ShieldCheck className="w-10 h-10 text-primary" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase mb-6">
              {t("services.items.nano.title")}
            </h1>

            <p className="text-xl text-white/60 leading-relaxed font-light mb-10 max-w-xl">
              {t("services.items.nano.description")}
            </p>

            <BookButton />
          </motion.div>
        </div>
      </section>

      {/* Nano Ceramic Features */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-4">
              {t("services.items.nano.title")}
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter italic uppercase">
              Key Benefits
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {nanoPoints.map((point: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-4xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <p className="text-foreground font-medium leading-relaxed">
                  {point}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Graphene Coating Section */}
      <section className="py-24 bg-muted/10 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
              <img
                src="/nano2.webp"
                alt="Graphene Coating"
                className="relative w-full rounded-4xl shadow-2xl border border-border/50"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mb-8"
              >
                <ShieldCheck className="w-8 h-8 text-primary" />
              </motion.div>

              <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-4">
                Advanced Protection
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter italic uppercase mb-8">
                {t("services.items.graphene.title")}
              </h3>

              <p className="text-xl text-muted-foreground leading-relaxed font-light mb-10">
                {t("services.items.graphene.description")}
              </p>

              <ul className="space-y-4 mb-10">
                {graphenePoints.map((point: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              <BookButton />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

export default NanoCeramicServicePage;

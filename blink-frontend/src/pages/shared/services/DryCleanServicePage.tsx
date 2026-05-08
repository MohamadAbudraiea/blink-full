import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCheckAuth } from "@/hooks/useAuth";

export default function DrycleanServicePage() {
  const { isAuthenticated, isUser } = useCheckAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <section className="relative py-20 bg-linear-to-br from-primary/5 via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/services"
          className={`inline-flex items-center text-primary hover:text-primary/80 mb-8 ${
            locale === "ar" ? "space-x-reverse space-x-2" : "space-x-2"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("services.back")}</span>
        </Link>

        {/* Header and main description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <div
              className={`flex items-center ${
                locale === "ar" ? "space-x-reverse space-x-4" : "space-x-4"
              } mb-6`}
            >
              <div className="p-4 rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                {t("services.items.dryclean.title")}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t("services.items.dryclean.description")}
            </p>
            {isAuthenticated ? (
              isUser && (
                <Link
                  to="/booking"
                  className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-full"
                >
                  {t("services.book")}
                </Link>
              )
            ) : (
              <Link
                to="/login"
                className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-full"
              >
                {t("services.login")}
              </Link>
            )}
          </div>

          <div className="relative">
            <img
              src="/dryclean.webp"
              alt="Dryclean Service"
              className="rounded-lg shadow-lg"
            />
          </div>
        </motion.div>

        {/* Service levels */}
        <div className="mt-20 flex flex-col lg:flex-row justify-center gap-8">
          {["premium", "Blink"].map((level, index) => (
            <motion.div
              key={level}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold text-primary mb-2">
                {t(`services.items.dryclean.${level}.title`)}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t(`services.items.dryclean.${level}.desc`)}
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                {(
                  t(`services.items.dryclean.${level}.points`, {
                    returnObjects: true,
                  }) as string[]
                ).map((point: string, i: number) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

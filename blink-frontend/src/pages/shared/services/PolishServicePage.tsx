import { useCheckAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Star, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function PolishServicePage() {
  const { isAuthenticated, isUser } = useCheckAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const stages = [
    {
      title: t("services.items.polish.one_stage.title"),
      points: t("services.items.polish.one_stage.points", {
        returnObjects: true,
      }) as string[],
    },
    {
      title: t("services.items.polish.three_stage.title"),
      points: t("services.items.polish.three_stage.points", {
        returnObjects: true,
      }) as string[],
    },
  ];

  return (
    <section className="relative py-20 bg-linear-to-br from-primary/5 via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/services"
          className={`inline-flex items-center text-primary hover:text-primary/80 mb-8 ${
            locale === "ar" ? "space-x-reverse space-x-2" : "space-x-2"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("services.back")}</span>
        </Link>

        {/* Hero section */}
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
                <Star className="h-8 w-8 text-primary" />
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                {t("services.items.polish.title")}
              </h1>
            </div>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t("services.items.polish.description")}
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
              src="/graphene1.jpeg"
              alt={t("services.items.polish.title")}
              className="rounded-lg shadow-lg"
            />
          </div>
        </motion.div>

        {/* Stages Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 flex flex-col lg:flex-row justify-center w-full gap-8"
        >
          {stages.map((stage, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-6 bg-white/70 w-full dark:bg-card backdrop-blur-md shadow-lg rounded-2xl border border-border"
            >
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-semibold text-primary">
                  {stage.title}
                </h2>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                {stage.points.map((point, i) => (
                  <li key={i} className="leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200, duration: 0.6 }}
          className="bg-muted/40 rounded-2xl shadow-sm p-8 mt-5"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {t("services.items.polish.Conclusion.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("services.items.polish.Conclusion.description")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default PolishServicePage;

import { useCheckAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function NanoCeramicServicePage() {
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

        {/* Nano Ceramic Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <div
              className={`flex items-center ${
                locale === "ar" ? "space-x-reverse space-x-4" : "space-x-4"
              } mb-6`}
            >
              <div className="p-4 rounded-full bg-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                {t("services.items.nano.title")}
              </h2>
            </div>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {t("services.items.nano.description")}
            </p>
            <ul className="space-y-2 text-muted-foreground mb-8">
              {(
                t("services.items.nano.points", {
                  returnObjects: true,
                }) as string[]
              ).map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
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
              alt="Nano Ceramic Coating"
              className="rounded-lg shadow-lg"
            />
          </div>
        </motion.div>

        {/* Graphene Coating Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="relative lg:order-1">
            <img
              src="/graphene2.jpeg"
              alt="Graphene Coating"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="lg:order-2">
            <div
              className={`flex items-center ${
                locale === "ar" ? "space-x-reverse space-x-4" : "space-x-4"
              } mb-6`}
            >
              <div className="p-4 rounded-full bg-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                {t("services.items.graphene.title")}
              </h2>
            </div>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {t("services.items.graphene.description")}
            </p>
            <ul className="space-y-2 text-muted-foreground mb-8">
              {(
                t("services.items.graphene.points", {
                  returnObjects: true,
                }) as string[]
              ).map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
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
        </motion.div>
      </div>
    </section>
  );
}

export default NanoCeramicServicePage;

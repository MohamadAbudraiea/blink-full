import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Sparkles,
  Star,
  CheckCircle,
  Droplets,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const services = [
    {
      icon: Droplets,
      titleKey: "services.items.wash.title",
      descriptionKey: "services.items.wash.description",
      featuresKey: "services.items.wash.features",
      href: "/services/wash",
    },
    {
      icon: Sparkles,
      titleKey: "services.items.dryclean.title",
      descriptionKey: "services.items.dryclean.description",
      featuresKey: "services.items.dryclean.features",
      href: "/services/dryclean",
    },
    {
      icon: Star,
      titleKey: "services.items.polish.title",
      descriptionKey: "services.items.polish.description",
      featuresKey: "services.items.polish.features",
      href: "/services/polish",
    },
    {
      icon: ShieldCheck,
      titleKey: "services.items.nano.title",
      descriptionKey: "services.items.nano.description",
      featuresKey: "services.items.nano.features",
      href: "/services/nano-ceramic",
    },
  ];

  // Function to split features based on language
  const splitFeatures = (featuresString: string) => {
    if (locale === "ar") {
      // For Arabic, split by Arabic comma (،) followed by optional space
      return featuresString.split(/،\s*/);
    } else {
      // For English and other languages, split by comma followed by space
      return featuresString.split(", ");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              {t("services.hero.title")}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t("services.hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 relative">
                  <CardHeader>
                    <div
                      className={`flex items-center ${
                        locale === "ar"
                          ? "space-x-reverse space-x-4"
                          : "space-x-4"
                      } mb-4`}
                    >
                      <div className="p-3 rounded-full bg-primary/10">
                        <service.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">
                          {t(service.titleKey)}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {t(service.descriptionKey)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {splitFeatures(t(service.featuresKey)).map(
                        (feature: string, featureIndex: number) => (
                          <div
                            key={featureIndex}
                            className={`flex items-center ${
                              locale === "ar"
                                ? "space-x-reverse space-x-2"
                                : "space-x-2"
                            }`}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {feature.trim()}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    <Link to={service.href}>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        {t("services.see_more")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t("services.cta.title")}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t("services.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                <Link to="/booking">{t("services.book")}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
              >
                <Link to="/contact">{t("services.contact")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

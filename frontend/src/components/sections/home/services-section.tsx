import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  // Car,
  Sparkles,
  // Shield,
  // Zap,
  Droplets,
  // Shirt,
  Star,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function ServicesSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const services = [
    {
      icon: Droplets, // WashingMachine, Car
      titleKey: "home.services.items.wash.title",
      descriptionKey: "home.services.items.wash.description",
      href: "/services/wash",
    },
    {
      icon: Sparkles, // Shirt
      titleKey: "home.services.items.dryclean.title",
      descriptionKey: "home.services.items.dryclean.description",
      href: "/services/dryclean",
    },
    {
      icon: Star, // Shield
      titleKey: "home.services.items.polish.title",
      descriptionKey: "home.services.items.polish.description",
      href: "/services/polish",
    },
    {
      icon: ShieldCheck, // Zap
      titleKey: "home.services.items.nano.title",
      descriptionKey: "home.services.items.nano.description",
      href: "/services/nano-ceramic",
    },
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t("home.services.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.services.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader
                  className={`flex ${
                    locale === "ar" ? "flex-row-reverse" : "flex-row"
                  } items-center space-y-0 ${
                    locale === "ar" ? "space-x-reverse space-x-4" : "space-x-4"
                  } pb-4`}
                >
                  <div className="p-3 rounded-full bg-primary/10 shrink-0">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {t(service.titleKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="mb-6 flex-1">
                    {t(service.descriptionKey)}
                  </CardDescription>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => (window.location.href = service.href)}
                  >
                    {t("services.see_more")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Home, Search, AlertCircle, Navigation, Compass } from "lucide-react";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="relative">
                <div className="text-9xl font-bold text-primary opacity-20">
                  404
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 bg-destructive/10 rounded-full">
                    <AlertCircle className="h-16 w-16 text-destructive" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {t("notfound.title")}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t("notfound.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Home className="h-4 w-4 mr-2" />
                    {t("notfound.actions.home")}
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    {t("notfound.actions.services")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t("notfound.help.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("notfound.help.description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, color: "text-blue-500" },
              { icon: Navigation, color: "text-green-500" },
              { icon: Compass, color: "text-purple-500" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 text-center">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-full ${item.color}/10`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {t(`notfound.help.items.${index}.title`)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(`notfound.help.items.${index}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
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
              {t("notfound.contact.title")}
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {t("notfound.contact.description")}
            </p>
            <Link to="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                {t("notfound.contact.cta")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

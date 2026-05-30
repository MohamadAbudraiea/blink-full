import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Home, Search, AlertCircle, Navigation, Compass } from "lucide-react";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div data-aos="zoom-in" data-aos-duration="600" className="mb-8">
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
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="600"
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
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            data-aos="fade-up"
            data-aos-duration="600"
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t("notfound.help.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("notfound.help.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, color: "text-blue-500" },
              { icon: Navigation, color: "text-green-500" },
              { icon: Compass, color: "text-purple-500" },
            ].map((item, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-duration="600"
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            data-aos="fade-up"
            data-aos-duration="600"
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
          </div>
        </div>
      </section>
    </>
  );
}

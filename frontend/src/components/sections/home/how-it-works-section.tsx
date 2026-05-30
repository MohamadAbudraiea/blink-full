import { useTranslation } from "react-i18next";
import { CalendarCheck, MapPin, Sparkles } from "lucide-react";

export function HowItWorksSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const steps = [
    {
      icon: CalendarCheck,
      titleKey: "home.howItWorks.steps.book.title",
      descriptionKey: "home.howItWorks.steps.book.description",
    },
    {
      icon: MapPin,
      titleKey: "home.howItWorks.steps.location.title",
      descriptionKey: "home.howItWorks.steps.location.description",
    },
    {
      icon: Sparkles,
      titleKey: "home.howItWorks.steps.shine.title",
      descriptionKey: "home.howItWorks.steps.shine.description",
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          data-aos="fade-up"
          data-aos-duration="600"
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("home.howItWorks.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.howItWorks.subtitle")}
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div
            className={`hidden md:block absolute top-12 ${locale === "ar" ? "right-[15%] left-[15%]" : "left-[15%] right-[15%]"} h-0.5 bg-linear-to-r from-transparent via-border to-transparent`}
          />

          {/* Animated Dash Line */}
          <div
            className={`hidden md:block absolute top-12 ${locale === "ar" ? "right-[15%] left-[15%]" : "left-[15%] right-[15%]"} h-0.5 bg-primary`}
            data-aos="scale-x"
            data-aos-duration="1500"
            style={{ transformOrigin: locale === "ar" ? "right" : "left" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 200}
                  data-aos-duration="600"
                  className="relative text-center"
                >
                  {/* Floating Icon Container */}
                  <div
                    className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-card border border-border flex items-center justify-center relative z-10 shadow-lg animate-float-gentle"
                    style={{ animationDelay: `${index * 0.5}s`, animationDuration: "4s" }}
                  >
                    <div className="absolute inset-0 bg-primary/10 rounded-2xl animate-pulse" />
                    <Icon className="w-10 h-10 text-primary" />

                    {/* Step Number Badge */}
                    <div
                      className={`absolute -top-3 ${locale === "ar" ? "-left-3" : "-right-3"} w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-md`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                    {t(step.descriptionKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

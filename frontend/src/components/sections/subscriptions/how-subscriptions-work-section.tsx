import { useTranslation } from "react-i18next";
import { ClipboardList, Palette, CalendarCheck, Sparkles } from "lucide-react";

export function HowSubscriptionsWorkSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const steps = [
    {
      icon: ClipboardList,
      titleKey: "subscriptionsPage.howItWorks.steps.choose.title",
      descriptionKey: "subscriptionsPage.howItWorks.steps.choose.description",
    },
    {
      icon: Palette,
      titleKey: "subscriptionsPage.howItWorks.steps.customize.title",
      descriptionKey:
        "subscriptionsPage.howItWorks.steps.customize.description",
    },
    {
      icon: CalendarCheck,
      titleKey: "subscriptionsPage.howItWorks.steps.schedule.title",
      descriptionKey:
        "subscriptionsPage.howItWorks.steps.schedule.description",
    },
    {
      icon: Sparkles,
      titleKey: "subscriptionsPage.howItWorks.steps.enjoy.title",
      descriptionKey: "subscriptionsPage.howItWorks.steps.enjoy.description",
    },
  ];

  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          data-aos="fade-up"
          data-aos-duration="600"
          className="text-center mb-16"
        >
          <h2 className="font-nativera text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 tracking-tighter uppercase italic">
            {t("subscriptionsPage.howItWorks.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            {t("subscriptionsPage.howItWorks.subtitle")}
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div
            className={`hidden md:block absolute top-16 ${locale === "ar" ? "right-[10%] left-[10%]" : "left-[10%] right-[10%]"} h-0.5 bg-linear-to-r from-transparent via-border to-transparent`}
          />
          <div
            className={`hidden md:block absolute top-16 ${locale === "ar" ? "right-[10%] left-[10%]" : "left-[10%] right-[10%]"} h-0.5 bg-primary origin-left`}
            data-aos="scale-x"
            data-aos-duration="2000"
            style={{
              transformOrigin: locale === "ar" ? "right" : "left",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                  data-aos-duration="600"
                  className="relative text-center"
                >
                  <div
                    className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 rounded-2xl bg-card border border-border flex items-center justify-center relative z-10 shadow-lg animate-[float-gentle_4s_ease-in-out_infinite]"
                    style={{ animationDelay: `${index * 0.4}s` }}
                  >
                    <div className="absolute inset-0 bg-primary/10 rounded-2xl animate-pulse" />
                    <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-primary" />
                    <div
                      className={`absolute -top-3 ${locale === "ar" ? "-left-3" : "-right-3"} w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-md text-sm`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[220px] mx-auto">
                    {t(step.descriptionKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`
        [data-aos="scale-x"] {
          transform: scaleX(0);
          transition-property: transform;
        }
        [data-aos="scale-x"].aos-animate {
          transform: scaleX(1);
        }
      `}</style>
    </section>
  );
}

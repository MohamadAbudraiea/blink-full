import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Zap,
  Crown,
  Gem,
  Check,
  ArrowRight,
  Star,
  Sparkles,
} from "lucide-react";

export function PlansDetailSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const plans = [
    {
      icon: Zap,
      count: 2,
      titleKey: "home.subscriptions.plans.starter.title",
      descriptionKey: "subscriptionsPage.plans.starter.longDescription",
      featuresKeys: [
        "subscriptionsPage.plans.starter.details.0",
        "subscriptionsPage.plans.starter.details.1",
        "subscriptionsPage.plans.starter.details.2",
        "subscriptionsPage.plans.starter.details.3",
        "subscriptionsPage.plans.starter.details.4",
        "subscriptionsPage.plans.starter.details.5",
      ],
      gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
      borderColor: "border-cyan-500/30",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
      glowColor: "shadow-cyan-500/10",
      popular: false,
    },
    {
      icon: Crown,
      count: 4,
      titleKey: "home.subscriptions.plans.pro.title",
      descriptionKey: "subscriptionsPage.plans.pro.longDescription",
      featuresKeys: [
        "subscriptionsPage.plans.pro.details.0",
        "subscriptionsPage.plans.pro.details.1",
        "subscriptionsPage.plans.pro.details.2",
        "subscriptionsPage.plans.pro.details.3",
        "subscriptionsPage.plans.pro.details.4",
        "subscriptionsPage.plans.pro.details.5",
        "subscriptionsPage.plans.pro.details.6",
      ],
      gradient: "from-primary/25 via-primary/10 to-transparent",
      borderColor: "border-primary/40",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
      glowColor: "shadow-primary/15",
      popular: true,
    },
    {
      icon: Gem,
      count: 8,
      titleKey: "home.subscriptions.plans.elite.title",
      descriptionKey: "subscriptionsPage.plans.elite.longDescription",
      featuresKeys: [
        "subscriptionsPage.plans.elite.details.0",
        "subscriptionsPage.plans.elite.details.1",
        "subscriptionsPage.plans.elite.details.2",
        "subscriptionsPage.plans.elite.details.3",
        "subscriptionsPage.plans.elite.details.4",
        "subscriptionsPage.plans.elite.details.5",
        "subscriptionsPage.plans.elite.details.6",
        "subscriptionsPage.plans.elite.details.7",
      ],
      gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
      borderColor: "border-violet-500/30",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
      glowColor: "shadow-violet-500/10",
      popular: false,
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-[120px] -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/3 rounded-full blur-[120px] translate-x-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div
          data-aos="fade-up"
          data-aos-duration="600"
          className="text-center mb-20"
        >
          <p
            data-aos="fade"
            className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-4"
          >
            {t("subscriptionsPage.plans.badge")}
          </p>
          <h2 className="font-nativera text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tighter uppercase italic">
            {t("subscriptionsPage.plans.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            {t("subscriptionsPage.plans.subtitle")}
          </p>
        </div>

        {/* Plans */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={plan.count}
                data-aos={
                  isEven
                    ? isRTL
                      ? "fade-right"
                      : "fade-left"
                    : isRTL
                      ? "fade-left"
                      : "fade-right"
                }
                data-aos-duration="700"
                data-aos-delay="100"
                className="group"
              >
                <div
                  className={`relative rounded-3xl border ${plan.borderColor} bg-card overflow-hidden transition-all duration-500 hover:shadow-2xl ${plan.glowColor}`}
                >
                  {/* Popular ribbon */}
                  {plan.popular && (
                    <div className="absolute top-0 right-0 z-20">
                      <div className="bg-primary text-primary-foreground px-6 py-2 font-black text-xs uppercase tracking-wider rounded-bl-2xl flex items-center gap-1.5 shadow-lg">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {t("home.subscriptions.popular")}
                      </div>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${plan.gradient} opacity-50`}
                  />

                  <div className="relative z-10 p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                      {/* Left side — Plan info */}
                      <div className="lg:w-2/5 flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                          <div
                            className={`p-4 rounded-2xl ${plan.iconBg} border border-white/5 transition-transform duration-300 hover:rotate-12 hover:scale-110`}
                          >
                            <Icon className={`w-8 h-8 ${plan.iconColor}`} />
                          </div>
                          <div>
                            <h3 className="text-3xl font-black text-foreground tracking-tight">
                              {t(plan.titleKey)}
                            </h3>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span
                                className={`text-4xl font-black ${plan.iconColor}`}
                              >
                                {plan.count}
                              </span>
                              <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                {t("home.subscriptions.services_label")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed mb-8 font-light">
                          {t(plan.descriptionKey)}
                        </p>

                        <Link
                          to="/my-bookings?tab=subscriptions"
                          className="mt-auto"
                        >
                          <button
                            className={`w-full lg:w-auto px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                              plan.popular
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40"
                                : "bg-muted/50 text-foreground hover:bg-primary/10 border border-border hover:border-primary/30"
                            }`}
                          >
                            {t("home.subscriptions.cta")}
                            <ArrowRight
                              className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180" : ""}`}
                            />
                          </button>
                        </Link>
                      </div>

                      {/* Right side — Features grid */}
                      <div className="lg:w-3/5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {plan.featuresKeys.map((featureKey, fi) => (
                            <div
                              key={fi}
                              data-aos="fade-up"
                              data-aos-delay={200 + fi * 60}
                              className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border/30 hover:border-primary/20 transition-colors"
                            >
                              <div
                                className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${plan.iconBg}`}
                              >
                                <Check
                                  className={`w-3.5 h-3.5 ${plan.iconColor}`}
                                />
                              </div>
                              <span className="text-sm text-foreground/80 leading-relaxed">
                                {t(featureKey)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flexibility note */}
        <div
          data-aos="fade-up"
          data-aos-delay="400"
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-muted/30 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground font-medium">
              {t("subscriptionsPage.plans.flexibility_note")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

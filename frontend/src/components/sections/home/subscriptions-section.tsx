import { useMotionValue, useTransform, animate } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Zap,
  Crown,
  Gem,
  Check,
  ArrowRight,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Animated counter component
function AnimatedCounter({ target }: { target: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
    return unsubscribe;
  }, [rounded]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate(count, target, { duration: 1.5, ease: "easeOut" });
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [count, target]);

  return <span ref={ref}>{displayValue}</span>;
}

// Floating particles
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float-particle"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3 + i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

export function SubscriptionsSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const plans = [
    {
      icon: Zap,
      count: 2,
      titleKey: "home.subscriptions.plans.starter.title",
      descriptionKey: "home.subscriptions.plans.starter.description",
      featuresKeys: [
        "home.subscriptions.plans.starter.features.0",
        "home.subscriptions.plans.starter.features.1",
        "home.subscriptions.plans.starter.features.2",
        "home.subscriptions.plans.starter.features.3",
      ],
      gradient: "from-cyan-500/20 via-primary/10 to-transparent",
      borderGlow: "group-hover:shadow-cyan-500/20",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
      popular: false,
    },
    {
      icon: Crown,
      count: 4,
      titleKey: "home.subscriptions.plans.pro.title",
      descriptionKey: "home.subscriptions.plans.pro.description",
      featuresKeys: [
        "home.subscriptions.plans.pro.features.0",
        "home.subscriptions.plans.pro.features.1",
        "home.subscriptions.plans.pro.features.2",
        "home.subscriptions.plans.pro.features.3",
        "home.subscriptions.plans.pro.features.4",
      ],
      gradient: "from-primary/30 via-primary/15 to-transparent",
      borderGlow: "group-hover:shadow-primary/30",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
      popular: true,
    },
    {
      icon: Gem,
      count: 8,
      titleKey: "home.subscriptions.plans.elite.title",
      descriptionKey: "home.subscriptions.plans.elite.description",
      featuresKeys: [
        "home.subscriptions.plans.elite.features.0",
        "home.subscriptions.plans.elite.features.1",
        "home.subscriptions.plans.elite.features.2",
        "home.subscriptions.plans.elite.features.3",
        "home.subscriptions.plans.elite.features.4",
        "home.subscriptions.plans.elite.features.5",
      ],
      gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
      borderGlow: "group-hover:shadow-violet-500/20",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
      popular: false,
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[120px]" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-[80px]" />

      <FloatingParticles />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div
          data-aos="fade-up"
          data-aos-duration="600"
          className="text-center mb-20"
        >
          <div
            data-aos="zoom-in"
            data-aos-duration="500"
            className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-5 py-2 rounded-full mb-6 border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs">
              {t("home.subscriptions.badge")}
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tighter uppercase italic">
            {t("home.subscriptions.title")}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            {t("home.subscriptions.description")}
          </p>
        </div>

        {/* Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.count}
                data-aos="fade-up"
                data-aos-delay={index * 150}
                data-aos-duration="600"
                className={`group relative ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div
                    data-aos="fade-down"
                    data-aos-delay="500"
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                  >
                    <div className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/30">
                      <Star className="w-3 h-3 fill-current" />
                      {t("home.subscriptions.popular")}
                    </div>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`relative h-full rounded-3xl border backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] ${
                    plan.popular
                      ? "border-primary/40 bg-card shadow-2xl shadow-primary/10"
                      : "border-border/50 bg-card/80 hover:border-primary/30 shadow-lg"
                  } ${plan.borderGlow} group-hover:shadow-2xl`}
                >
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-linear-to-b ${plan.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                  />

                  {/* Animated border glow for popular */}
                  {plan.popular && (
                    <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-primary/0 via-primary/20 to-primary/0 opacity-50 animate-pulse" />
                  )}

                  <div className="relative z-10 p-8 lg:p-10 flex flex-col h-full">
                    {/* Icon + Service Count */}
                    <div className="flex items-start justify-between mb-8">
                      <div
                        className={`p-4 rounded-2xl ${plan.iconBg} backdrop-blur-sm border border-white/5 animate-icon-wobble`}
                        style={{ animationDelay: `${index * 0.5}s` }}
                      >
                        <Icon className={`w-7 h-7 ${plan.iconColor}`} />
                      </div>

                      {/* Animated number */}
                      <div className="text-right">
                        <div
                          className={`text-5xl font-black ${plan.iconColor} tracking-tighter`}
                        >
                          <AnimatedCounter target={plan.count} />
                        </div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
                          {t("home.subscriptions.services_label")}
                        </p>
                      </div>
                    </div>

                    {/* Title & description */}
                    <h3 className="text-2xl lg:text-3xl font-black text-foreground mb-3 tracking-tight">
                      {t(plan.titleKey)}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-light">
                      {t(plan.descriptionKey)}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-10 grow">
                      {plan.featuresKeys.map((featureKey, fi) => (
                        <li
                          key={fi}
                          data-aos={isRTL ? "fade-right" : "fade-left"}
                          data-aos-delay={300 + fi * 80}
                          className="flex items-start gap-3"
                        >
                          <div
                            className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.iconBg}`}
                          >
                            <Check className={`w-3 h-3 ${plan.iconColor}`} />
                          </div>
                          <span className="text-sm text-foreground/80">
                            {t(featureKey)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link to="/my-bookings?tab=subscriptions">
                      <button
                        className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                          plan.popular
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40"
                            : "bg-muted/50 text-foreground hover:bg-primary/10 border border-border hover:border-primary/30"
                        }`}
                      >
                        {t("home.subscriptions.cta")}
                        <ArrowRight
                          className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`}
                        />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <p
          data-aos="fade"
          data-aos-delay="800"
          className="text-center text-muted-foreground text-sm mt-12 font-light"
        >
          {t("home.subscriptions.note")}
        </p>
      </div>
    </section>
  );
}

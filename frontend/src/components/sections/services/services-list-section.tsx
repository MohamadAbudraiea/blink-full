import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

export function ServicesListSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const isRTL = locale === "ar";

  const services = [
    {
      id: "wash",
      titleKey: "services.items.wash.title",
      descriptionKey: "services.items.wash.description",
      featuresKey: "services.items.wash.features",
      href: "/services/wash",
      bgImage: "/wash-service1.jpg",
    },
    {
      id: "dryclean",
      titleKey: "services.items.dryclean.title",
      descriptionKey: "services.items.dryclean.description",
      featuresKey: "services.items.dryclean.features",
      href: "/services/dryclean",
      bgImage: "/drycleaning-service.jpg",
    },
    {
      id: "polish",
      titleKey: "services.items.polish.title",
      descriptionKey: "services.items.polish.description",
      featuresKey: "services.items.polish.features",
      href: "/services/polish",
      bgImage: "/polishing-service.jpg",
    },
    {
      id: "nano",
      titleKey: "services.items.nano.title",
      descriptionKey: "services.items.nano.description",
      featuresKey: "services.items.nano.features",
      href: "/services/nano-ceramic",
      bgImage: "/nano-ceramic-graphene-service.jpg",
    },
  ];

  const splitFeatures = (featuresString: string) => {
    if (isRTL) {
      return featuresString.split(/،\s*/);
    } else {
      return featuresString.split(", ");
    }
  };

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          const features = splitFeatures(t(service.featuresKey));

          return (
            <div
              key={service.id}
              className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 lg:gap-24 items-center`}
              data-aos="fade-up"
              data-aos-duration="800"
            >
              {/* Image Side */}
              <div
                className="w-full lg:w-1/2 group relative"
                data-aos="zoom-in"
                data-aos-delay="200"
                data-aos-duration="800"
              >
                <div className="absolute -inset-4 bg-primary/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative h-[450px] lg:h-[600px] rounded-4xl overflow-hidden shadow-2xl border border-white/10">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: `url(${service.bgImage})` }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                  {/* Floating Badge */}
                  <div
                    className={`absolute top-8 ${isRTL ? "left-8" : "right-8"} px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20`}
                  >
                    <span className="text-white text-xs font-black uppercase tracking-widest">
                      Premium Quality
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div
                  data-aos={isRTL ? "fade-right" : "fade-left"}
                  data-aos-duration="800"
                >
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tighter uppercase italic mb-6">
                    {t(service.titleKey)}
                  </h2>

                  <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
                    {t(service.descriptionKey)}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                  {features.map((feature: string, featureIndex: number) => (
                    <div
                      key={featureIndex}
                      data-aos="fade-up"
                      data-aos-delay={400 + featureIndex * 100}
                      className="flex items-center gap-4 group/item"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-all duration-300">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-foreground font-medium tracking-tight">
                        {feature.trim()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <Link to={service.href}>
                    <button
                      className={`group flex items-center gap-4 bg-primary text-primary-foreground px-10 py-5 rounded-full font-black uppercase italic tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-transform duration-300 hover:scale-105 active:scale-95 ${isRTL ? "hover:-translate-x-2" : "hover:translate-x-2"}`}
                    >
                      {t("services.see_more")}
                      <ArrowRight
                        className={`w-6 h-6 transition-transform group-hover:translate-x-2 ${isRTL ? "rotate-180 group-hover:-translate-x-2" : ""}`}
                      />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

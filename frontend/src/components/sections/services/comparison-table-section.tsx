import { useTranslation } from "react-i18next";
import { Check, Minus } from "lucide-react";

export function ComparisonTableSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const services = [
    { id: "wash", key: "services.comparison.services.wash" },
    { id: "dryclean", key: "services.comparison.services.dryclean" },
    { id: "polish", key: "services.comparison.services.polish", highlight: true },
    { id: "nano", key: "services.comparison.services.nano" },
  ];

  const features = [
    {
      nameKey: "services.comparison.features.exterior",
      values: ["services.comparison.values.yes", "services.comparison.values.no", "services.comparison.values.yes", "services.comparison.values.yes"]
    },
    {
      nameKey: "services.comparison.features.interior",
      values: ["services.comparison.values.yes", "services.comparison.values.yes", "services.comparison.values.no", "services.comparison.values.yes"]
    },
    {
      nameKey: "services.comparison.features.stains",
      values: ["services.comparison.values.no", "services.comparison.values.yes", "services.comparison.values.no", "services.comparison.values.no"]
    },
    {
      nameKey: "services.comparison.features.correction",
      values: ["services.comparison.values.no", "services.comparison.values.no", "services.comparison.values.yes", "services.comparison.values.no"]
    },
    {
      nameKey: "services.comparison.features.hydrophobic",
      values: ["services.comparison.values.no", "services.comparison.values.no", "services.comparison.values.no", "services.comparison.values.yes"]
    },
    {
      nameKey: "services.comparison.features.duration",
      values: ["services.comparison.values.duration_wash", "services.comparison.values.duration_na", "services.comparison.values.duration_polish", "services.comparison.values.duration_nano"]
    },
    {
      nameKey: "services.comparison.features.time",
      values: ["services.comparison.values.time_wash", "services.comparison.values.time_dryclean", "services.comparison.values.time_polish", "services.comparison.values.time_nano"]
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          data-aos="fade-up"
          data-aos-duration="600"
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("services.comparison.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("services.comparison.subtitle")}
          </p>
        </div>

        <div className="overflow-x-auto pb-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <table className="w-full min-w-[800px] border-collapse relative">
            <thead className="sticky top-0 z-10 bg-muted/30 backdrop-blur-md">
              <tr>
                <th className="p-4 text-left border-b border-border bg-transparent"></th>
                {services.map((service, idx) => (
                  <th key={idx} className={`p-4 text-center border-b border-border relative ${service.highlight ? 'bg-primary/5' : ''}`}>
                    {service.highlight && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        {t("services.comparison.popular")}
                      </div>
                    )}
                    <span className={`block text-lg font-bold mt-2 ${service.highlight ? 'text-primary' : 'text-foreground'}`}>
                      {t(service.key)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr 
                  key={idx}
                  data-aos="fade-up"
                  data-aos-duration="300"
                  data-aos-delay={idx * 50}
                  className="hover:bg-muted/50 transition-colors border-b border-border/50"
                >
                  <td className="p-4 font-medium text-foreground text-sm lg:text-base text-start">
                    {t(feature.nameKey)}
                  </td>
                  {feature.values.map((valKey, valIdx) => {
                    const val = t(valKey);
                    const isYes = valKey === "services.comparison.values.yes";
                    const isNo = valKey === "services.comparison.values.no";
                    
                    return (
                      <td key={valIdx} className={`p-4 text-center ${services[valIdx].highlight ? 'bg-primary/5' : ''}`}>
                        {isYes ? (
                          <Check className="h-5 w-5 mx-auto text-primary" />
                        ) : isNo ? (
                          <Minus className="h-5 w-5 mx-auto text-muted-foreground/50" />
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground">{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

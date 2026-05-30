import { useTranslation } from "react-i18next";

export function StorySection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const isRTL = locale === "ar";

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div
            data-aos={isRTL ? "fade-left" : "fade-right"}
            data-aos-duration="800"
            className={`relative group ${isRTL ? "lg:order-2" : ""}`}
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
            <img
              src="/paper.png"
              alt="BLINK Brand Materials"
              className="relative w-full rounded-4xl shadow-2xl border border-border/50"
            />
          </div>
          <div
            data-aos={isRTL ? "fade-right" : "fade-left"}
            data-aos-duration="800"
            data-aos-delay="200"
            className={isRTL ? "lg:order-1" : ""}
          >
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-6">
              {t("about.story.title")}
            </h2>
            <p className="text-3xl md:text-5xl font-black text-foreground mb-8 tracking-tighter italic uppercase">
              How It All Started
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              {t("about.story.content")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

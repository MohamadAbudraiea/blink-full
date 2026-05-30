import {
  Droplets,
  Sparkles,
  Star,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export function ServicesSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const isRTL = locale === "ar";

  const services = [
    {
      icon: Droplets,
      titleKey: "home.services.items.wash.title",
      descriptionKey: "home.services.items.wash.description",
      href: "/services/wash",
      bgImage: "/wash-service1.jpg",
    },
    {
      icon: Sparkles,
      titleKey: "home.services.items.dryclean.title",
      descriptionKey: "home.services.items.dryclean.description",
      href: "/services/dryclean",
      bgImage: "/drycleaning-service.jpg",
    },
    {
      icon: Star,
      titleKey: "home.services.items.polish.title",
      descriptionKey: "home.services.items.polish.description",
      href: "/services/polish",
      bgImage: "/polishing-service.jpg",
    },
    {
      icon: ShieldCheck,
      titleKey: "home.services.items.nano.title",
      descriptionKey: "home.services.items.nano.description",
      href: "/services/nano-ceramic",
      bgImage: "/nano-ceramic-graphene-service.jpg",
    },
  ];

  const ServiceCard = ({ service, index }: { service: any; index: number }) => {
    const Icon = service.icon;
    return (
      <div
        data-aos="fade-up"
        data-aos-delay={index * 100}
        data-aos-duration="600"
        className="group relative h-[450px] md:h-[400px] rounded-4xl overflow-hidden cursor-pointer shadow-lg"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${service.bgImage})` }}
        />

        {/* Dark Overlay - Lifts on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-60" />

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="transform transition-transform duration-500 group-hover:-translate-y-6">
            <div className="p-4 rounded-2xl bg-primary/20 backdrop-blur-md w-fit mb-6 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground border border-primary/20">
              <Icon className="h-6 w-6" />
            </div>

            <h3 className="text-3xl font-black text-foreground mb-3 tracking-tighter uppercase italic drop-shadow-md">
              {t(service.titleKey)}
            </h3>

            <p className="text-muted-foreground text-base line-clamp-3 transition-all duration-500 group-hover:text-foreground/90 font-light">
              {t(service.descriptionKey)}
            </p>
          </div>

          {/* Learn More Button - Slides in on hover */}
          <div className="absolute bottom-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <Link
              to={service.href}
              className="flex items-center gap-2 bg-primary/10 backdrop-blur-md px-6 py-2 rounded-full text-primary font-black uppercase italic text-xs tracking-widest border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all"
            >
              {t("home.services.see_more")}
              <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          data-aos="fade-up"
          data-aos-duration="600"
          className="text-center mb-20"
        >
          <p
            data-aos="fade"
            className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-4"
          >
            Excellence in Motion
          </p>
          <h2 className="text-5xl sm:text-6xl font-black text-foreground mb-6 tracking-tighter uppercase italic">
            {t("home.services.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            {t("home.services.description")}
          </p>
        </div>

        {/* Mobile Carousel (Swiper) */}
        <div className="block lg:hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.1}
            centeredSlides={true}
            loop={services.length > 3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            dir="ltr"
            className="pb-12 overflow-visible!"
          >
            {services.map((service, index) => (
              <SwiperSlide key={service.titleKey}>
                <ServiceCard service={service} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.titleKey}
              service={service}
              index={index}
            />
          ))}
        </div>
      </div>

      <style>{`
        .swiper-pagination-bullet {
          background: var(--primary);
          opacity: 0.3;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          width: 24px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
      `}</style>
    </section>
  );
}

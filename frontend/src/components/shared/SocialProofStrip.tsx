import { useTranslation } from "react-i18next";
import { Instagram, Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Ahmad S.",
    text: "The best detailing service in Amman. My car looks brand new!",
    rating: 5,
  },
  {
    name: "Laila R.",
    text: "Amazing attention to detail and very professional team.",
    rating: 5,
  },
  {
    name: "Omar K.",
    text: "Fast, reliable, and high quality. Highly recommended!",
    rating: 5,
  },
];

export function SocialProofStrip() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Reviews Slider/Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                className="bg-muted/30 p-8 rounded-4xl border border-border/50 relative group"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-foreground/80 font-medium mb-6 italic">
                  "{review.text}"
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  — {review.name}
                </p>
              </div>
            ))}
          </div>

          {/* Social CTA */}
          <div className="lg:w-1/3 text-center lg:text-left">
            <div
              data-aos="fade-left"
              data-aos-duration="600"
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-pink-500/10 text-pink-500 rounded-full text-xs font-bold uppercase tracking-widest">
                <Instagram className="w-4 h-4" />
                Live on Instagram
              </div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-foreground">
                {t("contact.social.title")}
              </h3>
              <p className="text-muted-foreground text-lg">
                Join our community of car enthusiasts and see our latest
                transformations.
              </p>
              <a
                href="https://www.instagram.com/blinkcar_?igsh=amQxZDBtazhhcXN3"
                target="_blank"
                className="inline-flex items-center gap-3 bg-linear-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-pink-500/20"
              >
                {t("contact.social.cta")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { useCheckAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export function HeroSection() {
  const { isAuthenticated, isUser } = useCheckAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const acronymParts = [
    { letter: "B", explanation: t("home.hero.acronym.B") },
    { letter: "L", explanation: t("home.hero.acronym.L") },
    { letter: "I", explanation: t("home.hero.acronym.I") },
    { letter: "N", explanation: t("home.hero.acronym.N") },
    { letter: "K", explanation: t("home.hero.acronym.K") },
  ];

  const tagline = t("home.tagline");
  const [displayedTagline, setDisplayedTagline] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedTagline("");

    const interval = setInterval(() => {
      if (i < tagline.length) {
        // Use slice to ensure we always get the correct substring from the start
        setDisplayedTagline(tagline.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [tagline]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] mix-blend-screen animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Content */}
          <div
            data-aos={locale === "ar" ? "fade-left" : "fade-right"}
            data-aos-duration="600"
            className="space-y-8"
          >
            {/* Floating Badge */}
            <div
              data-aos="fade-down"
              data-aos-delay="300"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-pulse"
            >
              {t("home.mobileService")}
            </div>

            {/* Acronym */}
            <div className="flex flex-col space-y-4" dir="ltr">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-wider">
                <div className="flex justify-start">
                  {acronymParts.map((part, index) => (
                    <div
                      key={index}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      data-aos-duration="500"
                      className="flex flex-col items-center mx-2 relative"
                    >
                      {/* Flash icon above the letter I */}
                      {part.letter === "I" && (
                        <div
                          className="absolute sm:left-11.5 left-10.5 -translate-x-1/2 -top-5 w-10 h-10"
                          data-aos="zoom-in"
                          data-aos-delay="500"
                          data-aos-duration="700"
                        >
                          <Zap
                            className="h-5 w-5 text-primary"
                            fill="currentColor"
                          />
                        </div>
                      )}
                      <span className="text-primary text-6xl sm:text-7xl lg:text-8xl">
                        {part.letter}
                      </span>
                      <span className="text-xs sm:text-sm font-normal text-muted-foreground mt-1 max-w-[80px] text-center leading-tight">
                        {part.explanation}
                      </span>
                    </div>
                  ))}
                </div>
              </h1>
            </div>

            {/* Typewriter Tagline */}
            <h2 className="text-2xl w-fit sm:text-3xl font-light text-foreground min-h-[40px]">
              {displayedTagline}
              <span className="inline-block w-[3px] h-[30px] bg-primary ml-1 align-middle animate-blink-cursor" />
            </h2>

            <p
              className="text-lg text-muted-foreground max-w-xl text-pretty"
              data-aos="fade"
              data-aos-delay="800"
              data-aos-duration="500"
            >
              {t("home.hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {isAuthenticated ? (
                isUser && (
                  <Link
                    to="/booking"
                    className="bg-primary hover:bg-primary/90 text-foreground px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                  >
                    {t("home.hero.cta")}
                  </Link>
                )
              ) : (
                <Link
                  to="/login"
                  className="bg-primary hover:bg-primary/90 text-foreground px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                >
                  {t("home.hero.login")}
                </Link>
              )}
            </div>
          </div>

          {/* Right Side: Car Image */}
          <div
            data-aos="zoom-in"
            data-aos-duration="1000"
            data-aos-delay="200"
            className="relative"
          >
            {/* Glowing orb behind car */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 rounded-full blur-[80px] z-0 pointer-events-none"></div>

            {/* Car Image */}
            <img
              src="/hero.png"
              alt="Premium Car Detailing"
              className="w-full relative z-10 drop-shadow-2xl animate-float-gentle"
            />

            {/* Edge highlights/reflections */}
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-primary/5 to-transparent z-20 mix-blend-overlay pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

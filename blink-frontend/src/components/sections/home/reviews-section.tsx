import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useGetReviewsFoHome } from "@/hooks/useRating";
import "swiper/css";
import { arabicDate, englishDate } from "@/shared/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function ReviewsSection() {
  const { reviews, isFetchingReviews } = useGetReviewsFoHome();
  const { t, i18n } = useTranslation();

  const locale = i18n.language;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) {
        // Full star
        return (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        // Half star trick
        return (
          <div key={i} className="relative h-4 w-4">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        return <Star key={i} className="h-4 w-4 text-gray-300" />;
      }
    });
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t("home.reviews.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.reviews.description")}
          </p>
        </motion.div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView="auto"
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          speed={800}
          key={locale}
          className={locale === "ar" ? "swiper-rtl" : ""}
        >
          {isFetchingReviews &&
            Array.from({ length: 5 }, (_, i) => (
              <SwiperSlide key={i} className="w-80!">
                <Card className="h-full">
                  <CardContent className="p-6">
                    {/* Top row: stars + date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Skeleton
                            key={starIndex}
                            className="h-4 w-4 rounded-sm"
                          />
                        ))}
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>

                    {/* Review text */}
                    <div className="space-y-2 mb-4">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-[90%]" />
                      <Skeleton className="h-3 w-[75%]" />
                    </div>

                    {/* User section */}
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          {reviews &&
            reviews.map((review) => (
              <SwiperSlide key={review.id} className="w-80!" dir="ltr">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div
                        className={`flex items-center justify-between mb-4 `}
                      >
                        <div className={`flex space-x-1`}>
                          {renderStars(review.rating_number) || ""}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {(locale === "ar"
                            ? arabicDate(review.created_at.toString())
                            : englishDate(review.created_at.toString())) || ""}
                        </span>
                      </div>
                      <p
                        className={`text-muted-foreground mb-4 text-sm leading-relaxed text-left`}
                      >
                        {review.description || ""}
                      </p>
                      <div className={`flex items-center `}>
                        <div
                          className={`w-10 h-10 bg-muted rounded-full flex items-center justify-center`}
                        >
                          {/* USER AVATAR */}
                          <span className="text-foreground font-semibold text-sm">
                            {review.user?.name.charAt(0) || "Anonymous"}
                          </span>
                        </div>
                        {/* USER NAME */}
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {review.user?.name || "Anonymous"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
}

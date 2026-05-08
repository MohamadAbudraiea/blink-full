import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar, Clock, DollarSign, Star, MapPin, User } from "lucide-react";
import type { Booking } from "@/shared/types";
import StatusBadge from "./StatusBadge";
import CancelDialog from "./CancelDialog";
import RatingDialog from "./RatingDialog";
import {
  arabicDate,
  englishDate,
  formatCurrency,
  formatTime,
  getBorderColorClass,
} from "@/shared/utils";
import { useTranslation } from "react-i18next";

interface BookingCardProps {
  booking: Booking;
}

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  return Array.from({ length: 5 }, (_, i) => {
    if (i < fullStars) {
      return (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    } else if (i === fullStars && hasHalfStar) {
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

export default function BookingCard({ booking }: BookingCardProps) {
  const existingRating = booking.ratings;
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <Card className={`bg-muted ${getBorderColorClass(booking.status)}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-bold text-primary">
              {booking.service}
            </CardTitle>
            <CardDescription className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {t("booking.booked_on")}{" "}
              {locale === "ar"
                ? arabicDate(booking.created_at)
                : englishDate(booking.created_at)}
            </CardDescription>
          </div>
          <StatusBadge status={booking.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Service Details Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="service-details" className="border-0">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2"></div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.date && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-primary/10 via-background to-muted/20 border border-border/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {t("booking.service_date")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {locale === "ar"
                          ? arabicDate(booking.date)
                          : englishDate(booking.date)}
                      </p>
                    </div>
                  </div>
                )}

                {booking.start_time && booking.end_time && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-primary/10 via-background to-muted/20 border border-border/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-info" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {t("booking.time_slot")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(booking.start_time)} -{" "}
                        {formatTime(booking.end_time)}
                      </p>
                    </div>
                  </div>
                )}

                {booking.price && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-primary/10 via-background to-muted/20 border border-border/50">
                    <div className="w-8 h-8 rounded-full bg-green-700/10 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {t("booking.total_cost")}
                      </p>
                      <p className="text-sm font-semibold text-green-700">
                        {formatCurrency(parseInt(booking.price))}
                      </p>
                    </div>
                  </div>
                )}

                {booking.detailer?.name && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-primary/10 via-background to-muted/20 border border-border/50">
                    <div className="w-8 h-8 rounded-full bg-accent/50 flex items-center justify-center">
                      <User className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {t("booking.detailer")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.detailer.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              {booking.location && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-primary/10 via-background to-muted/20 border border-border/50 mt-4">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a
                    href={booking.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {t("booking.view_location")}
                  </a>
                </div>
              )}

              {/* Cancel Reason */}
              {booking.cancel_reason && (
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg mt-4">
                  <p className="text-sm">
                    <span className="font-medium text-destructive">
                      {t("booking.cancellation_reason")}:
                    </span>
                    <span
                      className={`text-muted-foreground ${
                        locale === "ar" ? "mr-2" : "ml-2"
                      }`}
                    >
                      {booking.cancel_reason}
                    </span>
                  </p>
                </div>
              )}

              {(booking.status === "finished" ||
                booking.status === "requested") && (
                <CardFooter className="py-6 bg-gradient-to-br from-background via-background to-muted/20 rounded-b-xl border-t border-border/30">
                  {/* Existing Rating */}
                  {booking.status === "finished" && existingRating![0] && (
                    <div className="w-full space-y-4">
                      <p className="text-sm font-semibold text-foreground">
                        {t("booking.your_review")}
                      </p>
                      <div
                        className="flex items-center gap-3 p-4 bg-yellow-500/20 border border-yellow-200 rounded-lg"
                        dir="ltr"
                      >
                        <div className="flex gap-1">
                          {renderStars(existingRating![0].rating_number)}
                        </div>
                        <div className="w-px h-6 bg-muted-foreground"></div>
                        <p className="text-sm text-muted-foreground italic">
                          {existingRating![0].description}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 w-full">
                    {booking.status === "requested" && (
                      <CancelDialog ticket_id={booking.id} />
                    )}
                    {booking.status === "finished" && !existingRating![0] && (
                      <RatingDialog ticket_id={booking.id} />
                    )}
                  </div>
                </CardFooter>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  MapPin,
  User,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { Booking } from "@/shared/types";
import CancelDialog from "./CancelDialog";
import RatingDialog from "./RatingDialog";
import {
  arabicDate,
  englishDate,
  formatCurrency,
  formatTime,
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

  const STEPS = ["requested", "pending", "finished"];
  const currentStepIndex = STEPS.indexOf(booking.status);
  const isCanceled = booking.status === "canceled";

  // Card styles based on status
  const getCardStyle = () => {
    if (isCanceled) return "bg-destructive/5 border-destructive/20";
    if (booking.status === "finished")
      return "bg-green-500/5 border-green-500/20";
    if (booking.status === "pending") return "bg-blue-500/5 border-blue-500/20";
    if (booking.status === "requested")
      return "bg-yellow-500/5 border-yellow-500/20";
    return "bg-card border-border/50";
  };

  const getBorderColor = () => {
    if (booking.service === "wash") return "border-l-blue-500";
    if (booking.service === "dryclean") return "border-l-purple-500";
    if (booking.service === "polish") return "border-l-orange-500";
    return "border-l-primary";
  };

  const dateObj = booking.date ? new Date(booking.date) : null;

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 ${getBorderColor()} ${getCardStyle()}`}
    >
      {/* Background Glow */}
      {booking.status === "pending" && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      )}
      {booking.status === "finished" && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <CardHeader className="pb-4 pt-5 px-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            {/* Calendar Box */}
            {dateObj ? (
              <div className="flex flex-col items-center justify-center bg-background rounded-xl border border-border shadow-sm min-w-[60px] p-2">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                  {dateObj.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
                    month: "short",
                  })}
                </span>
                <span className="text-2xl font-black text-primary leading-none my-1">
                  {dateObj.getDate()}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-background rounded-xl border border-border shadow-sm min-w-[60px] h-[64px]">
                <Calendar className="w-6 h-6 text-muted-foreground opacity-50" />
              </div>
            )}

            <div className="space-y-1">
              <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {t(`book.form.options.${booking.service}`)}
              </CardTitle>
              <CardDescription className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <Clock className="w-3.5 h-3.5" />
                {t("booking.booked_on")}{" "}
                {locale === "ar"
                  ? arabicDate(booking.created_at.toString())
                  : englishDate(booking.created_at.toString())}
              </CardDescription>
            </div>
          </div>

          {/* Stepper */}
          <div
            className="w-full md:w-auto relative z-10"
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            {isCanceled ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-full font-semibold border border-destructive/20 w-fit">
                <XCircle className="w-5 h-5" />
                {t("status.canceled")}
              </div>
            ) : (
              <div className="flex items-center">
                {STEPS.map((step, index) => {
                  const isCompleted =
                    index < currentStepIndex || booking.status === "finished";
                  const isActive =
                    index === currentStepIndex && booking.status !== "finished";

                  return (
                    <div key={step} className="flex items-center">
                      <div className="flex flex-col items-center gap-1 relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 z-10 ${
                            isCompleted
                              ? "bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                              : isActive
                                ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.6)] ring-2 ring-primary ring-offset-2 ring-offset-background"
                                : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span
                          className={`absolute -bottom-5 text-[10px] whitespace-nowrap font-medium ${
                            isActive
                              ? "text-primary font-bold"
                              : "text-muted-foreground"
                          }`}
                        >
                          {t(`book.status.${step}`)}
                        </span>
                      </div>

                      {index < STEPS.length - 1 && (
                        <div
                          className={`w-8 md:w-12 h-0.5 mx-1 transition-all duration-500 ${
                            isCompleted ? "bg-green-500" : "bg-border"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        {/* Quick Actions (Top Level) */}
        <div className="flex gap-3 mt-4 mb-2">
          {booking.status === "requested" && (
            <CancelDialog ticket_id={booking.id} />
          )}
          {booking.status === "finished" && !existingRating?.[0] && (
            <RatingDialog ticket_id={booking.id} />
          )}
        </div>

        {/* Existing Rating */}
        {booking.status === "finished" && existingRating?.[0] && (
          <div className="w-full space-y-2 mt-4 mb-2">
            <p className="text-sm font-semibold text-foreground">
              {t("booking.your_review")}
            </p>
            <div
              className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
              dir="ltr"
            >
              <div className="flex gap-1">
                {renderStars(existingRating[0].rating_number)}
              </div>
              <div className="w-px h-6 bg-border"></div>
              <p className="text-sm text-muted-foreground italic">
                "{existingRating[0].description}"
              </p>
            </div>
          </div>
        )}

        {/* Accordion for Details */}
        <Accordion
          type="single"
          collapsible
          className="w-full mt-4 bg-background/50 rounded-xl border border-border/50"
        >
          <AccordionItem value="details" className="border-0">
            <AccordionTrigger className="hover:no-underline px-4 py-3 text-sm font-medium">
              {locale === "ar" ? "عرض التفاصيل" : "View Details"}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.date && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-linear-to-br from-primary/10 via-background to-muted/20 border border-border/50">
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
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-linear-to-br from-primary/10 via-background to-muted/20 border border-border/50">
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
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-linear-to-br from-primary/10 via-background to-muted/20 border border-border/50">
                    <div className="w-8 h-8 rounded-full bg-green-700/10 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {t("booking.total_cost")}
                      </p>
                      <p className="text-sm font-semibold text-green-700">
                        {formatCurrency(parseInt(booking.price.toString()))}
                      </p>
                    </div>
                  </div>
                )}

                {booking.detailer?.name && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-linear-to-br from-primary/10 via-background to-muted/20 border border-border/50">
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
                <div className="flex items-center gap-3 p-3 rounded-lg bg-linear-to-br from-primary/10 via-background to-muted/20 border border-border/50 mt-4">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

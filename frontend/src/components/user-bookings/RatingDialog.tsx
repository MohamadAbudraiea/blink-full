import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUserRateTicket } from "@/hooks/useUser";

export default function RatingDialog({ ticket_id }: { ticket_id: string }) {
  const { isRatingTicket, rateTicketMutation } = useUserRateTicket();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const [ratingComment, setRatingComment] = useState("");

  const handleSubmit = () => {
    rateTicketMutation({
      ticket_id,
      rating_number: ratingValue,
      description: ratingComment,
    });
    setIsOpen(false);
    setRatingValue(0);
    setRatingComment("");
  };

  const handleStarInteraction = (value: number, isHalf: boolean = false) => {
    const finalValue = isHalf ? value - 0.5 : value;
    setRatingValue(finalValue);
  };

  const handleStarHover = (value: number, isHalf: boolean = false) => {
    const finalValue = isHalf ? value - 0.5 : value;
    setHoverValue(finalValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  const renderStar = (star: number) => {
    const displayValue = hoverValue || ratingValue;
    const isHalfFilled = displayValue >= star - 0.5 && displayValue < star;
    const isFilled = displayValue >= star;

    const isRTL = i18n.dir() === "rtl";

    return (
      <div key={star} className="relative w-8 h-8 mx-0.5">
        {/* Half star depending on direction */}
        <div
          className={`absolute top-0 w-1/2 h-full cursor-pointer z-10 ${
            isRTL ? "right-0" : "left-0"
          }`}
          onClick={() => handleStarInteraction(star, true)}
          onMouseEnter={() => handleStarHover(star, true)}
        />

        {/* Full star depending on direction */}
        <div
          className={`absolute top-0 w-1/2 h-full cursor-pointer z-10 ${
            isRTL ? "left-0" : "right-0"
          }`}
          onClick={() => handleStarInteraction(star)}
          onMouseEnter={() => handleStarHover(star)}
        />

        {/* Star display */}
        {isHalfFilled ? (
          <div className="relative">
            <Star className="w-8 h-8 text-muted-foreground" />
            <div
              className={`absolute inset-0 overflow-hidden w-1/2 ${
                isRTL ? "left-0" : "right-0"
              }`}
            >
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        ) : (
          <Star
            className={`w-8 h-8 transition-colors ${
              isFilled
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Star className="w-4 h-4 mr-1" />
          {t("book.rate.button")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("book.rate.title")}</DialogTitle>
          <DialogDescription>{t("book.rate.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("book.rate.rating")}</Label>
            <div className="flex items-center" onMouseLeave={handleMouseLeave}>
              {[1, 2, 3, 4, 5].map(renderStar)}
              <span
                className={`text-sm text-muted-foreground ${
                  i18n.dir() === "rtl" ? "mr-2" : "ml-2"
                }`}
              >
                {ratingValue.toFixed(1)} / 5.0
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ratingComment">{t("book.rate.comment")}</Label>
            <Textarea
              id="ratingComment"
              placeholder={t("book.rate.comment_placeholder")}
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t("book.rate.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={ratingValue === 0 || isRatingTicket}
          >
            {isRatingTicket ? t("book.rate.submitting") : t("book.rate.submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

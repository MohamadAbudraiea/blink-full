import type { Rating, Ticket } from "@/shared/types";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EyeOff, Globe, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinishedBookingProps {
  ticket: Ticket;
  role: "admin" | "secretary" | "detailer";
  useGetRatingHook: (id: string) => {
    rating: Rating;
    isFetchingRating: boolean;
  };
  useTogglePublishTicketHook: () => UseTogglePublishTicketHook;
}

interface UseTogglePublishTicketHook {
  togglePublishTicketMutation: (params: { id: string }) => void;
  isPublishingTicket: boolean;
}

export function FinishedBooking({
  ticket,
  useGetRatingHook,
  useTogglePublishTicketHook,
  role,
}: FinishedBookingProps) {
  const { rating, isFetchingRating } = useGetRatingHook(ticket.id);

  const { togglePublishTicketMutation, isPublishingTicket } =
    useTogglePublishTicketHook();

  return (
    <>
      <DialogHeader>
        <DialogTitle>Finished Booking</DialogTitle>
        <DialogDescription>Rating & Feedback</DialogDescription>
      </DialogHeader>
      {isFetchingRating && (
        <div className="flex items-center justify-center py-2">
          <Star className="h-4 w-4 animate-spin mr-2" />
          <span>Loading...</span>
        </div>
      )}
      <div className="space-y-3 py-4">
        {rating ? (
          <div>
            <p className="font-medium flex items-center gap-1">
              Rating:
              {rating.rating_number ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {rating.rating_number} / 5.0
                  </span>
                  <Star fill="currentColor" className="text-yellow-500" />
                </>
              ) : (
                "No rating"
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              Description:{" "}
              <span className="font-medium">
                {rating.description || "No description"}
              </span>
            </p>
            {role === "admin" && (
              <Button
                disabled={isPublishingTicket}
                onClick={() => togglePublishTicketMutation({ id: rating.id })}
                variant={rating.isPublished ? "destructive" : "default"}
                className={`w-full mt-3 flex items-center justify-center gap-2 font-medium transition-all duration-300
                          ${
                            isPublishingTicket
                              ? "opacity-80 cursor-not-allowed"
                              : "hover:scale-[1.02]"
                          }`}
              >
                {isPublishingTicket ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : rating.isPublished ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span>Unpublish</span>
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4" />
                    <span>Publish</span>
                  </>
                )}
              </Button>
            )}
          </div>
        ) : (
          <p>No rating available.</p>
        )}
      </div>
    </>
  );
}

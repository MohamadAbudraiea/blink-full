import type { Ticket } from "@/shared/types";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CanceledBookingProps {
  ticket: Ticket;
}

export function CanceledBooking({ ticket }: CanceledBookingProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Cancelled Booking</DialogTitle>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">
        User: <span className="font-medium">{ticket.user.name}</span>
      </p>
      <p className="text-sm text-muted-foreground">
        Phone:{" "}
        <a href={`tel:${ticket.user.phone}`} className="font-medium">
          {ticket.user.phone}
        </a>
      </p>
      <p className="font-medium">Reason: {ticket.cancel_reason || "Other"}</p>
    </>
  );
}

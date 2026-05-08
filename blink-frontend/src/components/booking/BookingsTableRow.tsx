import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import type { Ticket } from "@/shared/types";
import { BookingDialog } from "./BookingDialog";
import { useBookingStore } from "@/stores/useBookingStore";
import { englishDate, formatTime } from "@/shared/utils";

const statusColors: Record<
  Ticket["status"],
  "success" | "warning" | "destructive" | "default"
> = {
  finished: "success",
  pending: "default",
  requested: "warning",
  canceled: "destructive",
};

export function BookingsTableRow({
  ticket,
  detailers = [],
  role = "admin",
}: {
  ticket: Ticket;
  detailers?: { id: string; name: string }[];
  role?: "admin" | "secretary" | "detailer";
}) {
  const { handleDialogOpen } = useBookingStore();

  return (
    <TableRow>
      <TableCell>{ticket.id}</TableCell>
      <TableCell>{ticket.user.name || "-"}</TableCell>
      <TableCell>
        {ticket.service
          ? ticket.service +
            (ticket.typeOfService ? ` (${ticket.typeOfService})` : "")
          : "-"}
      </TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="xs"
              variant={statusColors[ticket.status]}
              onClick={() => handleDialogOpen(ticket)}
            >
              {ticket.status}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-screen overflow-y-auto">
            <BookingDialog role={role} ticket={ticket} detailers={detailers} />
          </DialogContent>
        </Dialog>
      </TableCell>
      <TableCell>
        <a href={`tel:${ticket.user.phone || ""}`}>
          {ticket.user.phone || "-"}
        </a>
      </TableCell>
      <TableCell>{ticket.price || "-"}</TableCell>
      <TableCell>{englishDate(ticket.date) || "-"}</TableCell>
      <TableCell>
        {formatTime(ticket.start_time) + " - " + formatTime(ticket.end_time)}
      </TableCell>
      <TableCell>{ticket.note || "-"}</TableCell>
      <TableCell>{ticket.secretary?.name || "-"}</TableCell>
      <TableCell>{ticket.detailer?.name || "-"}</TableCell>
    </TableRow>
  );
}

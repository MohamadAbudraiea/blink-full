import type { Ticket } from "@/shared/types";
import { RequestedBooking } from "./booking-status/RequestedBooking";
import { PendingBooking } from "./booking-status/PendingBooking";
import { FinishedBooking } from "./booking-status/FinishedBooking";
import { CanceledBooking } from "./booking-status/CanceledBooking";
import { useGetDetailerScheduleByDate } from "@/hooks/useAdmin";
import { useGetDetailerScheduleForSecretary } from "@/hooks/useSecretary";
import {
  useAcceptTicket,
  useCancelTicket,
  useFinishTicket,
  useTogglePublishTicket,
} from "@/hooks/useTicket";
import {
  useAcceptTicketForSecretary,
  useCancelTicketForSecretary,
  useFinishTicketForSecretary,
} from "@/hooks/useSecretary";
import {
  useGetRatingForTicket,
  useGetRatingForTicketForDetailer,
  useGetRatingForTicketForSecretary,
} from "@/hooks/useRating";
import { useFinishTicketForDetailer } from "@/hooks/usedetailer";

export function BookingDialog({
  ticket,
  detailers = [],
  role = "admin",
}: {
  ticket: Ticket;
  detailers?: { id: string; name: string }[];
  role?: "admin" | "secretary" | "detailer";
}) {
  const useScheduleHook =
    role === "admin"
      ? useGetDetailerScheduleByDate
      : useGetDetailerScheduleForSecretary;

  const useAcceptTicketHook =
    role === "admin" ? useAcceptTicket : useAcceptTicketForSecretary;

  const useCancelTicketHook =
    role === "admin" ? useCancelTicket : useCancelTicketForSecretary;

  const useFinishTicketHook =
    role === "admin"
      ? useFinishTicket
      : role === "secretary"
      ? useFinishTicketForSecretary
      : useFinishTicketForDetailer;

  const useGetRatingHook =
    role === "admin"
      ? useGetRatingForTicket
      : role === "secretary"
      ? useGetRatingForTicketForSecretary
      : useGetRatingForTicketForDetailer;

  const useTogglePublishTicketHook = useTogglePublishTicket;

  switch (ticket.status) {
    case "requested":
      return (
        <RequestedBooking
          ticket={ticket}
          detailers={detailers}
          useScheduleHook={useScheduleHook}
          useAcceptTicketHook={useAcceptTicketHook}
          useCancelTicketHook={useCancelTicketHook}
        />
      );
    case "pending":
      return (
        <PendingBooking
          useFinishTicketHook={useFinishTicketHook}
          useCancelTicketHook={useCancelTicketHook}
          ticket={ticket}
          role={role}
        />
      );
    case "finished":
      return (
        <FinishedBooking
          role={role}
          useTogglePublishTicketHook={useTogglePublishTicketHook}
          useGetRatingHook={useGetRatingHook}
          ticket={ticket}
        />
      );
    case "canceled":
      return <CanceledBooking ticket={ticket} />;
    default:
      return null;
  }
}

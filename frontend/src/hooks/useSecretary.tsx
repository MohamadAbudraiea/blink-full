import {
  getTicketsForSecretary,
  getAllDetailers,
  getDetailerSchedule,
  acceptTicket,
  cancelTicket,
  finishTicket,
  getTicketById,
} from "@/api/secretary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { invalidateTicketRelatedQueries } from "./useTicket";

export const useGetTicketsForSecretary = (params = {}) => {
  const { data, isPending: isFetchingTickets } = useQuery({
    queryKey: ["ticketsForSecretary", params],
    queryFn: () => getTicketsForSecretary(params),
  });

  return {
    tickets: data?.data?.tickets,
    pagination: data?.data?.pagination,
    isFetchingTickets,
  };
};

export const useGetAllDetailersForSecretary = (enabled = true) => {
  const { data, isPending: isFetchingDetailers } = useQuery({
    queryKey: ["detailers"],
    queryFn: getAllDetailers,
    enabled,
  });

  return {
    detailers: data?.data,
    isFetchingDetailers,
  };
};

export const useGetDetailerScheduleForSecretary = (
  id?: string,
  date?: Date,
  enabled = true,
) => {
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  const { data, isPending: isGettingDetailerSchedule } = useQuery({
    queryKey: ["detailerSchedule", id, formattedDate],
    queryFn: () => {
      if (!id || !formattedDate) {
        throw new Error("Detailer ID and date are required");
      }
      return getDetailerSchedule({ id, date: formattedDate });
    },
    enabled: !!id && !!formattedDate && enabled,
    retry: false,
  });

  return {
    schedule: data?.schedule,
    isGettingDetailerSchedule,
  };
};

export const useAcceptTicketForSecretary = () => {
  const queryClient = useQueryClient();
  const { mutate: acceptTicketMutation, isPending: isAcceptingTicket } =
    useMutation({
      mutationKey: ["acceptTicket"],
      mutationFn: acceptTicket,
      onSuccess: () => {
        invalidateTicketRelatedQueries(queryClient);
        toast.success("Ticket accepted successfully");
      },
      onError: () => {
        toast.error("Failed to accept ticket");
      },
    });

  return { acceptTicketMutation, isAcceptingTicket };
};

export const useCancelTicketForSecretary = () => {
  const queryClient = useQueryClient();
  const { mutate: cancelTicketMutation, isPending: isCancellingTicket } =
    useMutation({
      mutationKey: ["cancelTicket"],
      mutationFn: ({ id, reason }: { id: string; reason: string }) =>
        cancelTicket({ id, reason }),
      onSuccess: () => {
        invalidateTicketRelatedQueries(queryClient);
        toast.success("Ticket canceled successfully");
      },
      onError: () => {
        toast.error("Failed to cancel ticket");
      },
    });

  return { cancelTicketMutation, isCancellingTicket };
};

export const useFinishTicketForSecretary = () => {
  const queryClient = useQueryClient();
  const { mutate: finishTicketMutation, isPending: isFinishingTicket } =
    useMutation({
      mutationKey: ["finishTicket"],
      mutationFn: finishTicket,
      onSuccess: () => {
        invalidateTicketRelatedQueries(queryClient);
        toast.success("Ticket finished successfully");
      },
      onError: () => {
        toast.error("Failed to finish ticket");
      },
    });

  return { finishTicketMutation, isFinishingTicket };
};

export const useGetTicketByIdForSecretary = (id: string | null) => {
  const { data, isPending: isFetchingTicket } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicketById(id!),
    enabled: !!id,
  });

  return {
    ticket: data?.data,
    isFetchingTicket,
  };
};

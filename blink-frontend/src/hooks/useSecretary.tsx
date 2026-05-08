import {
  getTicketsForSecretary,
  getAllDetailers,
  getDetailerSchedule,
  acceptTicket,
  cancelTicket,
  finishTicket,
} from "@/api/secretary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";

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

export const useGetAllDetailersForSecretary = () => {
  const { data, isPending: isFetchingDetailers } = useQuery({
    queryKey: ["detailers"],
    queryFn: getAllDetailers,
  });

  return {
    detailers: data?.data,
    isFetchingDetailers,
  };
};

export const useGetDetailerScheduleForSecretary = (
  id?: string,
  date?: Date
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
    enabled: !!id && !!formattedDate,
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
        queryClient.invalidateQueries({ queryKey: ["ticketsForSecretary"] });
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
        queryClient.invalidateQueries({ queryKey: ["ticketsForSecretary"] });
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
        queryClient.invalidateQueries({ queryKey: ["ticketsForSecretary"] });
        toast.success("Ticket finished successfully");
      },
      onError: () => {
        toast.error("Failed to finish ticket");
      },
    });

  return { finishTicketMutation, isFinishingTicket };
};

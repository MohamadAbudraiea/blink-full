import {
  getFilteredTickets,
  acceptTicket,
  cancelTicket,
  finishTicket,
  getChartsData,
  getCanceledTicketsForCharts,
  togglePublishTicket,
} from "@/api/ticket";
import type { Ticket } from "@/shared/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetChartsData = (
  month: number | undefined,
  year: number | undefined
) => {
  const { data, isPending: isFetchingChartsData } = useQuery({
    queryKey: ["charts", month, year],
    queryFn: () => getChartsData({ month, year }),
  });

  return {
    chartsData: data?.data,
    isFetchingTickets: isFetchingChartsData,
  };
};

export const useGetCanceledTicketsForCharts = (): {
  canceledTickets: { tickets: Ticket[] } | undefined;
  isFetchingCanceledTickets: boolean;
} => {
  const { data, isPending: isFetchingCanceledTickets } = useQuery({
    queryKey: ["canceledTickets"],
    queryFn: getCanceledTicketsForCharts,
  });

  return {
    canceledTickets: data?.data,
    isFetchingCanceledTickets,
  };
};

export const useGetFilteredTickets = (params = {}) => {
  const { data, isPending: isFetchingTickets } = useQuery({
    queryKey: ["filteredTickets", params],
    queryFn: () => getFilteredTickets(params),
  });

  return {
    tickets: data?.data?.tickets,
    pagination: data?.data?.pagination,
    isFetchingTickets,
  };
};

export const useAcceptTicket = () => {
  const queryClient = useQueryClient();
  const { mutate: acceptTicketMutation, isPending: isAcceptingTicket } =
    useMutation({
      mutationKey: ["acceptTicket"],
      mutationFn: acceptTicket,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["filteredTickets"] });
        toast.success("Ticket accepted successfully");
      },
      onError: () => {
        toast.error("Failed to accept ticket");
      },
    });

  return { acceptTicketMutation, isAcceptingTicket };
};

export const useCancelTicket = () => {
  const queryClient = useQueryClient();
  const { mutate: cancelTicketMutation, isPending: isCancellingTicket } =
    useMutation({
      mutationKey: ["cancelTicket"],
      mutationFn: ({ id, reason }: { id: string; reason: string }) =>
        cancelTicket({ id, reason }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["filteredTickets"] });
        toast.success("Ticket canceled successfully");
      },
      onError: () => {
        toast.error("Failed to cancel ticket");
      },
    });

  return { cancelTicketMutation, isCancellingTicket };
};

export const useFinishTicket = () => {
  const queryClient = useQueryClient();
  const { mutate: finishTicketMutation, isPending: isFinishingTicket } =
    useMutation({
      mutationKey: ["finishTicket"],
      mutationFn: finishTicket,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["filteredTickets"] });
        toast.success("Ticket finished successfully");
      },
      onError: () => {
        toast.error("Failed to finish ticket");
      },
    });

  return { finishTicketMutation, isFinishingTicket };
};

export const useTogglePublishTicket = () => {
  const queryClient = useQueryClient();
  const { mutate: togglePublishTicketMutation, isPending: isPublishingTicket } =
    useMutation({
      mutationKey: ["togglePublishTicket"],
      mutationFn: togglePublishTicket,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["filteredTickets"] });
        queryClient.invalidateQueries({ queryKey: ["reviewsFoHome"] });
        toast.success("Ticket visibility toggled successfully");
      },
      onError: () => {
        toast.error("Failed to toggle ticket visibility");
      },
    });

  return { togglePublishTicketMutation, isPublishingTicket };
};

import {
  getFilteredTickets,
  acceptTicket,
  cancelTicket,
  finishTicket,
  getChartsData,
  getCanceledTicketsForCharts,
  togglePublishTicket,
  getTicketById,
} from "@/api/ticket";
import type { Ticket } from "@/shared/types";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const invalidateTicketRelatedQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["filteredTickets"] });
  queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
  queryClient.invalidateQueries({ queryKey: ["detailerSchedule"] });
  queryClient.invalidateQueries({ queryKey: ["allDetailersSchedules"] });
  queryClient.invalidateQueries({ queryKey: ["ticketsForDetailer"] });
  queryClient.invalidateQueries({ queryKey: ["ticketsForSecretary"] });
  queryClient.invalidateQueries({ queryKey: ["userTickets"] });
};

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

export const useGetTicketById = (id: string | null) => {
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

export const useAcceptTicket = () => {
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

export const useCancelTicket = () => {
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

export const useFinishTicket = () => {
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

export const useTogglePublishTicket = () => {
  const queryClient = useQueryClient();
  const { mutate: togglePublishTicketMutation, isPending: isPublishingTicket } =
    useMutation({
      mutationKey: ["togglePublishTicket"],
      mutationFn: togglePublishTicket,
      onSuccess: () => {
        invalidateTicketRelatedQueries(queryClient);
        queryClient.invalidateQueries({ queryKey: ["reviewsFoHome"] });
        toast.success("Ticket visibility toggled successfully");
      },
      onError: () => {
        toast.error("Failed to toggle ticket visibility");
      },
    });

  return { togglePublishTicketMutation, isPublishingTicket };
};

export const useAddPendingTicket = (role: string = "admin") => {
  const queryClient = useQueryClient();
  const { mutate: addPendingTicketMutation, isPending: isAddingPendingTicket } =
    useMutation({
      mutationKey: ["addPendingTicket"],
      mutationFn: async (payload: any) => {
        const { addPendingTicket } = await import("@/api/ticket");
        return addPendingTicket(payload, role);
      },
      onSuccess: () => {
        invalidateTicketRelatedQueries(queryClient);
        toast.success("Pending ticket created successfully");
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || "Failed to create pending ticket";
        toast.error(msg);
      },
    });

  return { addPendingTicketMutation, isAddingPendingTicket };
};

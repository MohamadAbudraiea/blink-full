import {
  getUserTickets,
  addTicket,
  cancelTicket,
  rateTicket,
  sendMessage,
  getUserLocations,
} from "@/api/user";
import type { Booking } from "@/shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { invalidateTicketRelatedQueries } from "./useTicket";

export const useGetUserTickets = (
  params = {}
): {
  tickets: Booking[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  isGettingUserTickets: boolean;
} => {
  const { data, isPending: isGettingUserTickets } = useQuery({
    queryKey: ["userTickets", params],
    queryFn: () => getUserTickets(params),
  });

  return {
    tickets: data?.data?.tickets,
    pagination: data?.data?.pagination,
    isGettingUserTickets,
  };
};

export const useAddTicket = () => {
  const queryClient = useQueryClient();
  const { mutate: addTicketMutation, isPending: isAddingTicket } = useMutation({
    mutationKey: ["addTicket"],
    mutationFn: addTicket,
    onSuccess: () => {
      invalidateTicketRelatedQueries(queryClient);
      toast.success("Ticket added successfully");
    },
    onError: () => {
      toast.error("Failed to add ticket");
    },
  });

  return { addTicketMutation, isAddingTicket };
};

export const useUserCancelTicket = () => {
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

export const useUserRateTicket = () => {
  const queryClient = useQueryClient();
  const { mutate: rateTicketMutation, isPending: isRatingTicket } = useMutation(
    {
      mutationKey: ["rateTicket"],
      mutationFn: rateTicket,
      onSuccess: () => {
        toast.success("Ticket rated successfully");
        invalidateTicketRelatedQueries(queryClient);
      },
      onError: () => {
        toast.error("Failed to rate ticket");
      },
    }
  );

  return { rateTicketMutation, isRatingTicket };
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const {
    mutate: sendMessageMutation,
    isPending: isSendingMessage,
    isSuccess,
  } = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: sendMessage,
    onSuccess: () => {
      toast.success("Message sent successfully");
      invalidateTicketRelatedQueries(queryClient);
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });

  return { sendMessageMutation, isSendingMessage, isSuccess };
};

export const useGetUserLocations = (enabled: boolean = false) => {
  const { data, isPending: isGettingLocations } = useQuery({
    queryKey: ["userLocations"],
    queryFn: getUserLocations,
    staleTime: 1000 * 60 * 5, // 5 min cache
    enabled, // only fetch when explicitly enabled (user is authenticated)
    retry: false,
    throwOnError: false, // never crash the render tree on network errors
  });

  return {
    savedLocations: (data?.data ?? []) as string[],
    isGettingLocations,
  };
};

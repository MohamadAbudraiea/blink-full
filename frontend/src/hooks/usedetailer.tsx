import { getTicketsForDetailer, finishTicket } from "@/api/detailer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { invalidateTicketRelatedQueries } from "./useTicket";

export const useGetTicketsForDetailer = (params = {}, enabled = true) => {
  const { data, isPending: isFetchingTickets } = useQuery({
    queryKey: ["ticketsForDetailer", params],
    queryFn: () => getTicketsForDetailer(params),
    enabled,
  });

  return {
    tickets: data?.data?.tickets,
    pagination: data?.data?.pagination,
    isFetchingTickets,
  };
};
export const useFinishTicketForDetailer = () => {
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

import { getTicketsForDetailer, finishTicket } from "@/api/detailer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetTicketsForDetailer = (params = {}) => {
  const { data, isPending: isFetchingTickets } = useQuery({
    queryKey: ["ticketsForDetailer", params],
    queryFn: () => getTicketsForDetailer(params),
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
        queryClient.invalidateQueries({ queryKey: ["ticketsForDetailer"] });
        toast.success("Ticket finished successfully");
      },
      onError: () => {
        toast.error("Failed to finish ticket");
      },
    });

  return { finishTicketMutation, isFinishingTicket };
};

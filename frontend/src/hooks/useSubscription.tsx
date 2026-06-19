import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSubscription, getSubscriptions, cancelSubscription, previewResubscribe, confirmResubscribe } from "@/api/subscription";
import { toast } from "sonner";
import type { Subscription } from "@/shared/types";
import { invalidateTicketRelatedQueries } from "./useTicket";

export const useCreateSubscription = (role: string = "admin") => {
  const queryClient = useQueryClient();
  const { mutate: createSubscriptionMutation, isPending: isCreatingSubscription } =
    useMutation({
      mutationKey: ["createSubscription"],
      mutationFn: async (payload: any) => {
        return createSubscription(payload, role);
      },
      onSuccess: () => {
        invalidateTicketRelatedQueries(queryClient);
        toast.success("Subscription created successfully");
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || "Failed to create subscription";
        toast.error(msg);
      },
    });

  return { createSubscriptionMutation, isCreatingSubscription };
};

export const useGetSubscriptions = (role: string = "admin") => {
  const { data, isPending: isGettingSubscriptions } = useQuery({
    queryKey: ["subscriptions", role],
    queryFn: () => getSubscriptions(role),
    retry: false,
  });

  return {
    subscriptions: (data?.data || []) as Subscription[],
    isGettingSubscriptions,
  };
};

export const useCancelSubscription = (role: string = "admin") => {
  const queryClient = useQueryClient();
  const { mutate: cancelSubscriptionMutation, isPending: isCancelingSubscription } =
    useMutation({
      mutationKey: ["cancelSubscription"],
      mutationFn: async (id: string) => {
        return cancelSubscription(id, role);
      },
      onSuccess: () => {
        invalidateTicketRelatedQueries(queryClient);
        toast.success("Subscription canceled successfully");
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || "Failed to cancel subscription";
        toast.error(msg);
      },
    });

  return { cancelSubscriptionMutation, isCancelingSubscription };
};

export const usePreviewResubscription = (role: string = "admin") => {
  const { mutate: previewMutation, isPending: isPreviewing, data: previewData } = useMutation({
    mutationFn: (id: string) => previewResubscribe(id, role),
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Failed to load resubscription preview";
      toast.error(msg);
    },
  });
  return { previewMutation, isPreviewing, previewData: previewData?.data };
};

export const useConfirmResubscription = (role: string = "admin") => {
  const queryClient = useQueryClient();
  const { mutate: confirmMutation, isPending: isConfirming } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { tickets: any[]; total_price?: number } }) =>
      confirmResubscribe(id, payload, role),
    onSuccess: () => {
      invalidateTicketRelatedQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Resubscription created successfully!");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Failed to confirm resubscription";
      toast.error(msg);
    },
  });
  return { confirmMutation, isConfirming };
};

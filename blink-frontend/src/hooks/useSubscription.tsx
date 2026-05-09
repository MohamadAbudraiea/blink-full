import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSubscription, getSubscriptions, cancelSubscription } from "@/api/subscription";
import { toast } from "sonner";
import type { Subscription } from "@/shared/types";

export const useCreateSubscription = (role: string = "admin") => {
  const queryClient = useQueryClient();
  const { mutate: createSubscriptionMutation, isPending: isCreatingSubscription } =
    useMutation({
      mutationKey: ["createSubscription"],
      mutationFn: async (payload: any) => {
        return createSubscription(payload, role);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        queryClient.invalidateQueries({ queryKey: ["filteredTickets"] });
        queryClient.invalidateQueries({ queryKey: ["ticketsForSecretary"] });
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
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        queryClient.invalidateQueries({ queryKey: ["filteredTickets"] });
        queryClient.invalidateQueries({ queryKey: ["ticketsForSecretary"] });
        toast.success("Subscription canceled successfully");
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || "Failed to cancel subscription";
        toast.error(msg);
      },
    });

  return { cancelSubscriptionMutation, isCancelingSubscription };
};

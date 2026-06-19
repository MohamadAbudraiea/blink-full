import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPricing, updatePricing } from "@/api/pricing";
import { toast } from "sonner";

export interface ServicePricing {
  id: number;
  service: string;
  base_price: number;
  plan_2_price: number;
  plan_4_price: number;
  plan_8_price: number;
}

export const useGetPricing = () => {
  const { data, isPending: isGettingPricing } = useQuery({
    queryKey: ["pricing"],
    queryFn: getPricing,
    staleTime: 1000 * 60 * 10, // cache for 10 min — prices don't change often
  });

  return {
    pricing: (data?.data || []) as ServicePricing[],
    isGettingPricing,
  };
};

export const useUpdatePricing = () => {
  const queryClient = useQueryClient();
  const { mutate: updatePricingMutation, isPending: isUpdatingPricing } =
    useMutation({
      mutationFn: updatePricing,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pricing"] });
        toast.success("Pricing updated successfully");
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Failed to update pricing";
        toast.error(msg);
      },
    });

  return { updatePricingMutation, isUpdatingPricing };
};

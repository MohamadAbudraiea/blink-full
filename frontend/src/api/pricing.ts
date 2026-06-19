import { axiosInstance } from "@/api/axios";

export async function getPricing() {
  const res = await axiosInstance.get("/shared/pricing");
  return res.data;
}

export async function updatePricing(payload: {
  service: string;
  base_price: number;
  plan_2_price: number;
  plan_4_price: number;
  plan_8_price: number;
}) {
  const res = await axiosInstance.put("/admin/pricing", payload);
  return res.data;
}

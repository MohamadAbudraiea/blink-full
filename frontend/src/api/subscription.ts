import { axiosInstance } from "@/api/axios";

export async function createSubscription(payload: any, role: string = "admin") {
  const prefix = role === "user" ? "/user" : role === "secretary" ? "/secretary" : "/admin";
  const res = await axiosInstance.post(`${prefix}/subscription`, payload);
  return res.data;
}

export async function getSubscriptions(role: string = "admin") {
  const prefix = role === "user" ? "/user" : role === "secretary" ? "/secretary" : "/admin";
  const res = await axiosInstance.get(`${prefix}/subscription`);
  return res.data;
}

export async function cancelSubscription(id: string, role: string = "admin") {
  const prefix = role === "secretary" ? "/secretary" : "/admin";
  const res = await axiosInstance.post(`${prefix}/subscription/cancel/${id}`);
  return res.data;
}

export async function previewResubscribe(id: string, role: string = "admin") {
  const prefix = role === "user" ? "/user" : role === "secretary" ? "/secretary" : "/admin";
  const res = await axiosInstance.post(`${prefix}/subscription/resubscribe/${id}/preview`);
  return res.data;
}

export async function confirmResubscribe(
  id: string,
  payload: { tickets: any[]; total_price?: number },
  role: string = "admin"
) {
  const prefix = role === "user" ? "/user" : role === "secretary" ? "/secretary" : "/admin";
  const res = await axiosInstance.post(
    `${prefix}/subscription/resubscribe/${id}/confirm`,
    payload
  );
  return res.data;
}

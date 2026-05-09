import { axiosInstance } from "./axios";

export async function getTicketsForDetailer(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(
    `/detailer/tickets/filters?${queryString}`
  );
  return res.data;
}

export async function finishTicket({
  id,
  payment_method,
}: {
  id: string;
  payment_method: string;
}) {
  const res = await axiosInstance.post(`/detailer/ticket/finish/${id}`, {
    payment_method,
  });
  return res.data;
}

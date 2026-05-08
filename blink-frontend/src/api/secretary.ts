import { axiosInstance } from "@/api/axios";

export async function getTicketsForSecretary(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(
    `/secretary/tickets/filters?${queryString}`
  );
  return res.data;
}

export async function getAllDetailers() {
  const res = await axiosInstance.get(`/secretary/detailer`);
  return res.data;
}

export async function getDetailerSchedule({
  id,
  date,
}: {
  id: string;
  date: string;
}) {
  if (!id || !date) {
    throw new Error("Detailer ID and date are required");
  }
  const res = await axiosInstance.get(`/secretary/detailer/${id}/${date}`);
  return res.data;
}

export async function acceptTicket({
  id,
  detailer_id,
  date,
  start_time,
  end_time,
  price,
  location,
}: {
  id: string;
  detailer_id: string;
  date: string;
  start_time: string;
  end_time: string;
  price: number;
  location: string;
}) {
  const res = await axiosInstance.post(`/secretary/ticket/accept/${id}`, {
    detailer_id,
    date,
    start_time,
    end_time,
    price,
    location,
  });
  return res.data;
}

export async function cancelTicket({
  id,
  reason,
}: {
  id: string;
  reason: string;
}) {
  const res = await axiosInstance.post(`/secretary/ticket/cancel/${id}`, {
    cancel_reason: reason,
  });
  return res.data;
}
export async function finishTicket({
  id,
  payment_method,
}: {
  id: string;
  payment_method: string;
}) {
  const res = await axiosInstance.post(`/secretary/ticket/finish/${id}`, {
    payment_method,
  });
  return res.data;
}

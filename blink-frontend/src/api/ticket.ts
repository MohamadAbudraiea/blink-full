import { axiosInstance } from "@/api/axios";

export async function getChartsData({
  month,
  year,
}: {
  month: number | undefined;
  year: number | undefined;
}) {
  const res = await axiosInstance.get("/admin/ticket/charts", {
    params: { month, year },
  });
  return res.data;
}

export async function getCanceledTicketsForCharts() {
  const res = await axiosInstance.get("/admin/ticket/charts/canceled");
  return res.data;
}

export async function getFilteredTickets(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(`/admin/ticket/filters?${queryString}`);
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
  const res = await axiosInstance.post(`/admin/ticket/accept/${id}`, {
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
  const res = await axiosInstance.post(`/admin/ticket/cancel/${id}`, {
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
  const res = await axiosInstance.post(`/admin/ticket/finish/${id}`, {
    payment_method,
  });
  return res.data;
}

export async function togglePublishTicket({ id }: { id: string }) {
  const res = await axiosInstance.post("/admin/ticket/rating/toggle", {
    id,
  });
  return res.data;
}

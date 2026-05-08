import { axiosInstance } from "@/api/axios";

export async function getUserTickets(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(`/user/ticket/filters?${queryString}`);
  return res.data;
}

export async function addTicket({
  date,
  service,
  typeOfService,
  location,
  note,
}: {
  typeOfService: string | undefined;
  service: string;
  location: string;
  date: string | undefined;
  note: string | undefined;
}) {
  const res = await axiosInstance.post("/user/ticket", {
    service,
    typeOfService,
    location,
    date,
    note,
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
  const res = await axiosInstance.post(`/user/ticket/cancel/${id}`, {
    cancel_reason: reason,
  });
  return res.data;
}

export async function rateTicket({
  ticket_id,
  rating_number,
  description,
}: {
  ticket_id: string;
  rating_number: number;
  description: string;
}) {
  const res = await axiosInstance.post("/user/ticket/rating", {
    ticket_id,
    rating_number,
    description,
  });
  return res.data;
}

export async function sendMessage({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const res = await axiosInstance.post("/shared/sendmessage", {
    name,
    email,
    subject,
    message,
  });
  return res.data;
}

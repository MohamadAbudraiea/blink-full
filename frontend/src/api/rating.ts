import { axiosInstance } from "@/api/axios";

export async function getTicketRating({ id }: { id: string }) {
  const res = await axiosInstance.get(`/admin/ticket/rating/${id}`);
  return res.data;
}

export async function getReviewsFoHome() {
  const res = await axiosInstance.get("/shared/ticket/all/ratings");
  return res.data;
}

export async function getTicketRatingForSecretary({ id }: { id: string }) {
  const res = await axiosInstance.get(`/secretary/ticket/rating/${id}`);
  return res.data;
}

export async function getTicketRatingForDetailer({ id }: { id: string }) {
  const res = await axiosInstance.get(`/detailer/ticket/rating/${id}`);
  return res.data;
}

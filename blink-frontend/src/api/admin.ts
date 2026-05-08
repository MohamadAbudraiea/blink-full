import { axiosInstance } from "@/api/axios";
//p2d
export async function getUsers() {
  const res = await axiosInstance.get("/admin/user");
  return res.data;
}

export async function addUser({
  name,
  email,
  phone,
  password,
  type,
}: {
  name: string;
  email: string;
  phone: string;
  password: string;
  type: string;
}) {
  const res = await axiosInstance.post("/admin/user", {
    name,
    email,
    phone,
    password,
    type,
  });
  return res.data;
}

export async function deleteUser({ id }: { id: string }) {
  const res = await axiosInstance.delete("/admin/user", { data: { id } });
  return res.data;
}

export async function editUser({
  id,
  name,
  email,
  phone,
}: {
  id: string;
  name: string;
  email: string;
  phone: string;
}) {
  const res = await axiosInstance.put("/admin/user", {
    id,
    name,
    email,
    phone,
  });
  return res.data;
}

export async function getDetailerSchedule({ id }: { id: string }) {
  const res = await axiosInstance.get(`/admin/detailer/${id}`);
  return res.data;
}

export async function getDetailerScheduleByDate({
  id,
  date,
}: {
  id: string;
  date: string;
}) {
  if (!id || !date) {
    throw new Error("Detailer ID and date are required");
  }
  const res = await axiosInstance.get(`/admin/detailer/${id}/${date}`);
  return res.data;
}

export async function getDetailerStock({
  detailer_id,
  date,
  startDate,
  endDate,
}: {
  detailer_id: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}) {
  const params: Record<string, string> = {};
  if (date) params.date = date;
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }

  const res = await axiosInstance.get(
    `/admin/detailer/${detailer_id}/stock/dates`,
    {
      params,
    }
  );
  return res.data;
}
// for merge

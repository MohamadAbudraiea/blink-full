import { axiosInstance } from "@/api/axios";

export async function signUp({
  name,
  email,
  phone,
  password,
}: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  const res = await axiosInstance.post("/auth/signup", {
    name,
    email,
    phone,
    password,
  });
  return res.data;
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await axiosInstance.post("/auth/login", { email, password });
  return res.data;
}

export async function logout() {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
}

export async function checkAuth() {
  const res = await axiosInstance.get("/auth/check");
  return res.data;
}

export async function forgotPassword({ email }: { email: string }) {
  const res = await axiosInstance.post("/shared/otp", { email });
  return res.data;
}

export async function resetPassword({
  email,
  otpCode,
  newPassword,
}: {
  email: string;
  otpCode: string;
  newPassword: string;
}) {
  const res = await axiosInstance.post("/shared/otp/changepassword", {
    email,
    otpCode,
    newPassword,
  });
  return res.data;
}

export async function changePassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) {
  const res = await axiosInstance.patch("/auth/change/password", {
    oldPassword,
    newPassword,
  });
  return res.data;
}

export async function updateProfile({
  name,
  phone,
  email,
}: {
  name: string;
  phone: string;
  email: string;
}) {
  const res = await axiosInstance.patch("/auth/change/profile", {
    name,
    phone,
    email,
  });
  return res.data;
}

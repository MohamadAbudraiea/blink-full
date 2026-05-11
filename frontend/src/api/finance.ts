import { axiosInstance } from "@/api/axios";

// ==================== ACCOUNTS ====================

export async function getAccounts() {
  const res = await axiosInstance.get("/admin/finance/account");
  return res.data;
}

export async function createAccount({
  name,
  description,
}: {
  name: string;
  description?: string;
}) {
  const res = await axiosInstance.post("/admin/finance/account", {
    name,
    description,
  });
  return res.data;
}

export async function deleteAccount({ id }: { id: number }) {
  const res = await axiosInstance.delete(`/admin/finance/account/${id}`);
  return res.data;
}

// ==================== TRANSACTIONS ====================

export async function createTransaction({
  account_id,
  type,
  amount,
  description,
}: {
  account_id: number;
  type: "in" | "out";
  amount: number;
  description?: string;
}) {
  const res = await axiosInstance.post("/admin/finance/transaction", {
    account_id,
    type,
    amount,
    description,
  });
  return res.data;
}

export async function getAccountTransactions({
  id,
  page,
  limit,
  type,
}: {
  id: number;
  page?: number;
  limit?: number;
  type?: "in" | "out";
}) {
  const params: Record<string, string | number> = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (type) params.type = type;

  const res = await axiosInstance.get(
    `/admin/finance/account/${id}/transactions`,
    { params }
  );
  return res.data;
}

export async function deleteTransaction({ id }: { id: number }) {
  const res = await axiosInstance.delete(`/admin/finance/transaction/${id}`);
  return res.data;
}

// ==================== REPORTS ====================

export async function getFinanceReports({
  startDate,
  endDate,
  account_ids,
}: {
  startDate?: string;
  endDate?: string;
  account_ids?: number[];
}) {
  const params: Record<string, string> = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (account_ids && account_ids.length > 0)
    params.account_ids = account_ids.join(",");

  const res = await axiosInstance.get("/admin/finance/reports", { params });
  return res.data;
}

export async function getAccountReport({
  id,
  startDate,
  endDate,
}: {
  id: number;
  startDate?: string;
  endDate?: string;
}) {
  const params: Record<string, string> = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const res = await axiosInstance.get(`/admin/finance/account/${id}/report`, {
    params,
  });
  return res.data;
}

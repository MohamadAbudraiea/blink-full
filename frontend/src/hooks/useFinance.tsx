import {
  getAccounts,
  createAccount,
  deleteAccount,
  createTransaction,
  getAccountTransactions,
  deleteTransaction,
  getFinanceReports,
  getAccountReport,
} from "@/api/finance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ==================== ACCOUNTS ====================

export const useGetAccounts = () => {
  const { data, isPending: isGettingAccounts } = useQuery({
    queryKey: ["finance-accounts"],
    queryFn: getAccounts,
    retry: false,
  });

  return {
    accounts: data?.data || [],
    isGettingAccounts,
  };
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  const { mutate: createAccountMutation, isPending: isCreatingAccount } =
    useMutation({
      mutationKey: ["createAccount"],
      mutationFn: createAccount,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["finance-accounts"] });
        queryClient.invalidateQueries({ queryKey: ["finance-reports"] });
        toast.success("Account created successfully");
      },
      onError: (error: { response?: { data?: { message?: string } } }) => {
        const message =
          error?.response?.data?.message || "Failed to create account";
        toast.error(message);
      },
    });

  return { createAccountMutation, isCreatingAccount };
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteAccountMutation, isPending: isDeletingAccount } =
    useMutation({
      mutationKey: ["deleteAccount"],
      mutationFn: deleteAccount,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["finance-accounts"] });
        queryClient.invalidateQueries({ queryKey: ["finance-reports"] });
        toast.success("Account deleted successfully");
      },
      onError: (error: { response?: { data?: { message?: string } } }) => {
        const message =
          error?.response?.data?.message || "Failed to delete account";
        toast.error(message);
      },
    });

  return { deleteAccountMutation, isDeletingAccount };
};

// ==================== TRANSACTIONS ====================

export const useGetAccountTransactions = (
  accountId: number | null,
  page: number = 1,
  limit: number = 20,
  type?: "in" | "out"
) => {
  const { data, isPending: isGettingTransactions } = useQuery({
    queryKey: ["finance-transactions", accountId, page, limit, type],
    queryFn: () =>
      getAccountTransactions({ id: accountId!, page, limit, type }),
    enabled: !!accountId,
    retry: false,
  });

  return {
    transactions: data?.data?.transactions || [],
    account: data?.data?.account,
    pagination: data?.data?.pagination,
    isGettingTransactions,
  };
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { mutate: createTransactionMutation, isPending: isCreatingTransaction } =
    useMutation({
      mutationKey: ["createTransaction"],
      mutationFn: createTransaction,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["finance-transactions"] });
        queryClient.invalidateQueries({ queryKey: ["finance-accounts"] });
        queryClient.invalidateQueries({ queryKey: ["finance-reports"] });
        queryClient.invalidateQueries({ queryKey: ["finance-account-report"] });
        toast.success("Transaction created successfully");
      },
      onError: (error: { response?: { data?: { message?: string } } }) => {
        const message =
          error?.response?.data?.message || "Failed to create transaction";
        toast.error(message);
      },
    });

  return { createTransactionMutation, isCreatingTransaction };
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteTransactionMutation, isPending: isDeletingTransaction } =
    useMutation({
      mutationKey: ["deleteTransaction"],
      mutationFn: deleteTransaction,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["finance-transactions"] });
        queryClient.invalidateQueries({ queryKey: ["finance-accounts"] });
        queryClient.invalidateQueries({ queryKey: ["finance-reports"] });
        queryClient.invalidateQueries({ queryKey: ["finance-account-report"] });
        toast.success("Transaction deleted successfully");
      },
      onError: (error: { response?: { data?: { message?: string } } }) => {
        const message =
          error?.response?.data?.message || "Failed to delete transaction";
        toast.error(message);
      },
    });

  return { deleteTransactionMutation, isDeletingTransaction };
};

// ==================== REPORTS ====================

export const useGetFinanceReports = (
  startDate?: string,
  endDate?: string,
  accountIds?: number[]
) => {
  const { data, isPending: isGettingReports } = useQuery({
    queryKey: ["finance-reports", startDate, endDate, accountIds],
    queryFn: () =>
      getFinanceReports({
        startDate,
        endDate,
        account_ids: accountIds,
      }),
    retry: false,
  });

  return {
    reports: data?.data,
    isGettingReports,
  };
};

export const useGetAccountReport = (
  accountId: number | null,
  startDate?: string,
  endDate?: string
) => {
  const { data, isPending: isGettingAccountReport } = useQuery({
    queryKey: ["finance-account-report", accountId, startDate, endDate],
    queryFn: () =>
      getAccountReport({ id: accountId!, startDate, endDate }),
    enabled: !!accountId,
    retry: false,
  });

  return {
    report: data?.data,
    isGettingAccountReport,
  };
};

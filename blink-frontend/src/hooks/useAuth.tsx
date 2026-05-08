import {
  checkAuth,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signUp,
  changePassword,
  updateProfile,
} from "@/api/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useSignUp = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: signUpMutation, isPending: isSigningUp } = useMutation({
    mutationKey: ["signup"],
    mutationFn: signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success(t("signup.success"));
      navigate("/login");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.error(t("signup.error"));
    },
  });

  return { signUpMutation, isSigningUp };
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: loginMutation, isPending: isLoggingin } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success(t("login.success"));
      navigate("/");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.error(t("login.error"));
    },
  });

  return { loginMutation, isLoggingin };
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate: logoutMutation, isPending: isLoggingOut } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["auth"], { status: "error", data: null });
      queryClient.removeQueries({ queryKey: ["auth"] });

      toast.success("Logged out successfully, see you soon.");
      window.location.href = "/";
    },
    onError: () => {
      toast.error("Failed to logout, please try again.");
    },
  });

  return { logoutMutation, isLoggingOut };
};

export const useCheckAuth = () => {
  const { data, isPending: isCheckingAuth } = useQuery({
    queryKey: ["auth"],
    queryFn: checkAuth,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isAdmin = data?.data?.type === "admin";
  const isSecretary = data?.data?.type === "secretary";
  const isDetailer = data?.data?.type === "detailer";
  const isUser = data?.data?.type === "user";

  return {
    isAuthenticated: data?.status === "success",
    isCheckingAuth,
    isAdmin,
    isSecretary,
    isDetailer,
    isUser,
    user: data?.data,
  };
};

export const useForgotPassword = () => {
  const { t } = useTranslation();

  const { mutate: forgotPasswordMutation, isPending: isForgotPassword } =
    useMutation({
      mutationKey: ["forgotPassword"],
      mutationFn: forgotPassword,
      onSuccess: () => {
        toast.success(t("forgotPassword.send.success"));
      },
      onError: () => {
        toast.error(t("forgotPassword.send.error"));
      },
    });

  return { forgotPasswordMutation, isForgotPassword };
};

export const useResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutate: resetPasswordMutation, isPending: isResetPassword } =
    useMutation({
      mutationKey: ["resetPassword"],
      mutationFn: resetPassword,
      onSuccess: () => {
        toast.success(t("forgotPassword.reset.success"));
        navigate("/login");
      },
      onError: () => {
        toast.error(t("forgotPassword.reset.error"));
      },
    });

  return { resetPasswordMutation, isResetPassword };
};

export const useChangePassword = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate: changePasswordMutation, isPending: isChangingPassword } =
    useMutation({
      mutationKey: ["changePassword"],
      mutationFn: changePassword,
      onSuccess: () => {
        toast.success(t("profile.saved"));
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      },
      onError: () => {
        toast.error(t("profile.error"));
      },
    });

  return { changePasswordMutation, isChangingPassword };
};

export const useUpdateProfile = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate: updateProfileMutation, isPending: isUpdatingProfile } =
    useMutation({
      mutationKey: ["updateProfile"],
      mutationFn: updateProfile,
      onSuccess: () => {
        toast.success(t("profile.saved"));
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      },
      onError: () => {
        toast.error(t("profile.error"));
      },
    });

  return { updateProfileMutation, isUpdatingProfile };
};

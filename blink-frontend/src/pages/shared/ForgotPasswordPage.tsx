import { useState, useMemo, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, Lock, KeyRound, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useForgotPassword, useResetPassword } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const { forgotPasswordMutation, isForgotPassword } = useForgotPassword();
  const { resetPasswordMutation, isResetPassword } = useResetPassword();
  const [email, setEmail] = useState("");
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const firstRender = useRef(true);

  // Email validation schema
  const emailSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("validations.email")),
      }),
    [t]
  );

  // Password reset schema
  const resetSchema = useMemo(
    () =>
      z
        .object({
          email: z.string().email(t("validations.email")),
          otpCode: z.string().min(6, t("validations.otp")).max(6),
          newPassword: z.string().min(6, t("validations.password.min")),
          confirmPassword: z.string(),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: t("validations.password.match"),
          path: ["confirmPassword"],
        }),
    [t]
  );

  type EmailFormValues = z.infer<typeof emailSchema>;
  type ResetFormValues = z.infer<typeof resetSchema>;

  // Email form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  // Reset form
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email,
      otpCode: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    emailForm.trigger();
    resetForm.trigger();
  }, [emailForm, locale, resetForm]);

  const onEmailSubmit = (data: EmailFormValues) => {
    setEmail(data.email);
    resetForm.setValue("email", data.email);
    setStep(2);
    forgotPasswordMutation(data);
  };

  const onResetSubmit = (data: ResetFormValues) => {
    resetPasswordMutation(data);
  };

  const backToEmailStep = () => {
    setStep(1);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6"
          >
            <KeyRound className="h-8 w-8 text-primary" />
          </motion.div>
          <h2 className="text-3xl font-bold text-foreground">
            {t("forgotPassword.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === 1
              ? t("forgotPassword.subtitle")
              : t("forgotPassword.otpSubtitle")}
          </p>
        </div>

        <Card className="w-full bg-muted">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {step === 1
                ? t("forgotPassword.enterEmail")
                : t("forgotPassword.resetPassword")}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1
                ? t("forgotPassword.emailInstructions")
                : t("forgotPassword.otpInstructions", { email })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: locale === "ar" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: locale === "ar" ? -50 : 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Form {...emailForm}>
                    <form
                      onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("forgotPassword.emailLabel")}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder={t(
                                    "forgotPassword.emailPlaceholder"
                                  )}
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isForgotPassword}
                      >
                        {isForgotPassword
                          ? t("forgotPassword.sending")
                          : t("forgotPassword.sendOtp")}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: locale === "ar" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: locale === "ar" ? -50 : 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    className="mb-4 p-0 h-auto font-normal text-sm text-muted-foreground hover:text-foreground"
                    onClick={backToEmailStep}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {t("forgotPassword.backToEmail")}
                  </Button>

                  <Form {...resetForm}>
                    <form
                      onSubmit={resetForm.handleSubmit(onResetSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={resetForm.control}
                        name="otpCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("forgotPassword.otpLabel")}
                            </FormLabel>
                            <FormControl>
                              <InputOTP
                                maxLength={6}
                                {...field}
                                className="justify-center"
                              >
                                <InputOTPGroup
                                  dir="ltr"
                                  className="flex justify-center items-center w-full"
                                >
                                  {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <InputOTPSlot
                                      key={index}
                                      index={index}
                                      className="w-15 h-15 text-lg bg-primary/50"
                                    />
                                  ))}
                                </InputOTPGroup>
                              </InputOTP>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={resetForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("forgotPassword.newPasswordLabel")}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder={t(
                                    "forgotPassword.newPasswordPlaceholder"
                                  )}
                                  className="pl-10 pr-10"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={togglePasswordVisibility}
                                  className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={resetForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("forgotPassword.confirmPasswordLabel")}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  placeholder={t(
                                    "forgotPassword.confirmPasswordPlaceholder"
                                  )}
                                  className="pl-10 pr-10"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={toggleConfirmPasswordVisibility}
                                  className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isResetPassword}
                      >
                        {isResetPassword
                          ? t("forgotPassword.resetting")
                          : t("forgotPassword.resetButton")}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t("forgotPassword.rememberPassword")}{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/90"
            >
              {t("forgotPassword.backToLogin")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

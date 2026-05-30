import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { isValidPhone } from "@/shared/phoneUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/form";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSignUp } from "@/hooks/useAuth";
import { useTheme } from "@/context/theme-provider";

export function SignupForm() {
  const { signUpMutation, isSigningUp } = useSignUp();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signupSchema = z
    .object({
      name: z.string().min(2, t("validations.name.min")),
      email: z.string().email(t("validations.email")),
      phone: z
        .string()
        .refine(isValidPhone, t("validations.phone.generic")),
      password: z.string().min(6, t("validations.password.min")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validations.password.match"),
      path: ["confirmPassword"],
    });

  type SignupFormData = z.infer<typeof signupSchema>;

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      form.trigger();
    }
  }, [t, form]);

  const onSubmit = (data: SignupFormData) => {
    signUpMutation(data);
  };

  return (
    <div
      data-aos="fade-up"
      data-aos-duration="500"
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-lg border-0 bg-card">
        {/* Header */}
        <CardHeader className="space-y-6 text-center">
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            data-aos-duration="300"
            className="flex justify-center"
          >
            <img
              src={theme === "light" ? "/white-logo.png" : "/dark-logo.png"}
              alt="BLINK Logo"
              className="h-20 w-auto"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {t("signup.title")}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              {t("signup.description")}
            </CardDescription>
          </div>
        </CardHeader>
        {/* Content */}
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      {t("signup.name")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder={t("signup.name")}
                          className="pl-10 h-12 bg-input border-border focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </FormControl>
                    {fieldState.error && (
                      <p className="text-sm font-medium text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      {t("signup.email")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="email"
                          placeholder={t("signup.email")}
                          className="pl-10 h-12 bg-input border-border focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </FormControl>
                    {fieldState.error && (
                      <p className="text-sm font-medium text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      {t("signup.phone")}
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value}
                        onChange={field.onChange}
                        error={!!form.formState.errors.phone}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="text-sm font-medium text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      {t("signup.password")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder={t("signup.password")}
                          className="pl-10 pr-10 h-12 bg-input border-border focus:ring-2 focus:ring-ring"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    {fieldState.error && (
                      <p className="text-sm font-medium text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      {t("signup.confirm_password")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t("signup.confirm_password")}
                          className="pl-10 pr-10 h-12 bg-input border-border focus:ring-2 focus:ring-ring"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    {fieldState.error && (
                      <p className="text-sm font-medium text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSigningUp}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isSigningUp ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  t("signup.create_account")
                )}
              </Button>

              {/* Link to Login */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {t("signup.already_have_account")}{" "}
                  <Link
                    to="/login"
                    className="text-accent hover:text-accent/80 transition-colors underline-offset-4 hover:underline font-medium"
                  >
                    {t("signup.login")}
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

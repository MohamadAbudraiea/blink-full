import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
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
import { useLogin } from "@/hooks/useAuth";
import { useTheme } from "@/context/theme-provider";

export function LoginForm() {
  const { loginMutation, isLoggingin } = useLogin();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = z.object({
    email: z.string().email(t("validations.email")),
    password: z.string().min(6, t("validations.password.min")),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      form.trigger();
    }
  }, [t, form]);

  const onSubmit = (data: LoginFormData) => {
    loginMutation(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-lg border-0 bg-card">
        {/* Header */}
        <CardHeader className="space-y-6 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex justify-center"
          >
            <img
              src={theme === "light" ? "/white-logo.png" : "/dark-logo.png"}
              alt="BLINK Logo"
              className="h-20 w-auto"
            />
          </motion.div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {t("login.title")}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              {t("login.description")}
            </CardDescription>
          </div>
        </CardHeader>
        {/* Content */}
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      {t("login.email")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="email"
                          placeholder={t("login.email")}
                          className="pl-10 h-12 bg-input border-border focus:ring-2 focus:ring-ring"
                          autoComplete="email webauthn"
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

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      {t("login.password")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder={t("login.password")}
                          className="pl-10 pr-10 h-12 bg-input border-border focus:ring-2 focus:ring-ring"
                          autoComplete="current-password"
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

              {/* Forgot password */}
              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-accent hover:text-accent/80 transition-colors underline-offset-4 hover:underline"
                >
                  {t("login.forgot_password")}
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoggingin}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoggingin ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  t("login.login")
                )}
              </Button>

              {/* Create account */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {t("login.create_account")}{" "}
                  <Link
                    to="/signup"
                    className="text-accent hover:text-accent/80 transition-colors underline-offset-4 hover:underline font-medium"
                  >
                    {t("login.signup")}
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

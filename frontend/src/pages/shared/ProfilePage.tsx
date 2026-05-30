import { useEffect, useRef, useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { User, Mail, Phone, Lock, Eye, EyeOff, Save } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCheckAuth } from "@/hooks/useAuth";
import { arabicDate, englishDate } from "@/shared/utils";
import { useChangePassword, useUpdateProfile } from "@/hooks/useAuth";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { isValidPhone } from "@/shared/phoneUtils";

export default function ProfilePage() {
  const { user } = useCheckAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const { changePasswordMutation, isChangingPassword } = useChangePassword();
  const { updateProfileMutation, isUpdatingProfile } = useUpdateProfile();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const firstRender = useRef(true);

  const isSubmitting = isChangingPassword || isUpdatingProfile;

  // User profile schema
  const profileSchema = z
    .object({
      name: z.string().min(2, t("validations.name.min")),
      email: z.string().email(t("validations.email")),
      phone: z
        .string()
        .refine(isValidPhone, t("validations.phone.generic")),
      currentPassword: z.string().optional(),
      newPassword: z
        .string()
        .min(6, t("validations.password.min"))
        .optional()
        .or(z.literal("")),
      confirmPassword: z.string().optional().or(z.literal("")),
    })
    .refine(
      (data) => {
        // If currentPassword is provided, newPassword must also be provided
        if (data.currentPassword && !data.newPassword) {
          return false;
        }
        return true;
      },
      {
        message: t("validations.password.new"),
        path: ["newPassword"],
      }
    )
    .refine(
      (data) => {
        // If newPassword is provided, confirmPassword must match
        if (data.newPassword && data.newPassword !== data.confirmPassword) {
          return false;
        }
        return true;
      },
      {
        message: t("validations.password.match"),
        path: ["confirmPassword"],
      }
    );

  type ProfileFormValues = z.infer<typeof profileSchema>;

  // Profile form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    form.trigger();
  }, [locale, form]);

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user, form]);

  const onSubmit = (data: ProfileFormValues) => {
    if (activeTab === "profile") {
      // Update profile only
      updateProfileMutation({
        name: data.name,
        phone: data.phone,
        email: data.email,
      });
    } else if (
      activeTab === "security" &&
      data.currentPassword &&
      data.newPassword
    ) {
      // Change password
      changePasswordMutation({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      // Reset password fields on success
      form.resetField("currentPassword");
      form.resetField("newPassword");
      form.resetField("confirmPassword");
    }
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Make sure user exists before rendering
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div
        data-aos="fade-up"
        data-aos-duration="500"
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-start gap-8">
          {/* Profile Sidebar */}
          <Card className="w-full sm:w-1/3 bg-muted">
            <CardHeader className="items-center">
              <Avatar className="h-24 w-24 justify-self-center">
                <AvatarFallback className="text-2xl font-semibold uppercase bg-muted-foreground text-background">
                  {user.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <CardTitle className="text-center mt-4">{user.name}</CardTitle>
              <CardDescription className="text-center">
                {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>
                    {t("profile.joined_on")}{" "}
                    {locale === "ar"
                      ? arabicDate(user.created_at)
                      : englishDate(user.created_at)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="w-full sm:w-2/3 bg-muted">
            <CardHeader>
              <CardTitle>{t("profile.title")}</CardTitle>
              <CardDescription>{t("profile.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid min-w-full grid-cols-2">
                  <TabsTrigger value="profile">
                    {t("profile.tabs.profile")}
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    {t("profile.tabs.security")}
                  </TabsTrigger>
                </TabsList>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 mt-6"
                  >
                    <AnimatePresence mode="wait">
                      {/* Profile Tab */}
                      {activeTab === "profile" && (
                        <motion.div
                          key="profile"
                          initial={{
                            opacity: 0,
                            x: locale === "ar" ? 50 : -50,
                          }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: locale === "ar" ? -50 : 50 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("profile.form.name")}</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      placeholder={t(
                                        "profile.form.namePlaceholder"
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

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("profile.form.email")}</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      placeholder={t(
                                        "profile.form.emailPlaceholder"
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

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("profile.form.phone")}</FormLabel>
                                <FormControl>
                                  <PhoneInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={!!form.formState.errors.phone}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}

                      {/* Security Tab */}
                      {activeTab === "security" && (
                        <motion.div
                          key="security"
                          initial={{
                            opacity: 0,
                            x: locale === "ar" ? 50 : -50,
                          }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: locale === "ar" ? -50 : 50 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t("profile.form.currentPassword")}
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      type={
                                        showCurrentPassword
                                          ? "text"
                                          : "password"
                                      }
                                      autoComplete="current-password"
                                      placeholder={t(
                                        "profile.form.currentPasswordPlaceholder"
                                      )}
                                      className="pl-10 pr-10"
                                      {...field}
                                    />
                                    <button
                                      type="button"
                                      onClick={toggleCurrentPasswordVisibility}
                                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                                    >
                                      {showCurrentPassword ? (
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
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t("profile.form.newPassword")}
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      type={
                                        showNewPassword ? "text" : "password"
                                      }
                                      autoComplete="new-password"
                                      placeholder={t(
                                        "profile.form.newPasswordPlaceholder"
                                      )}
                                      className="pl-10 pr-10"
                                      {...field}
                                    />
                                    <button
                                      type="button"
                                      onClick={toggleNewPasswordVisibility}
                                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                                    >
                                      {showNewPassword ? (
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
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t("profile.form.confirmPassword")}
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      type={
                                        showConfirmPassword
                                          ? "text"
                                          : "password"
                                      }
                                      autoComplete="new-password"
                                      placeholder={t(
                                        "profile.form.confirmPasswordPlaceholder"
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
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Separator />

                    <div className="flex justify-end">
                      <AnimatePresence mode="wait">
                        {
                          <Button
                            type="submit"
                            disabled={isSubmitting || !form.formState.isValid}
                            className="min-w-24"
                          >
                            {isSubmitting ? (
                              <>{t("profile.saving")}...</>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                {t("profile.save")}
                              </>
                            )}
                          </Button>
                        }
                      </AnimatePresence>
                    </div>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Loader2, Mail, Phone, Send, User } from "lucide-react";
import { useCheckAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSendMessage } from "@/hooks/useUser";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

function ContactInfoSection() {
  const { t, i18n } = useTranslation();
  const { user } = useCheckAuth();
  const locale = i18n.language;
  const { isSendingMessage, sendMessageMutation } = useSendMessage();

  const formSchema = z
    .object({
      name: z.string().min(2, t("validations.name.min")),
      email: z.string().email(t("validations.email")),
      subject: z.string().min(3, t("validations.subject.min")),
      message: z.string().min(5, t("validations.message.min")),
    })
    .required();

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      form.trigger();
    }
  }, [t, form]);

  const onSubmit = (data: FormData) => {
    sendMessageMutation(data);
  };

  const contactInfo = [
    {
      icon: Phone,
      titleKey: "contact.info.phone.title",
      linkKey: "contact.info.phone.link",
      contentKey: "contact.info.phone.content",
      color: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      icon: Send,
      titleKey: "contact.info.whatsapp.title",
      linkKey: "contact.info.whatsapp.link",
      contentKey: "contact.info.whatsapp.content",
      color: "bg-green-500/10",
      iconColor: "text-green-500",
    },
    {
      icon: Mail,
      titleKey: "contact.info.email.title",
      linkKey: "contact.info.email.link",
      contentKey: "contact.info.email.content",
      color: "bg-red-500/10",
      iconColor: "text-red-500",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Information - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {t("contact.info.title")}
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t("contact.info.description")}
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <a
                    href={t(info.linkKey)}
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start p-4 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors duration-300 mt-4"
                      dir="ltr"
                    >
                      <div
                        className={`p-3 rounded-full ${info.color} mr-4 flex-shrink-0`}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${info.iconColor}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {t(info.titleKey)}
                        </h3>
                        <p>{t(info.contentKey)}</p>
                      </div>
                    </motion.div>
                  </a>
                );
              })}
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-6 bg-primary/5 rounded-lg border-l-4 border-primary"
            >
              <h3 className="font-semibold text-foreground mb-2">
                {t("contact.response.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("contact.response.message")}
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <Card className="shadow-lg border-0 overflow-hidden rounded-lg bg-muted/50 py-0">
              {/* Title */}
              <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground rounded-t-lg ">
                <h2 className="text-2xl font-bold flex items-center text-foreground">
                  <Send className="h-5 w-5 mr-2" />
                  {t("contact.form.title")}
                </h2>
              </div>

              {/* Form */}
              <CardContent className="p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Name and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel className="text-foreground flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {t("contact.form.name")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="name"
                                type="text"
                                placeholder={t("contact.form.name_placeholder")}
                                required
                                className="h-12"
                                {...field}
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
                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel className="text-foreground flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {t("contact.form.email")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="email"
                                type="email"
                                placeholder={t(
                                  "contact.form.email_placeholder"
                                )}
                                required
                                className="h-12"
                                {...field}
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
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">
                              {t("contact.form.subject")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="subject"
                                type="text"
                                placeholder={t(
                                  "contact.form.subject_placeholder"
                                )}
                                required
                                className="h-12"
                                {...field}
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
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">
                              {t("contact.form.message")}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                id="message"
                                placeholder={t(
                                  "contact.form.message_placeholder"
                                )}
                                required
                                className="h-32"
                                {...field}
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
                    </div>

                    <div>
                      <Button
                        type="submit"
                        className="w-full h-12 text-foreground bg-primary hover:bg-primary/90 transition-all duration-200"
                        size="lg"
                        disabled={isSendingMessage}
                      >
                        {isSendingMessage ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="mr-2 h-4 w-4" />
                        )}
                        {t("contact.form.submit")}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactInfoSection;

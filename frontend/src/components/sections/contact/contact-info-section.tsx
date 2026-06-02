import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Loader2,
  Mail,
  Phone,
  Send,
  User,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
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
  const isRTL = locale === "ar";
  const { isSendingMessage, sendMessageMutation, isSuccess } = useSendMessage();
  const [step, setStep] = useState(1);

  const formSchema = z.object({
    name: z.string().min(2, t("validations.name.min")),
    email: z.string().email(t("validations.email")),
    subject: z.string().min(3, t("validations.subject.min")),
    message: z.string().min(5, t("validations.message.min")),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      subject: "",
      message: "",
    },
    mode: "onChange",
  });

  const messageValue = form.watch("message") || "";
  const MAX_CHARS = 500;

  const onSubmit = (data: FormData) => {
    sendMessageMutation(data);
  };

  const nextStep = async () => {
    const fieldsToValidate =
      step === 1 ? ["name", "email"] : ["subject", "message"];
    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

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

  if (isSuccess) {
    return (
      <section className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div
            data-aos="zoom-in"
            data-aos-duration="600"
            className="max-w-xl mx-auto bg-muted/30 backdrop-blur-xl border border-primary/20 rounded-[2.5rem] p-12 text-center"
          >
            <div
              className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <h2 className="font-nativera text-3xl font-black text-foreground mb-4 tracking-tighter italic uppercase">
              {t("contact.form.success.title")}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t("contact.form.success.message")}
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="rounded-full px-8 py-6 h-auto text-base font-bold uppercase tracking-widest border-primary/20 hover:bg-primary/10"
            >
              Send Another Message
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-2 space-y-12">
            <div
              data-aos={isRTL ? "fade-left" : "fade-right"}
              data-aos-duration="800"
            >
              <h2 className="font-nativera text-4xl font-black text-foreground mb-6 tracking-tighter italic uppercase">
                {t("contact.info.title")}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {t("contact.info.description")}
              </p>

              <div className="grid gap-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <a
                      key={index}
                      href={t(info.linkKey)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      className="group flex items-center p-5 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all duration-300"
                    >
                      <div
                        className={`p-3 rounded-full ${info.color} group-hover:scale-110 transition-transform`}
                      >
                        <Icon className={`w-5 h-5 ${info.iconColor}`} />
                      </div>
                      <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-0.5">
                          {t(info.titleKey)}
                        </p>
                        <p dir="ltr" className="font-bold text-foreground">
                          {t(info.contentKey)}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div
              data-aos="fade-in"
              data-aos-duration="600"
              className="p-8 bg-muted/20 rounded-4xl border-l-4 border-primary"
            >
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                {t("contact.response.title")}
              </p>
              <p className="text-foreground/80 font-medium">
                {t("contact.response.message")}
              </p>
            </div>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="600"
            className="lg:col-span-3"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur-xl opacity-50 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative bg-muted/40 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
                <div className="bg-primary/10 p-8 border-b border-border/50 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter italic uppercase text-foreground">
                      {t("contact.form.title")}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mt-1">
                      Step {step} of 2
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? "w-8 bg-primary" : "w-1.5 bg-primary/20"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-10">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <AnimatePresence mode="wait">
                        {step === 1 ? (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                            className="space-y-6"
                          >
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    {t("contact.form.name")}
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                      <Input
                                        {...field}
                                        className="h-14 pl-12 rounded-2xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-base"
                                        placeholder={t(
                                          "contact.form.name_placeholder",
                                        )}
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    {t("contact.form.email")}
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                      <Input
                                        {...field}
                                        className="h-14 pl-12 rounded-2xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-base"
                                        placeholder={t(
                                          "contact.form.email_placeholder",
                                        )}
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              onClick={nextStep}
                              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase italic tracking-widest transition-all hover:scale-[1.02] active:scale-95"
                            >
                              Next Details
                              <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                            className="space-y-6"
                          >
                            <FormField
                              control={form.control}
                              name="subject"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    {t("contact.form.subject")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="h-14 px-5 rounded-2xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-base"
                                      placeholder={t(
                                        "contact.form.subject_placeholder",
                                      )}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="message"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex justify-between items-center px-1">
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                      {t("contact.form.message")}
                                    </FormLabel>
                                    <span
                                      className={`text-[10px] font-bold ${messageValue.length > MAX_CHARS ? "text-destructive" : "text-muted-foreground"}`}
                                    >
                                      {messageValue.length} / {MAX_CHARS}
                                    </span>
                                  </div>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      className="min-h-32 p-5 rounded-2xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-base resize-none"
                                      placeholder={t(
                                        "contact.form.message_placeholder",
                                      )}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <div className="flex gap-4">
                              <Button
                                type="button"
                                onClick={prevStep}
                                variant="outline"
                                className="flex-1 h-14 rounded-2xl border-border/50 font-black uppercase italic tracking-widest"
                              >
                                <ChevronLeft className="mr-2 w-5 h-5" />
                                Back
                              </Button>
                              <Button
                                type="submit"
                                disabled={isSendingMessage}
                                className="flex-2 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase italic tracking-widest shadow-lg shadow-primary/20"
                              >
                                {isSendingMessage ? (
                                  <Loader2 className="animate-spin w-5 h-5" />
                                ) : (
                                  <Send className="mr-2 w-5 h-5" />
                                )}
                                {t("contact.form.submit")}
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactInfoSection;

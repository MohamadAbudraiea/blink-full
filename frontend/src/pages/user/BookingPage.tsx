import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useAddTicket } from "@/hooks/useUser";
import { useGetPricing } from "@/hooks/usePricing";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Car,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit2,
  MapPin,
  Shield,
  Sparkles,
  Star,
  Tag,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";
import { LocationInput } from "@/components/shared/LocationInput";

const serviceTypeOptions: Record<
  string,
  {
    value: string;
    icon: React.ElementType;
    isBest?: boolean;
  }[]
> = {
  wash: [
    {
      value: "Classic",
      icon: Shield,
    },
    {
      value: "premium",
      icon: Sparkles,
      isBest: true,
    },
  ],
  dryclean: [
    {
      value: "Classic",
      icon: Sparkles,
    },
    {
      value: "premium",
      icon: Shield,
      isBest: true,
    },
  ],
  polish: [
    {
      value: "oneStage",
      icon: Check,
    },
    {
      value: "threeStage",
      icon: Zap,
      isBest: true,
    },
  ],
};

const visualServicesList = [
  { id: "wash", icon: Sparkles, bgImage: "/wash1.webp" },
  { id: "dryclean", icon: Star, bgImage: "/dryclean1.webp" },
  { id: "polish", icon: Zap, bgImage: "/polish1.webp" },
  {
    id: "nanoceramic",
    icon: Shield,
    bgImage: "/nano1.webp",
  },
  {
    id: "graphene",
    icon: Shield,
    bgImage: "/nano1.webp",
  },
];

export default function BookPage() {
  const { addTicketMutation, isAddingTicket } = useAddTicket();
  const { pricing } = useGetPricing();
  const { t, i18n } = useTranslation();

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const totalSteps = 4;

  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  const bookingSchema = z
    .object({
      service: z.string().min(1, t("errors.service_required")),
      typeOfService: z.string().optional(),
      location: z.string().min(5, t("errors.address_required")),
      note: z.string().optional(),
      date: z.date().optional(),
      start_time: z.string().optional(),
      end_time: z.string().optional(),
    })
    .refine(
      (data) => {
        const requiresType = ["wash", "dryclean", "polish"].includes(
          data.service,
        );
        if (requiresType && !data.typeOfService) {
          return false;
        }
        return true;
      },
      {
        message: t("errors.service_type_required"),
        path: ["typeOfService"],
      },
    );

  type BookingFormData = z.infer<typeof bookingSchema>;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: "",
      typeOfService: "",
      location: "",
      note: "",
      date: undefined,
      start_time: "",
      end_time: "",
    },
  });

  const selectedService = watch("service");
  const selectedType = watch("typeOfService");
  const requiresType = ["wash", "dryclean", "polish"].includes(selectedService);


  const onSubmit = (data: BookingFormData) => {
    const localISO = data.date
      ? new Date(
        data.date.getTime() - data.date.getTimezoneOffset() * 60000,
      ).toISOString()
      : undefined;

    const pricingRow = pricing.find((p) => p.service === data.service);
    const finalPrice = pricingRow ? Math.round(Number(pricingRow.base_price)) : undefined;

    addTicketMutation({
      service: data.service,
      typeOfService: data.typeOfService || undefined,
      location: data.location,
      note: data.note || undefined,
      date: localISO || undefined,
      start_time: data.start_time || undefined,
      end_time: data.end_time || undefined,
      price: finalPrice,
    });

    setCurrentStep(1);
    setValue("service", "");
    setValue("typeOfService", "");
    setValue("location", "");
    setValue("note", "");
    setValue("date", undefined);
    setValue("start_time", "");
    setValue("end_time", "");
  };

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger("service");
      if (isValid && !requiresType) {
        setDirection(1);
        setCurrentStep(3);
        return;
      }
    } else if (currentStep === 2) {
      isValid = await trigger("typeOfService");
    } else if (currentStep === 3) {
      isValid = await trigger(["location"]);
    }

    if (isValid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    if (currentStep === 3 && !requiresType) {
      setCurrentStep(1);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const jumpToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const variants = {
    enter: (direction: number) => ({
      x:
        direction > 0
          ? dir === "rtl"
            ? -100
            : 100
          : dir === "rtl"
            ? 100
            : -100,
      opacity: 0,
    }),
    center: {
      z: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      z: 0,
      x:
        direction < 0
          ? dir === "rtl"
            ? -100
            : 100
          : dir === "rtl"
            ? 100
            : -100,
      opacity: 0,
    }),
  };

  return (
    <>
      <section className="relative pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div data-aos="fade-down" data-aos-duration="600">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              {t("book.hero.title")}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              {t("book.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 px-4 overflow-hidden">
        <div className="max-w-3xl mx-auto relative">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center relative z-10">
              {[1, 2, 3, 4].map((step) => {
                const isActive = step === currentStep;
                const isPast = step < currentStep;
                const isSkipped =
                  step === 2 && !requiresType && currentStep > 2;

                if (isSkipped) return null; // Don't render the dot if skipped

                return (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${isActive
                        ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                        : isPast
                          ? "bg-primary/20 text-primary border border-primary/50"
                          : "bg-muted text-muted-foreground border border-border"
                        }`}
                    >
                      {isPast ? <Check className="w-5 h-5" /> : step}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:block ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {t(`book.wizard.steps.step${step}`)}
                    </span>
                  </div>
                );
              })}

              {/* Connecting Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-primary -z-10 transition-transform duration-300 origin-left"
                style={{
                  transform: `scaleX(${(currentStep - 1) / (requiresType ? 3 : 2)})`,
                  transformOrigin: dir === "rtl" ? "right" : "left",
                }}
              />
            </div>
          </div>

          <Card className="bg-muted/30 backdrop-blur-md rounded-2xl shadow-xl border border-border/50 overflow-hidden min-h-[500px] flex flex-col">
            <CardHeader className="bg-muted/50 border-b border-border/50">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Car className="w-6 h-6 text-primary" />
                {t(`book.wizard.steps.step${currentStep}`)}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 p-6 relative">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="w-full"
                >
                  <form
                    id="booking-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* STEP 1: Choose Service */}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <Label className="text-lg">
                          {t("book.form.service")}
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {visualServicesList.map((service) => {
                            const Icon = service.icon;
                            const isSelected = selectedService === service.id;
                            // Pricing deal: base_price + 10% (rounded) vs base_price
                            const pricingRow = pricing.find((p) => p.service === service.id);
                            const basePrice = pricingRow ? Number(pricingRow.base_price) : null;
                            const beforePrice = basePrice !== null ? Math.round(basePrice * 1.1) : null;
                            return (
                              <div
                                key={service.id}
                                onClick={() => {
                                  setValue("service", service.id, {
                                    shouldValidate: true,
                                  });
                                  setValue("typeOfService", ""); // Reset type
                                }}
                                className={`relative group h-40 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${isSelected
                                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                                  : "hover:ring-2 hover:ring-primary/50"
                                  }`}
                              >
                                <div
                                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                  style={{
                                    backgroundImage: `url(${service.bgImage})`,
                                  }}
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/50 to-transparent" />

                                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Icon className="w-5 h-5 text-primary" />
                                    <h3 className="font-bold text-foreground truncate">
                                      {t(`book.form.options.${service.id}`)}
                                    </h3>
                                  </div>
                                  {/* Deal pricing badge */}
                                  {basePrice !== null && basePrice > 0 && (
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <span className="text-xs line-through text-white/50">{beforePrice} JD</span>
                                      <span className="text-sm font-bold text-primary">{Math.round(basePrice)} JD</span>
                                      <span className="text-[10px] bg-primary/80 text-primary-foreground px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                                        <Tag className="w-2.5 h-2.5" /> DEAL
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {isSelected && (
                                  <div className="absolute top-3 right-3 bg-primary rounded-full p-1 shadow-lg">
                                    <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {errors.service && (
                          <p className="text-sm text-destructive font-medium mt-2">
                            {errors.service.message}
                          </p>
                        )}
                      </div>
                    )}

                    {/* STEP 2: Choose Type */}
                    {currentStep === 2 && requiresType && (
                      <div className="space-y-4" dir={dir}>
                        <Label className="text-lg">
                          {t("book.form.service_type")}
                        </Label>
                        <Controller
                          control={control}
                          name="typeOfService"
                          render={({ field }) => (
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col gap-4"
                            >
                              {serviceTypeOptions[selectedService]?.map(
                                (option) => {
                                  const Icon = option.icon;
                                  const isSelected =
                                    field.value === option.value;
                                  return (
                                    <label
                                      key={option.value}
                                      htmlFor={option.value}
                                      className={`relative flex w-full gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${isSelected
                                        ? "border-primary bg-primary/5 shadow-md"
                                        : "border-border/50 bg-card hover:border-primary/30 hover:bg-muted/30"
                                        } ${option.isBest ? "ring-2 ring-primary/20" : ""} ${dir === "rtl" ? "flex-row-reverse" : ""}`}
                                    >
                                      {option.isBest && (
                                        <div className="absolute -top-3.5 -right-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                                          <Star className="w-3 h-3 fill-current" />{" "}
                                          BEST
                                        </div>
                                      )}
                                      <RadioGroupItem
                                        value={option.value}
                                        id={option.value}
                                        className="mt-2"
                                      />
                                      <div className="flex items-start gap-4">
                                        <div
                                          className={`p-3 rounded-xl ${isSelected ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground"}`}
                                        >
                                          <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="font-bold text-lg mb-1">
                                            {t(
                                              `book.serviceTypes.${selectedService}.${option.value}.label`,
                                            )}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            {t(
                                              `book.serviceTypes.${selectedService}.${option.value}.desc`,
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </label>
                                  );
                                },
                              )}
                            </RadioGroup>
                          )}
                        />
                        {errors.typeOfService && (
                          <p className="text-sm text-destructive font-medium mt-2">
                            {errors.typeOfService.message}
                          </p>
                        )}
                      </div>
                    )}

                    {/* STEP 3: Location & Schedule */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        {/* Location */}
                        <div className="space-y-3 bg-card p-5 rounded-xl border border-border/50">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="location"
                              className="flex items-center gap-2 text-base"
                            >
                              <MapPin className="w-5 h-5 text-primary" />{" "}
                              {t("book.form.address")}
                            </Label>
                          </div>
                          <Controller
                            control={control}
                            name="location"
                            render={({ field }) => (
                              <LocationInput
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )}
                          />
                          {errors.location && (
                            <p className="text-sm text-destructive">
                              {errors.location.message}
                            </p>
                          )}
                        </div>

                        {/* Date & Time */}
                        <div className="space-y-4 bg-card p-5 rounded-xl border border-border/50">
                          <Label className="flex items-center gap-2 text-base">
                            <CalendarIcon className="w-5 h-5 text-primary" />{" "}
                            Schedule
                          </Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="date"
                                className="text-xs text-muted-foreground"
                              >
                                {t("book.form.preferred_date")}
                              </Label>
                              <Controller
                                control={control}
                                name="date"
                                render={({ field }) => (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className={`w-full justify-start text-left font-normal h-12 ${!field.value && "text-muted-foreground"}`}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value
                                          ? format(field.value, "PPP")
                                          : t("book.form.date_placeholder")}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                          date <
                                          new Date(
                                            new Date().setHours(0, 0, 0, 0),
                                          )
                                        }
                                      />
                                    </PopoverContent>
                                  </Popover>
                                )}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="start_time"
                                className="text-xs text-muted-foreground"
                              >
                                {t("book.form.start_time")}
                              </Label>
                              <Input
                                id="start_time"
                                type="time"
                                className="h-12"
                                {...register("start_time")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: Review & Confirm */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />

                          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                            {t("book.wizard.summary.title")}
                          </h3>

                          <div className="space-y-6">
                            {/* Service Details */}
                            <div className="flex justify-between items-start group">
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">
                                  {t("book.wizard.summary.service")}
                                </div>
                                <div className="font-bold text-lg">
                                  {t(`book.form.options.${selectedService}`)}
                                </div>
                                {requiresType && selectedType && (
                                  <div className="text-sm text-primary mt-1">
                                    {t(
                                      `book.serviceTypes.${selectedService}.${selectedType}.label`,
                                    )}
                                  </div>
                                )}
                                {/* Deal price display on review step */}
                                {(() => {
                                  const row = pricing.find((p) => p.service === selectedService);
                                  const base = row ? Number(row.base_price) : null;
                                  if (!base || base === 0) return null;
                                  const before = Math.round(base * 1.1);
                                  return (
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-sm line-through text-muted-foreground">{before} JD</span>
                                      <span className="text-base font-black text-primary">{Math.round(base)} JD</span>
                                      <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-bold">DEAL</span>
                                    </div>
                                  );
                                })()}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => jumpToStep(1)}
                                className="opacity-50 group-hover:opacity-100"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Schedule */}
                            <div className="flex justify-between items-start group">
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">
                                  {t("book.wizard.summary.schedule")}
                                </div>
                                <div className="font-medium">
                                  {watch("date")
                                    ? format(watch("date")!, "PPP")
                                    : t("book.wizard.summary.not_provided")}
                                  {watch("start_time") &&
                                    ` • ${watch("start_time")}`}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => jumpToStep(3)}
                                className="opacity-50 group-hover:opacity-100"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Location */}
                            <div className="flex justify-between items-start group">
                              <div className="w-3/4">
                                <div className="text-sm text-muted-foreground mb-1">
                                  {t("book.wizard.summary.location")}
                                </div>
                                <div
                                  className="font-medium truncate"
                                  title={watch("location")}
                                >
                                  {watch("location")}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => jumpToStep(3)}
                                className="opacity-50 group-hover:opacity-100"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2 pt-4 border-t border-border/50">
                              <Label
                                htmlFor="note"
                                className="text-sm text-muted-foreground"
                              >
                                {t("book.wizard.summary.notes")}
                              </Label>
                              <Textarea
                                id="note"
                                placeholder={t("book.form.notes_placeholder")}
                                rows={2}
                                className="resize-none bg-background/50 border-white/10"
                                {...register("note")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </motion.div>
              </AnimatePresence>
            </CardContent>

            {/* Wizard Navigation Footer */}
            <div className="p-6 bg-muted/50 border-t border-border/50 flex items-center justify-between mt-auto">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  className="gap-2"
                >
                  <ChevronLeft
                    className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`}
                  />{" "}
                  {t("book.wizard.navigation.back")}
                </Button>
              ) : (
                <div /> // Spacer
              )}

              {currentStep < 4 ? (
                <Button type="button" onClick={handleNext} className="gap-2">
                  {t("book.wizard.navigation.next")}{" "}
                  <ChevronRight
                    className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`}
                  />
                </Button>
              ) : (
                <Button
                  type="submit"
                  form="booking-form"
                  disabled={isAddingTicket}
                  className="gap-2 px-8"
                >
                  {isAddingTicket ? (
                    t("book.wizard.navigation.submitting")
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      {t("book.wizard.navigation.confirm")}
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}

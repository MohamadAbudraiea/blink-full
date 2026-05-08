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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAddTicket } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Car,
  Check,
  Copy,
  MapPin,
  Navigation,
  Shield,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";

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

export default function BookPage() {
  const { addTicketMutation, isAddingTicket } = useAddTicket();
  const { t, i18n } = useTranslation();
  const [isLocating, setIsLocating] = useState(false);
  const [googleMapsLink, setGoogleMapsLink] = useState("");

  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  const bookingSchema = z
    .object({
      service: z.string().min(1, t("errors.service_required")),
      typeOfService: z.string().optional(),
      location: z.string().min(5, t("errors.address_required")),
      note: z.string().optional(),
      date: z.date().optional(),
    })
    .refine(
      (data) => {
        // typeOfService is required only for these services
        const requiresType = ["wash", "dryclean", "polish"].includes(
          data.service,
        );
        // if the service requires a type, make sure it's filled
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
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: "",
      typeOfService: "",
      location: "",
      note: "",
      date: undefined,
    },
  });

  const selectedService = watch("service");

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error(t("errors.geolocation_not_supported"));
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Generate Google Maps link
          const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

          setValue("location", mapsLink, { shouldValidate: true });
          setGoogleMapsLink(mapsLink);
        } catch (error) {
          console.error("Geolocation error:", error);
          toast.error(t("errors.location_error"));
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error(t("errors.location_permission_denied"));
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error(t("errors.location_unavailable"));
            break;
          case error.TIMEOUT:
            toast.error(t("errors.location_timeout"));
            break;
          default:
            toast.error(t("errors.location_unknown"));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const copyToClipboard = () => {
    if (googleMapsLink) {
      navigator.clipboard
        .writeText(googleMapsLink)
        .then(() => {
          toast.success(t("book.form.link_copied"));
        })
        .catch((err) => {
          console.error("Error copying to clipboard:", err);
          toast.error(t("book.form.link_copy_error"));
        });
    }
  };

  const onSubmit = (data: BookingFormData) => {
    const localISO = new Date(
      data.date!.getTime() - data.date!.getTimezoneOffset() * 60000,
    ).toISOString();

    addTicketMutation({
      service: data.service,
      typeOfService: data.typeOfService ?? undefined,
      location: data.location,
      note: data.note ?? undefined,
      date: localISO || undefined,
    });

    setValue("service", "");
    setValue("typeOfService", "");
    setValue("location", "");
    setValue("note", "");
    setValue("date", undefined);
    setGoogleMapsLink("");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              {t("book.hero.title")}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              {t("book.hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-muted/70 rounded-lg shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Car className="w-6 h-6 text-primary" />
                  {t("book.form.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Service Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="service">{t("book.form.service")}</Label>
                    <Controller
                      control={control}
                      name="service"
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Reset type of service when service changes
                            setValue("typeOfService", "");
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t("book.form.service_placeholder")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wash">
                              {t("book.form.options.wash")}
                            </SelectItem>
                            <SelectItem value="dryclean">
                              {t("book.form.options.dryclean")}
                            </SelectItem>
                            <SelectItem value="polish">
                              {t("book.form.options.polish")}
                            </SelectItem>
                            <SelectItem value="nanoceramic">
                              {t("book.form.options.nano")}
                            </SelectItem>
                            <SelectItem value="graphene">
                              {t("book.form.options.graphene")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.service && (
                      <p className="text-sm text-destructive">
                        {errors.service.message}
                      </p>
                    )}
                  </div>

                  {/* Type of Service Selection - Dynamic based on service */}
                  {selectedService && serviceTypeOptions[selectedService] && (
                    <div className="space-y-3" dir={dir}>
                      <Label htmlFor="typeOfService">
                        {t("book.form.service_type")}
                      </Label>
                      <Controller
                        control={control}
                        name="typeOfService"
                        render={({ field }) => (
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col sm:flex-row w-full gap-3 "
                          >
                            {serviceTypeOptions[selectedService].map(
                              (option) => {
                                const Icon = option.icon;
                                return (
                                  <label
                                    key={option.value}
                                    htmlFor={option.value}
                                    className={`relative flex w-full gap-3 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                                      field.value === option.value
                                        ? "border-primary bg-primary/5"
                                        : "border-border bg-card hover:border-primary/50"
                                    } ${
                                      option.isBest
                                        ? "ring-2 ring-primary/20"
                                        : ""
                                    } ${
                                      dir === "rtl"
                                        ? "flex-row-reverse pl-2"
                                        : ""
                                    }`}
                                  >
                                    {option.isBest && (
                                      <div className="absolute -top-3.5 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                                        <Star className="w-3 h-3 fill-current" />
                                        BEST
                                      </div>
                                    )}
                                    <RadioGroupItem
                                      value={option.value}
                                      id={option.value}
                                      className="mt-5"
                                    />
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`p-2 rounded-lg ${
                                          field.value === option.value
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                      >
                                        <Icon className="w-5 h-5" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-semibold text-sm mb-1">
                                          {t(
                                            `book.serviceTypes.${selectedService}.${option.value}.label`,
                                          )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
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
                        <p className="text-sm text-destructive">
                          {errors.typeOfService.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* location */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="location"
                        className="flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        {t("book.form.address")}
                      </Label>
                      {googleMapsLink && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs text-muted-foreground flex items-center gap-1"
                          onClick={copyToClipboard}
                        >
                          <Copy className="w-3 h-3" />
                          {t("book.form.copy_link")}
                        </Button>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        id="location"
                        placeholder={t("book.form.address_placeholder")}
                        {...register("location")}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className={`absolute top-1 ${
                          dir === "ltr" ? "right-2" : "left-2"
                        } h-7 w-7`}
                        onClick={getCurrentLocation}
                        disabled={isLocating}
                      >
                        <Navigation
                          className={`h-4 w-4 ${
                            isLocating ? "animate-spin" : ""
                          }`}
                        />
                      </Button>
                    </div>
                    {errors.location && (
                      <p className="text-sm text-destructive">
                        {errors.location.message}
                      </p>
                    )}
                  </div>

                  {/* Preferred Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date">
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
                              className={`w-full justify-start text-left font-normal ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(field.value, "PPP")
                                : t("book.form.date_placeholder")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.date && (
                      <p className="text-sm text-destructive">
                        {errors.date.message}
                      </p>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="note">{t("book.form.notes")}</Label>
                    <Textarea
                      id="note"
                      placeholder={t("book.form.notes_placeholder")}
                      rows={3}
                      {...register("note")}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isAddingTicket}
                  >
                    {isAddingTicket
                      ? t("book.form.submitting")
                      : t("book.form.submit")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  );
}

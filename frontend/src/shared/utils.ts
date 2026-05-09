import { formatDate } from "date-fns";
import type { ServiceType, StatusType } from "./types";
import i18next, { t } from "i18next";

export const getStatusBadgeConfig = (status: StatusType) => {
  const statusConfig = {
    requested: {
      variant: "warning",
      icon: "AlertCircle",
      text: t("book.status.requested"),
    },
    pending: {
      variant: "default",
      icon: "Clock",
      text: t("book.status.pending"),
    },
    finished: {
      variant: "success",
      icon: "CheckCircle",
      text: t("book.status.finished"),
    },
    canceled: {
      variant: "destructive",
      icon: "X",
      text: t("book.status.canceled"),
    },
  };

  return statusConfig[status];
};

export const getServiceName = (service: ServiceType): string => {
  const serviceNames = {
    wash: t("book.form.options.wash"),
    dryclean: t("book.form.options.dryclean"),
    polish: t("book.form.options.polish"),
    nano: t("book.form.options.nano"),
    graphene: t("book.form.options.graphene"),
  };
  return serviceNames[service];
};

export const getBorderColorClass = (status: string) => {
  switch (status) {
    case "requested":
      return "border-yellow-500 border-3";
    case "pending":
      return "border-primary border-3";
    case "finished":
      return "border-green-500 border-3";
    case "canceled":
      return "border-destructive border-3";
    default:
      return "border-border";
  }
};

export const arabicDate = (date: string | null) => {
  if (!date) return "";
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  const formattedDate = formatDate(new Date(date), "dd/MM/yyyy");
  return formattedDate.replace(/\d/g, (d) => arabicDigits[+d]);
};

export const englishDate = (date: string | null) => {
  if (!date) return "";
  return formatDate(new Date(date), "dd/MM/yyyy");
};

export const formatTime = (time: string | null) => {
  if (!time) return "";
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds || 0);

  return date.toLocaleTimeString(i18next.language, {
    numberingSystem: i18next.language === "ar" ? "arab" : "latn",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(i18next.language, {
    numberingSystem: i18next.language === "ar" ? "arab" : "latn",
    maximumFractionDigits: 2,
    style: "currency",
    currency: "JOD",
  }).format(amount);
};

export const formatInterval = (interval: string) => {
  // interval example: "17:00:00 - 18:00:00"
  const [start, end] = interval.split(" - ");

  return `${formatTime(start)} - ${formatTime(end)}`;
};

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getYears(startYear: number, endYear: number): number[] {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years.reverse();
}

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const monthsArabic = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export const statusColors: Record<string, string> = {
  Pending: "#3b82f6",
  Finished: "#22c55e",
  Canceled: "#ef4444",
  Requested: "#facc15",
};

export const serviceThemeColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

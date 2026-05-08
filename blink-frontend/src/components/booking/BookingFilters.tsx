import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { months, monthsArabic, getDaysInMonth, getYears } from "@/shared/utils";
import { useBookingStore } from "@/stores/useBookingStore";
import { useTranslation } from "react-i18next";

function BookingFilters({
  selectItems,
}: {
  selectItems: Record<string, string>;
}) {
  const { t, i18n } = useTranslation();
  const {
    filter,
    filterMonth,
    filterDay,
    filterYear,
    setFilter,
    setFilterMonth,
    setFilterDay,
    setFilterYear,
    setCurrentPage,
  } = useBookingStore();

  // Get current date for default values
  const now = new Date();
  const currentYear = now.getFullYear();

  // Calculate days in selected month and year
  const selectedYear = filterYear ? parseInt(filterYear) : currentYear;
  const daysInSelectedMonth = filterMonth
    ? getDaysInMonth(selectedYear, Number(filterMonth) - 1)
    : 31;

  const years = getYears(2025, currentYear);

  // Use appropriate months array based on language
  const currentMonths = i18n.language === "ar" ? monthsArabic : months;

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleMonthChange = (month: string | null) => {
    setFilterMonth(month);
    setFilterDay(null);
    setCurrentPage(1);
  };

  const handleDayChange = (day: string | null) => {
    setFilterDay(day);
    setCurrentPage(1);
  };

  const handleYearChange = (year: string | null) => {
    setFilterYear(year);
    setCurrentPage(1);
  };

  const arabicSelectItems = {
    requested: "مطلوبة",
    pending: "قيد الانتظار",
    canceled: "ملغاة",
    finished: "مكتملة",
    All: "الكل",
  };

  if (i18n.language === "ar") {
    selectItems = arabicSelectItems;
  }

  return (
    <div
      className="mb-4 flex flex-wrap items-center gap-4"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <span className="font-medium">{t("booking_filters.status")}:</span>
        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-40 rounded-md border-muted-foreground bg-muted/50">
            <SelectValue placeholder={t("booking_filters.all")} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(selectItems).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Filter */}
      <div className="flex items-center gap-2">
        <span className="font-medium">{t("booking_filters.year")}:</span>
        <Select
          value={filterYear ?? "all"}
          onValueChange={(value) =>
            handleYearChange(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-28 rounded-md border-muted-foreground bg-muted/50">
            <SelectValue placeholder={t("booking_filters.all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("booking_filters.all")}</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Month Filter */}
      <div className="flex items-center gap-2">
        <span className="font-medium">{t("booking_filters.month")}:</span>
        <Select
          value={filterMonth ?? "all"}
          onValueChange={(value) =>
            handleMonthChange(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-28 rounded-md border-muted-foreground bg-muted/50">
            <SelectValue placeholder={t("booking_filters.all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("booking_filters.all")}</SelectItem>
            {currentMonths.map((monthName, i) => {
              const monthValue = String(i + 1).padStart(2, "0");
              return (
                <SelectItem key={monthValue} value={monthValue}>
                  {monthName}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Day Filter */}
      <div className="flex items-center gap-2">
        <span className="font-medium">{t("booking_filters.day")}:</span>
        <Select
          disabled={filterMonth === "all" || !filterMonth}
          value={filterDay ?? "all"}
          onValueChange={(value) =>
            handleDayChange(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-28 rounded-md border-muted-foreground bg-muted/50">
            <SelectValue placeholder={t("booking_filters.all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("booking_filters.all")}</SelectItem>
            {Array.from({ length: daysInSelectedMonth }, (_, i) => {
              const day = String(i + 1).padStart(2, "0");
              return (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {(filterYear || filterMonth || filterDay || filter !== "All") && (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setFilter("All");
              setFilterYear(null);
              setFilterMonth(null);
              setFilterDay(null);
              setCurrentPage(1);
            }}
          >
            {t("booking_filters.clear_filters")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default BookingFilters;

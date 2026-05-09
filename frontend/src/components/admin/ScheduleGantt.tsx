import { useGetAllDetailersSchedules } from "@/hooks/useAdmin";
import { useMemo, useState, useRef, useEffect } from "react";
import { format, addDays, isSameDay, startOfWeek, endOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGetTicketById } from "@/hooks/useTicket";
import { BookingDialog } from "../booking/BookingDialog";

interface ScheduleEntry {
  ticket_id: string;
  date: string;
  start: string;
  end: string;
  interval: string;
}

interface DetailerSchedule {
  detailer_id: string;
  detailer_name: string;
  schedule: ScheduleEntry[];
}

// Vibrant palette for detailer rows
const DETAILER_COLORS = [
  { bg: "rgba(99, 102, 241, 0.18)", border: "#6366f1", text: "#818cf8" }, // Indigo
  { bg: "rgba(16, 185, 129, 0.18)", border: "#10b981", text: "#34d399" }, // Emerald
  { bg: "rgba(245, 158, 11, 0.18)", border: "#f59e0b", text: "#fbbf24" }, // Amber
  { bg: "rgba(239, 68, 68, 0.18)", border: "#ef4444", text: "#f87171" }, // Red
  { bg: "rgba(168, 85, 247, 0.18)", border: "#a855f7", text: "#c084fc" }, // Purple
  { bg: "rgba(6, 182, 212, 0.18)", border: "#06b6d4", text: "#22d3ee" }, // Cyan
  { bg: "rgba(236, 72, 153, 0.18)", border: "#ec4899", text: "#f472b6" }, // Pink
  { bg: "rgba(34, 197, 94, 0.18)", border: "#22c55e", text: "#4ade80" }, // Green
];

// Time slots from 8:00 to 22:00 (business hours)
const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => i + 8);

function parseTimeToHours(timeStr: string): number {
  const date = new Date(timeStr);
  return date.getHours() + date.getMinutes() / 60;
}

function formatTimeLabel(hour: number): string {
  const ampm = hour >= 12 ? "PM" : "AM";
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${h} ${ampm}`;
}

export function ScheduleGantt() {
  const { detailersSchedules, isGettingSchedules } =
    useGetAllDetailersSchedules();
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 }),
  );
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [hoveredTicket, setHoveredTicket] = useState<string | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{
    entry: ScheduleEntry;
    detailerName: string;
    color: (typeof DETAILER_COLORS)[0];
    x: number;
    y: number;
  } | null>(null);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { ticket: selectedTicketDetails, isFetchingTicket } =
    useGetTicketById(selectedTicketId);

  const ganttRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (ganttRef.current) {
      const now = new Date();
      const currentHour = now.getHours();
      const scrollTarget = Math.max(
        0,
        ((currentHour - 8) / 15) * ganttRef.current.scrollWidth - 200,
      );
      ganttRef.current.scrollLeft = scrollTarget;
    }
  }, [isGettingSchedules]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 0 });

  // Filter data for selected day
  const daySchedules = useMemo(() => {
    if (!detailersSchedules) return [];
    const dateStr = format(selectedDay, "yyyy-MM-dd");

    return (detailersSchedules as DetailerSchedule[])
      .map((d) => ({
        ...d,
        schedule: d.schedule.filter((s) => s.date === dateStr),
      }))
      .filter((d) => d.schedule.length > 0);
  }, [detailersSchedules, selectedDay]);

  // All detailers (even with no schedule for the day) for consistent row display
  const allDetailers = useMemo(() => {
    if (!detailersSchedules) return [];
    return (detailersSchedules as DetailerSchedule[]).map((d) => ({
      detailer_id: d.detailer_id,
      detailer_name: d.detailer_name,
    }));
  }, [detailersSchedules]);

  // Get schedule count per day for the week view dots
  const weekScheduleCounts = useMemo(() => {
    if (!detailersSchedules) return {};
    const counts: Record<string, number> = {};
    (detailersSchedules as DetailerSchedule[]).forEach((d) => {
      d.schedule.forEach((s) => {
        counts[s.date] = (counts[s.date] || 0) + 1;
      });
    });
    return counts;
  }, [detailersSchedules]);

  const goToPrevWeek = () => setCurrentWeekStart((prev) => addDays(prev, -7));
  const goToNextWeek = () => setCurrentWeekStart((prev) => addDays(prev, 7));
  const goToToday = () => {
    const today = new Date();
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 0 }));
    setSelectedDay(today);
  };

  if (isGettingSchedules) return <Loader />;

  if (
    !detailersSchedules ||
    (detailersSchedules as DetailerSchedule[]).length === 0
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Calendar className="h-16 w-16 mb-4 opacity-40" />
        <p className="text-lg font-medium">No detailers found</p>
        <p className="text-sm">Add detailers to see their schedules here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Week Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevWeek}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="px-4 font-medium"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextWeek}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm font-semibold text-muted-foreground tracking-wide">
          {format(currentWeekStart, "MMM d")} –{" "}
          {format(currentWeekEnd, "MMM d, yyyy")}
        </div>
      </div>

      {/* Week Days Selector */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dayStr = format(day, "yyyy-MM-dd");
          const isSelected = isSameDay(day, selectedDay);
          const isToday = isSameDay(day, new Date());
          const count = weekScheduleCounts[dayStr] || 0;

          return (
            <button
              key={dayStr}
              onClick={() => setSelectedDay(day)}
              className={`
                relative flex flex-col items-center gap-1 rounded-xl py-3 px-2 
                transition-all duration-200 cursor-pointer border
                ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
                    : isToday
                      ? "bg-primary/10 border-primary/30 hover:bg-primary/20"
                      : "bg-card border-border hover:bg-accent hover:border-accent-foreground/20"
                }
              `}
            >
              <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">
                {format(day, "EEE")}
              </span>
              <span
                className={`text-lg font-bold ${
                  isSelected ? "" : "text-foreground"
                }`}
              >
                {format(day, "d")}
              </span>
              {count > 0 && (
                <div
                  className={`flex items-center gap-1 text-[10px] font-medium rounded-full px-2 py-0.5
                  ${
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Clock className="h-2.5 w-2.5" />
                  {count}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Gantt Timeline */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        {/* Day Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-muted/50 border-b">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">
              {format(selectedDay, "EEEE, MMMM d, yyyy")}
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {daySchedules.reduce((acc, d) => acc + d.schedule.length, 0)}{" "}
            appointments
          </span>
        </div>

        {allDetailers.length > 0 ? (
          <div className="flex">
            {/* Detailer Names (sticky left column) */}
            <div className="shrink-0 w-40 border-r bg-card z-10">
              {/* Empty header to align with time slots */}
              <div className="h-10 border-b bg-muted/30" />
              {allDetailers.map((d, idx) => {
                const color = DETAILER_COLORS[idx % DETAILER_COLORS.length];
                const hasSchedule = daySchedules.some(
                  (ds) => ds.detailer_id === d.detailer_id,
                );

                return (
                  <div
                    key={d.detailer_id}
                    className="h-16 flex items-center px-3 border-b transition-colors"
                    style={{
                      borderLeft: `3px solid ${color.border}`,
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={{
                          backgroundColor: color.bg,
                          color: color.text,
                          border: `1.5px solid ${color.border}`,
                        }}
                      >
                        {d.detailer_name.charAt(0).toUpperCase()}
                      </div>
                      <span
                        className={`text-sm font-medium truncate ${
                          hasSchedule
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {d.detailer_name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scrollable Timeline Area */}
            <div ref={ganttRef} className="flex-1 overflow-x-auto relative">
              {/* Time Slots Header */}
              <div className="flex h-10 border-b bg-muted/30 min-w-225">
                {TIME_SLOTS.map((hour) => (
                  <div
                    key={hour}
                    className="flex-1 text-center text-[11px] font-semibold text-muted-foreground border-r border-border/40 flex items-center justify-center"
                  >
                    {formatTimeLabel(hour)}
                  </div>
                ))}
              </div>

              {/* Detailer Rows */}
              {allDetailers.map((d, idx) => {
                const color = DETAILER_COLORS[idx % DETAILER_COLORS.length];
                const detailerDay = daySchedules.find(
                  (ds) => ds.detailer_id === d.detailer_id,
                );
                const entries = detailerDay?.schedule || [];

                return (
                  <div
                    key={d.detailer_id}
                    className="relative h-16 border-b min-w-225"
                  >
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex">
                      {TIME_SLOTS.map((hour) => (
                        <div
                          key={hour}
                          className="flex-1 border-r border-border/20"
                        />
                      ))}
                    </div>

                    {/* Current time indicator */}
                    {isSameDay(selectedDay, new Date()) &&
                      (() => {
                        const now = new Date();
                        const currentHour =
                          now.getHours() + now.getMinutes() / 60;
                        if (currentHour >= 8 && currentHour <= 23) {
                          const leftPercent = ((currentHour - 8) / 15) * 100;
                          return (
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-destructive/60 z-10"
                              style={{ left: `${leftPercent}%` }}
                            >
                              <div className="absolute -top-0.5 -left-1 w-2.5 h-2.5 rounded-full bg-destructive" />
                            </div>
                          );
                        }
                        return null;
                      })()}

                    {/* Schedule Blocks */}
                    {entries.map((entry) => {
                      const startHours = parseTimeToHours(entry.start);
                      const endHours = parseTimeToHours(entry.end);
                      const leftPercent = ((startHours - 8) / 15) * 100;
                      const widthPercent = ((endHours - startHours) / 15) * 100;

                      const isHovered = hoveredTicket === entry.ticket_id;

                      return (
                        <div
                          key={entry.ticket_id}
                          className="absolute top-2 bottom-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center overflow-hidden"
                          style={{
                            left: `${Math.max(0, leftPercent)}%`,
                            width: `${Math.max(2, widthPercent)}%`,
                            backgroundColor: isHovered
                              ? color.border + "40"
                              : color.bg,
                            border: `1.5px solid ${color.border}`,
                            boxShadow: isHovered
                              ? `0 4px 12px ${color.border}30`
                              : "none",
                            transform: isHovered ? "scaleY(1.08)" : "none",
                            zIndex: isHovered ? 20 : 5,
                          }}
                          onMouseEnter={(e) => {
                            setHoveredTicket(entry.ticket_id);
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            setTooltipInfo({
                              entry,
                              detailerName: d.detailer_name,
                              color,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                            });
                          }}
                          onMouseLeave={() => {
                            setHoveredTicket(null);
                            setTooltipInfo(null);
                          }}
                          onClick={() => setSelectedTicketId(entry.ticket_id)}
                        >
                          <span
                            className="text-[10px] font-semibold px-2 truncate"
                            style={{ color: color.text }}
                          >
                            {entry.interval
                              .split(" - ")
                              .map((t: string) => {
                                const [h, m] = t.split(":");
                                const hour = parseInt(h);
                                const ampm = hour >= 12 ? "p" : "a";
                                const displayH =
                                  hour > 12
                                    ? hour - 12
                                    : hour === 0
                                      ? 12
                                      : hour;
                                return `${displayH}:${m}${ampm}`;
                              })
                              .join("-")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <User className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">No detailers available</p>
          </div>
        )}

        {/* Empty day message */}
        {allDetailers.length > 0 && daySchedules.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground bg-muted/20 border-t">
            <Calendar className="h-4 w-4 inline-block mr-1.5 opacity-60" />
            No appointments scheduled for this day
          </div>
        )}
      </div>

      {/* Floating Tooltip */}
      {tooltipInfo && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltipInfo.x,
            top: tooltipInfo.y - 8,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div
            className="rounded-lg px-3.5 py-2.5 shadow-xl text-xs border backdrop-blur-sm"
            style={{
              backgroundColor: "hsl(var(--popover))",
              borderColor: tooltipInfo.color.border + "40",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tooltipInfo.color.border }}
              />
              <span className="font-semibold text-foreground">
                {tooltipInfo.detailerName}
              </span>
            </div>
            <div className="text-muted-foreground space-y-0.5">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {tooltipInfo.entry.interval
                  .split(" - ")
                  .map((t: string) => {
                    const [h, m] = t.split(":");
                    const hour = parseInt(h);
                    const ampm = hour >= 12 ? "PM" : "AM";
                    const displayH =
                      hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                    return `${displayH}:${m} ${ampm}`;
                  })
                  .join(" – ")}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(tooltipInfo.entry.date), "EEE, MMM d")}
              </div>
            </div>
          </div>
          {/* Tooltip arrow */}
          <div
            className="w-2 h-2 rotate-45 mx-auto -mt-1"
            style={{
              backgroundColor: "hsl(var(--popover))",
              borderRight: `1px solid ${tooltipInfo.color.border}40`,
              borderBottom: `1px solid ${tooltipInfo.color.border}40`,
            }}
          />
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-1">
        {allDetailers.map((d, idx) => {
          const color = DETAILER_COLORS[idx % DETAILER_COLORS.length];
          return (
            <div
              key={d.detailer_id}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: color.bg,
                  border: `1.5px solid ${color.border}`,
                }}
              />
              <span className="font-medium">{d.detailer_name}</span>
            </div>
          );
        })}
      </div>

      {/* Ticket Details Modal */}
      <Dialog
        open={!!selectedTicketId}
        onOpenChange={(v) => !v && setSelectedTicketId(null)}
      >
        <DialogContent className="sm:max-w-md max-h-screen overflow-y-auto">
          {isFetchingTicket ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <Loader />
              <p className="text-muted-foreground text-sm font-medium">
                Loading ticket details...
              </p>
            </div>
          ) : selectedTicketDetails ? (
            <BookingDialog
              role="admin"
              ticket={selectedTicketDetails}
              detailers={allDetailers.map((d) => ({
                id: d.detailer_id,
                name: d.detailer_name,
              }))}
            />
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Failed to load ticket details.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

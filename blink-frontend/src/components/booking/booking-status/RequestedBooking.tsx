import { useEffect, useState } from "react";
import type { Ticket, ScheduleItem } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CancelReasonSelector } from "../CancelReasonSelector";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, Clock, AlertCircle, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookingStore } from "@/stores/useBookingStore";
import { Badge } from "@/components/ui/badge";
import { formatInterval } from "@/shared/utils";
import type { UseAcceptTicketHook, UseCancelTicketHook } from "@/shared/types";

interface RequestedBookingProps {
  ticket: Ticket;
  detailers?: { id: string; name: string }[];
  useScheduleHook: (
    detailerId: string | undefined,
    date: Date | undefined
  ) => {
    schedule: ScheduleItem[];
    isGettingDetailerSchedule: boolean;
  };
  useAcceptTicketHook: () => UseAcceptTicketHook;
  useCancelTicketHook: () => UseCancelTicketHook;
}

export function RequestedBooking({
  ticket,
  detailers = [],
  useScheduleHook,
  useAcceptTicketHook,
  useCancelTicketHook,
}: RequestedBookingProps) {
  const {
    cancelReason,
    customReason,
    selectedDate,
    setSelectedDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    selectedDetailerId,
    setSelectedDetailerId,
    setDetailerSchedule,
    setIsGettingDetailerSchedule,
    resetCancelState,
    setCancelDialogOpen,
  } = useBookingStore();

  const [price, setPrice] = useState(ticket.price);
  const [location, setLocation] = useState(ticket.location || "");

  // Use the provided hooks
  const { acceptTicketMutation, isAcceptingTicket } = useAcceptTicketHook();
  const { cancelTicketMutation, isCancellingTicket } = useCancelTicketHook();

  // Use the provided schedule hook
  const { schedule, isGettingDetailerSchedule } = useScheduleHook(
    selectedDetailerId || undefined,
    selectedDate
  );

  useEffect(() => {
    setDetailerSchedule(schedule || []);
  }, [schedule, setDetailerSchedule]);

  useEffect(() => {
    setIsGettingDetailerSchedule(isGettingDetailerSchedule);
  }, [isGettingDetailerSchedule, setIsGettingDetailerSchedule]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setStartTime("");
    setEndTime("");
  };

  const handleDetailerChange = (value: string) => {
    setSelectedDetailerId(value || null);
    setDetailerSchedule([]);
    setStartTime("");
    setEndTime("");
  };

  const hasTimeConflict = () => {
    if (
      !startTime ||
      !endTime ||
      !selectedDate ||
      !schedule ||
      schedule.length === 0
    ) {
      return false;
    }

    const selectedStart = new Date(
      `${selectedDate.toDateString()} ${startTime}`
    );
    const selectedEnd = new Date(`${selectedDate.toDateString()} ${endTime}`);

    return schedule.some((busySlot: ScheduleItem) => {
      const busyStart = parseISO(busySlot.start);
      const busyEnd = parseISO(busySlot.end);

      return (
        (selectedStart >= busyStart && selectedStart < busyEnd) ||
        (selectedEnd > busyStart && selectedEnd <= busyEnd) ||
        (selectedStart <= busyStart && selectedEnd >= busyEnd)
      );
    });
  };

  const handleAcceptBooking = () => {
    if (!selectedDetailerId || !selectedDate || !startTime || !endTime) {
      return;
    }

    acceptTicketMutation({
      id: ticket.id,
      detailer_id: selectedDetailerId,
      date: format(selectedDate, "yyyy-MM-dd"),
      start_time: startTime,
      end_time: endTime,
      price: price,
      location: location,
    });
  };

  const handleCancelBooking = () => {
    const reason = cancelReason === "other" ? customReason : cancelReason;
    if (reason) {
      cancelTicketMutation({
        id: ticket.id,
        reason: reason,
      });
      setCancelDialogOpen(false);
      resetCancelState();
    }
  };

  const timeConflict = hasTimeConflict();

  /** True when the chosen end time is not strictly after the start time */
  const endBeforeStart = (() => {
    if (!startTime || !endTime) return false;
    return endTime <= startTime;
  })();

  return (
    <>
      <DialogHeader>
        <DialogTitle>Requested Booking</DialogTitle>
        <DialogDescription>
          Review details and assign a detailer or cancel.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* User Info */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            User: <span className="font-medium">{ticket.user.name}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Phone:{" "}
            <a href={`tel:${ticket.user.phone}`} className="font-medium">
              {ticket.user.phone}
            </a>
          </p>
        </div>

        {/* Detailer select */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Assign Detailer</label>
          <Select
            value={selectedDetailerId || ""}
            onValueChange={handleDetailerChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a detailer" />
            </SelectTrigger>
            <SelectContent>
              {detailers.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Schedule Display */}
        {selectedDetailerId && selectedDate && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Detailer's Schedule for {format(selectedDate, "PPP")}
              {isGettingDetailerSchedule && (
                <Loader2 className="h-3 w-3 animate-spin ml-2 inline" />
              )}
            </label>
            <div className="border rounded-md p-3 bg-muted/20">
              {isGettingDetailerSchedule ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Loading schedule...
                  </span>
                </div>
              ) : !schedule || schedule.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No bookings scheduled for this date
                </p>
              ) : (
                <div className="space-y-2">
                  {schedule.map((slot: ScheduleItem) => (
                    <div
                      key={slot.ticket_id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-medium">
                        {formatInterval(slot.interval)}
                      </span>
                      <Badge variant="outline">Booking #{slot.ticket_id}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          {location && (
            <a
              href={location}
              target="_blank"
              className="w-full flex items-center justify-center bg-primary text-white hover:bg-primary/90 transition-colors duration-300 mt-2 h-8 rounded-md gap-1.5 p-3"
            >
              Open in Google Maps
            </a>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Price</label>
          <Input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            type="number"
          />
        </div>

        {/* Date + Time pickers */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Date & Time</label>

          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </PopoverContent>
          </Popover>

          {/* Time Pickers */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">Start Time</label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    // Reset end time whenever start changes to prevent stale invalid state
                    setEndTime("");
                  }}
                  className={timeConflict ? "border-destructive" : ""}
                  disabled={!selectedDate}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">End Time</label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={
                    timeConflict || endBeforeStart ? "border-destructive" : ""
                  }
                  min={startTime}
                  disabled={!startTime}
                />
              </div>
            </div>
          </div>

          {/* End-before-start error */}
          {endBeforeStart && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>End time must be after the start time!</span>
            </div>
          )}

          {/* Time Conflict Warning */}
          {timeConflict && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>
                This time conflicts with the detailer's existing schedule!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Button */}
      <DialogFooter className="flex flex-col gap-2">
        <Button
          variant="success"
          className="w-full"
          onClick={handleAcceptBooking}
          disabled={
            timeConflict ||
            endBeforeStart ||
            !selectedDetailerId ||
            !selectedDate ||
            !startTime ||
            !endTime ||
            isAcceptingTicket
          }
        >
          {isAcceptingTicket ? "Accepting..." : "Confirm Booking"}
        </Button>
      </DialogFooter>

      {/* Cancel Section */}
      <Separator className="my-4" />
      <div className="space-y-3">
        <CancelReasonSelector />
        <Button
          variant="destructive"
          onClick={handleCancelBooking}
          disabled={
            !cancelReason ||
            (cancelReason === "other" && !customReason) ||
            isCancellingTicket
          }
          className="w-full"
        >
          {isCancellingTicket ? "Canceling..." : "Cancel Booking"}
        </Button>
      </div>
    </>
  );
}

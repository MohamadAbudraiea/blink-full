/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetDetailerSchedule } from "@/hooks/useAdmin";
import { formatDate } from "date-fns";
import { formatInterval } from "@/shared/utils";
import { useTheme } from "@/context/theme-provider";

export function ShowScheduleDialog({ row }: { row: any }) {
  const { theme } = useTheme();
  const { schedule, isGettingDetailerSchedule } = useGetDetailerSchedule(
    row?.id,
  );

  const logoSrc = theme === "dark" ? "/cabsola.png" : "/black-cabsola.png";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="warning">
          Schedule
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Detailer Schedule - {row?.name}</DialogTitle>
        </DialogHeader>

        {/* Scrollable content container */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {isGettingDetailerSchedule ? (
            <div className="flex justify-center items-center py-6">
              <img
                src={logoSrc}
                alt="Loading"
                className="h-32 w-32 transform animate-spin"
              />
            </div>
          ) : Array.isArray(schedule) && schedule.length > 0 ? (
            <div className="space-y-2">
              {schedule.map((s) => (
                <div
                  key={s.ticket_id}
                  className="rounded-md border p-3 text-sm text-left bg-muted"
                >
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {formatDate(s.date, "EEE, dd/MM/yyyy")}
                  </p>
                  <p>
                    <span className="font-semibold">Interval:</span>{" "}
                    {formatInterval(s.interval)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No schedule found for this detailer.
            </p>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

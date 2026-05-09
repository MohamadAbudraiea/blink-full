/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetDetailerStock } from "@/hooks/useAdmin";
import { useTheme } from "@/context/theme-provider";

export function ShowStocksDialog({ row }: { row: any }) {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/icon-logo.png" : "/black-icon-logo.png";
  const [open, setOpen] = useState(false);
  const [dateMode, setDateMode] = useState<"single" | "range">("single");
  const [dateInput, setDateInput] = useState({
    date: "",
    startDate: "",
    endDate: "",
  });

  const { stocks, isGettingDetailerStock } = useGetDetailerStock({
    detailer_id: row?.id,
    date: dateInput.date,
    startDate: dateInput.startDate,
    endDate: dateInput.endDate,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setDateInput({ date: "", startDate: "", endDate: "" });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="default"
          onClick={() => {
            setOpen(true);
            setDateMode("single");
            setDateInput({ date: "", startDate: "", endDate: "" });
          }}
        >
          Stocks
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Detailer Stocks - {row?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date Mode Switch */}
          <div className="flex gap-4">
            <Button
              variant={dateMode === "single" ? "default" : "outline"}
              onClick={() => {
                setDateMode("single");
                setDateInput({ date: "", startDate: "", endDate: "" });
              }}
            >
              Single Date
            </Button>
            <Button
              variant={dateMode === "range" ? "default" : "outline"}
              onClick={() => {
                setDateMode("range");
                setDateInput({ date: "", startDate: "", endDate: "" });
              }}
            >
              Date Range
            </Button>
          </div>

          {/* Date Inputs */}
          {dateMode === "single" ? (
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={dateInput.date}
                onChange={(e) =>
                  setDateInput({
                    ...dateInput,
                    date: e.target.value,
                    startDate: "",
                    endDate: "",
                  })
                }
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="flex-1">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={dateInput.startDate}
                  onChange={(e) =>
                    setDateInput({
                      ...dateInput,
                      startDate: e.target.value,
                      date: "",
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={dateInput.endDate}
                  onChange={(e) =>
                    setDateInput({
                      ...dateInput,
                      endDate: e.target.value,
                      date: "",
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* Status Message */}
          <div className="text-sm text-muted-foreground">
            {!dateInput.date && !dateInput.startDate && !dateInput.endDate && (
              <p>Please select a date to view stocks</p>
            )}
            {dateMode === "range" &&
              dateInput.startDate &&
              !dateInput.endDate && <p>Please select an end date</p>}
            {dateMode === "range" &&
              !dateInput.startDate &&
              dateInput.endDate && <p>Please select a start date</p>}
          </div>

          {/* Loading State */}
          {isGettingDetailerStock && (
            <div className="flex justify-center py-6">
              <div className="flex items-center gap-2">
                <img
                  src={logoSrc}
                  alt="Loading"
                  className="h-8 w-8 animate-spin"
                />
                <span>Loading stocks...</span>
              </div>
            </div>
          )}

          {/* Stocks Display */}
          {stocks && !isGettingDetailerStock && (
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-2 gap-4 p-3 bg-primary/10 rounded-md">
                <p>
                  <strong>Total Tickets:</strong> {stocks.totalTickets}
                </p>
                <p>
                  <strong>Total Cash:</strong> {stocks.totalCashAmount} JD
                </p>
              </div>

              {stocks.tickets && stocks.tickets.length > 0 ? (
                <div className="border-t pt-3 space-y-2">
                  <h4 className="font-semibold">Ticket Details:</h4>
                  {stocks.tickets.map((t: any) => (
                    <div
                      key={t.id}
                      className="border rounded-md p-3 bg-muted text-left"
                    >
                      <p>
                        <strong>Date:</strong> {t.date}
                      </p>
                      <p>
                        <strong>Service:</strong> {t.service}
                      </p>
                      <p>
                        <strong>Type:</strong> {t.typeOfService}
                      </p>
                      <p>
                        <strong>Price:</strong> {t.price} JD
                      </p>
                      <p>
                        <strong>Note:</strong> {t.note || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No stocks found for the selected date(s).
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

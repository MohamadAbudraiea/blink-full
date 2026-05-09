import type { Ticket, UseCancelTicketHook } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CancelReasonSelector } from "../CancelReasonSelector";
import { useBookingStore } from "@/stores/useBookingStore";
import type { UseMutateFunction } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Wallet } from "lucide-react";

interface PendingBookingProps {
  ticket: Ticket;
  useFinishTicketHook: () => {
    finishTicketMutation: UseMutateFunction<
      void,
      Error,
      { id: string; payment_method: string },
      unknown
    >;
    isFinishingTicket: boolean;
  };
  role: "admin" | "secretary" | "detailer";
  useCancelTicketHook: () => UseCancelTicketHook;
}

export function PendingBooking({
  ticket,
  role,
  useFinishTicketHook,
  useCancelTicketHook,
}: PendingBookingProps) {
  const { cancelReason, customReason, setCancelDialogOpen, selectedTicket } =
    useBookingStore();

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online" | "">(
    ""
  );

  const { cancelTicketMutation, isCancellingTicket } = useCancelTicketHook();
  const { finishTicketMutation, isFinishingTicket } = useFinishTicketHook();

  const handleFinishOrder = () => {
    if (!paymentMethod) return;
    finishTicketMutation({ id: ticket.id, payment_method: paymentMethod });
  };

  const handleCancelOrder = () => {
    const reason = cancelReason === "other" ? customReason : cancelReason;
    if (reason && selectedTicket) {
      cancelTicketMutation({
        id: selectedTicket.id,
        reason: reason,
      });
      setCancelDialogOpen(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Pending Booking</DialogTitle>
        <DialogDescription>Finish or cancel this booking.</DialogDescription>
      </DialogHeader>

      <div className="space-y-3 py-4">
        <p className="text-sm text-muted-foreground">
          User: <span className="font-medium">{ticket.user?.name || ticket.customer_name || "-"}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Phone:{" "}
          <a href={`tel:${ticket.user?.phone || ticket.customer_phone || ""}`} className="font-medium">
            {ticket.user?.phone || ticket.customer_phone || "-"}
          </a>
        </p>

        {(role === "admin" || role === "detailer") && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold tracking-wide">
              Select Payment Method
            </Label>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(value: "cash" | "online") =>
                setPaymentMethod(value)
              }
              className="grid grid-cols-2 gap-4"
            >
              {/* Cash Option */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                  paymentMethod === "cash"
                    ? "border-primary shadow-sm"
                    : "border-muted"
                }`}
                onClick={() => setPaymentMethod("cash")}
              >
                <CardContent className="flex items-center justify-center gap-3 p-4">
                  <RadioGroupItem value="cash" id="cash" className="sr-only" />
                  <Wallet
                    size={22}
                    className={
                      paymentMethod === "cash"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  />
                  <Label
                    htmlFor="cash"
                    className="font-medium cursor-pointer text-sm"
                  >
                    Cash
                  </Label>
                </CardContent>
              </Card>

              {/* Online Option */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                  paymentMethod === "online"
                    ? "border-primary shadow-sm"
                    : "border-muted"
                }`}
                onClick={() => setPaymentMethod("online")}
              >
                <CardContent className="flex items-center justify-center gap-3 p-4">
                  <RadioGroupItem
                    value="online"
                    id="online"
                    className="sr-only"
                  />
                  <CreditCard
                    size={22}
                    className={
                      paymentMethod === "online"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  />
                  <Label
                    htmlFor="online"
                    className="font-medium cursor-pointer text-sm"
                  >
                    Online
                  </Label>
                </CardContent>
              </Card>
            </RadioGroup>
          </div>
        )}

        {(role === "admin" || role === "detailer") && (
          <Button
            variant="success"
            className="w-full"
            onClick={handleFinishOrder}
            disabled={isFinishingTicket || !paymentMethod}
          >
            {isFinishingTicket ? "Finishing..." : "Finish Order"}
          </Button>
        )}

        {(role === "admin" || role === "secretary") && (
          <>
            <Separator className="mt-4 bg-muted-foreground" />
            <CancelReasonSelector />
          </>
        )}
      </div>
      {(role === "admin" || role === "secretary") && (
        <Button
          variant="destructive"
          onClick={handleCancelOrder}
          disabled={
            !cancelReason ||
            (cancelReason === "other" && !customReason) ||
            isCancellingTicket
          }
        >
          {isCancellingTicket ? "Canceling..." : "Cancel Order"}
        </Button>
      )}
    </>
  );
}

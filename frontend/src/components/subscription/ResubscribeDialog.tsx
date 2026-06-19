import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  usePreviewResubscription,
  useConfirmResubscription,
} from "@/hooks/useSubscription";
import {
  Loader2,
  RefreshCw,
  CalendarDays,
  Check,
  Pencil,
  Wand2,
} from "lucide-react";
import { format } from "date-fns";
import { LocationInput } from "@/components/shared/LocationInput";
import { toast } from "sonner";

interface ResubscribeDialogProps {
  subscriptionId: string;
  planType: string;
  role: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

interface TicketPreview {
  service: string;
  typeOfService: string;
  location: string;
  note: string;
  detailer_id: string | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  price: number | null;
}

const SERVICE_LABELS: Record<string, string> = {
  wash: "Car Wash",
  dryclean: "Dry Clean",
  polish: "Polish",
  graphene: "Graphene Coat",
  nanoceramic: "Nano Ceramic",
};

export function ResubscribeDialog({
  subscriptionId,
  planType,
  role,
  open,
  onOpenChange,
}: ResubscribeDialogProps) {
  const { previewMutation, isPreviewing, previewData } =
    usePreviewResubscription(role);
  const { confirmMutation, isConfirming } = useConfirmResubscription(role);

  const [tickets, setTickets] = useState<TicketPreview[]>([]);
  const [totalPrice, setTotalPrice] = useState<string>("");
  const isInternal = role === "admin" || role === "secretary";

  // Fetch preview when dialog opens
  useEffect(() => {
    if (open && subscriptionId) {
      previewMutation(subscriptionId);
    }
  }, [open, subscriptionId]);

  // Populate editable state from preview data
  useEffect(() => {
    if (previewData) {
      setTickets(previewData.tickets || []);
      setTotalPrice(
        previewData.total_price != null ? String(previewData.total_price) : ""
      );
    }
  }, [previewData]);

  const updateTicket = (index: number, field: string, value: string) => {
    setTickets((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleConfirm = () => {
    confirmMutation(
      {
        id: subscriptionId,
        payload: {
          tickets,
          ...(isInternal && totalPrice ? { total_price: parseFloat(totalPrice) } : {}),
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const autoFillFromFirstTicket = () => {
    const first = tickets[0];
    if (!first?.service || !first?.date) {
      toast.error("Please fill in Ticket #1 first (at least the service and date).");
      return;
    }
    setTickets((prev) =>
      prev.map((t, i) => {
        if (i === 0) return t;
        const baseDateStr = first.date;
        const newDate = baseDateStr
          ? (() => {
              const [y, m, d] = baseDateStr.split("-").map(Number);
              const dateObj = new Date(y, m - 1, d, 12, 0, 0);
              dateObj.setDate(dateObj.getDate() + 7 * i);
              const ny = dateObj.getFullYear();
              const nm = String(dateObj.getMonth() + 1).padStart(2, "0");
              const nd = String(dateObj.getDate()).padStart(2, "0");
              return `${ny}-${nm}-${nd}`;
            })()
          : t.date;
        return {
          ...t,
          service: first.service,
          typeOfService: first.typeOfService,
          location: first.location,
          start_time: first.start_time,
          detailer_id: first.detailer_id,
          date: newDate,
        };
      })
    );
    toast.success(`Applied Ticket #1 to all tickets with weekly date offsets.`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            Resubscribe — Plan ×{planType}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Review and edit the ticket details below. All dates have been
            advanced by ~4 weeks. Confirm when ready.
          </p>
        </DialogHeader>

        {isPreviewing ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Total price — admin/secretary only */}
            {isInternal && (
              <div className="space-y-1 p-4 bg-muted/30 rounded-xl border border-border/50">
                <Label className="text-sm font-semibold">Total Price (JD)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}

            {/* Auto-fill banner */}
            {tickets[0]?.service && tickets.length > 1 && (
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5">
                <div className="text-sm">
                  <p className="font-semibold text-primary flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4" />
                    Quick Fill
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Copy <strong>Ticket #1</strong>'s service & location to all tickets, advancing dates by 1 week each.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="shrink-0 border-primary/30 text-primary hover:bg-primary/10"
                  onClick={autoFillFromFirstTicket}
                >
                  Apply to All
                </Button>
              </div>
            )}

            {/* Ticket previews */}
            <Accordion type="multiple" defaultValue={tickets.map((_, i) => `t-${i}`)}>
              {tickets.map((t, i) => (
                <AccordionItem key={i} value={`t-${i}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        #{i + 1}
                      </Badge>
                      <span className="font-semibold text-sm">
                        {SERVICE_LABELS[t.service] || t.service}
                      </span>
                      {t.date && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarDays className="w-3 h-3" />
                          {t.date}
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {/* Date */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Pencil className="w-3 h-3" /> Date
                          </Label>
                          <Input
                            type="date"
                            value={t.date || ""}
                            onChange={(e) => updateTicket(i, "date", e.target.value)}
                          />
                        </div>

                        {/* Times */}
                        {isInternal ? (
                          <>
                            <div className="space-y-1">
                              <Label className="text-xs">Start Time</Label>
                              <Input
                                type="time"
                                value={t.start_time || ""}
                                onChange={(e) => updateTicket(i, "start_time", e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">End Time</Label>
                              <Input
                                type="time"
                                value={t.end_time || ""}
                                min={t.start_time || ""}
                                onChange={(e) => updateTicket(i, "end_time", e.target.value)}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Preferred Start Time</Label>
                            <Input
                              type="time"
                              value={t.start_time || ""}
                              onChange={(e) => updateTicket(i, "start_time", e.target.value)}
                            />
                          </div>
                        )}
                      </div>

                      {/* Location */}
                      <div className="space-y-1">
                        <Label className="text-xs">Location</Label>
                        <LocationInput
                          value={t.location || ""}
                          onChange={(val) => updateTicket(i, "location", val)}
                        />
                      </div>

                      {/* Note */}
                      <div className="space-y-1">
                        <Label className="text-xs">Note (optional)</Label>
                        <Input
                          value={t.note || ""}
                          onChange={(e) => updateTicket(i, "note", e.target.value)}
                          placeholder="Any additional notes..."
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirming || isPreviewing || tickets.length === 0}
            className="gap-2"
          >
            {isConfirming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Confirm Resubscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUserCancelTicket } from "@/hooks/useUser";

interface CancelDialogProps {
  ticket_id: string;
}

export default function CancelDialog({ ticket_id }: CancelDialogProps) {
  const { cancelTicketMutation, isCancellingTicket } = useUserCancelTicket();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [customReason, setCustomReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");

  const handleCancel = () => {
    // Use the selected reason or custom reason
    const finalReason =
      selectedReason === "other" ? customReason : selectedReason;
    cancelTicketMutation({ id: ticket_id, reason: finalReason });
    setIsOpen(false);
    setCustomReason("");
    setSelectedReason("");
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setCustomReason("");
      setSelectedReason("");
    }
  };

  const isCancelDisabled =
    !selectedReason ||
    (selectedReason === "other" && !customReason.trim()) ||
    isCancellingTicket;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <X className="w-4 h-4 mr-1" />
          {t("book.cancel.button")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("book.cancel.title")}</DialogTitle>
          <DialogDescription>{t("book.cancel.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cancelReason">{t("book.cancel.reason")}</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger>
                <SelectValue
                  placeholder={t("book.cancel.reason_placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High Price">
                  {t("book.cancel.reasons.high_price")}
                </SelectItem>
                <SelectItem value="Not Suitable Time">
                  {t("book.cancel.reasons.not_suitable_time")}
                </SelectItem>
                <SelectItem value="other">
                  {t("book.cancel.reasons.other")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectedReason === "other" && (
            <div className="space-y-2">
              <Label htmlFor="customReason">
                {t("book.cancel.custom_reason")}
              </Label>
              <Textarea
                id="customReason"
                placeholder={t("book.cancel.custom_reason_placeholder")}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t("book.cancel.no")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isCancelDisabled}
          >
            {isCancellingTicket
              ? t("book.cancel.cancelling")
              : t("book.cancel.yes")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

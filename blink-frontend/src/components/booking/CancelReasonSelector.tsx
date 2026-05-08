import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookingStore } from "@/stores/useBookingStore";

export function CancelReasonSelector() {
  const { cancelReason, setCancelReason, customReason, setCustomReason } =
    useBookingStore();

  return (
    <div className="space-y-3">
      <Select value={cancelReason} onValueChange={setCancelReason}>
        <SelectTrigger>
          <SelectValue placeholder="Select Cancel Reason" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="High Price">High Price</SelectItem>
          <SelectItem value="Not Suitable Time">Not Suitable Time</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      {cancelReason === "other" && (
        <Textarea
          placeholder="Enter custom reason"
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
        />
      )}
    </div>
  );
}

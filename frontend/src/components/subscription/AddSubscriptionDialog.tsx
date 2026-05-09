import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateSubscription } from "@/hooks/useSubscription";
import { searchUsers } from "@/api/ticket";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2, Search } from "lucide-react";
import type { ScheduleItem } from "@/shared/types";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useGetDetailerScheduleByDate } from "@/hooks/useAdmin";
import { useGetDetailerScheduleForSecretary } from "@/hooks/useSecretary";
import { format } from "date-fns";

interface SearchResult {
  id: string;
  name: string;
  phone: string;
  email: string;
}

/** Per-ticket sub-form with its own detailer schedule display */
function TicketForm({
  index,
  data,
  detailers,
  role,
  onChange,
}: {
  index: number;
  data: any;
  detailers: { id: string; name: string }[];
  role?: string;
  onChange: (index: number, field: string, value: string) => void;
}) {
  const isInternal = role === "admin" || role === "secretary";

  const dateObj = data.date ? new Date(data.date + "T00:00:00") : undefined;

  const adminHook = useGetDetailerScheduleByDate(
    isInternal && role === "admin" ? data.detailer_id || undefined : undefined,
    dateObj
  );
  const secHook = useGetDetailerScheduleForSecretary(
    isInternal && role === "secretary" ? data.detailer_id || undefined : undefined,
    dateObj
  );

  const schedule = isInternal
    ? role === "admin"
      ? adminHook.schedule
      : secHook.schedule
    : [];
  const isLoadingSchedule = isInternal
    ? role === "admin"
      ? adminHook.isGettingDetailerSchedule
      : secHook.isGettingDetailerSchedule
    : false;

  const hasTimeConflict = () => {
    if (!data.start_time || !data.end_time || !schedule || schedule.length === 0) return false;
    return schedule.some((slot: ScheduleItem) => {
      const [busyStart, busyEnd] = slot.interval.split(" - ");
      return data.start_time < busyEnd && data.end_time > busyStart;
    });
  };

  const endBeforeStart = data.start_time && data.end_time ? data.end_time <= data.start_time : false;
  const timeConflict = hasTimeConflict();

  return (
    <div className="space-y-3">
      {/* Detailer (admin/sec only) */}
      {isInternal && (
        <div className="space-y-1">
          <Label>Assign Detailer *</Label>
          <Select
            value={data.detailer_id}
            onValueChange={(val) => {
              onChange(index, "detailer_id", val);
              onChange(index, "start_time", "");
              onChange(index, "end_time", "");
            }}
          >
            <SelectTrigger><SelectValue placeholder="Select a detailer" /></SelectTrigger>
            <SelectContent>
              {detailers.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Service */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Service *</Label>
          <Select value={data.service} onValueChange={(val) => onChange(index, "service", val)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="wash">Wash</SelectItem>
              <SelectItem value="dryclean">Dryclean</SelectItem>
              <SelectItem value="polish">Polish</SelectItem>
              <SelectItem value="gravin">Gravin</SelectItem>
              <SelectItem value="nanoceramic">Nanoceramic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Type of Service</Label>
          <Select value={data.typeOfService} onValueChange={(val) => onChange(index, "typeOfService", val)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Blink">Blink</SelectItem>
              <SelectItem value="Elite">Elite</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date */}
      <div className="space-y-1">
        <Label>Date *</Label>
        <Input
          type="date"
          value={data.date}
          min={format(new Date(), "yyyy-MM-dd")}
          onChange={(e) => {
            onChange(index, "date", e.target.value);
            onChange(index, "start_time", "");
            onChange(index, "end_time", "");
          }}
        />
      </div>

      {/* Schedule display for admin/secretary */}
      {isInternal && data.detailer_id && data.date && (
        <div className="space-y-1">
          <Label className="text-xs">
            Detailer Schedule
            {isLoadingSchedule && <Loader2 className="h-3 w-3 animate-spin ml-2 inline" />}
          </Label>
          <div className="border rounded-md p-2 bg-muted/20 text-sm">
            {isLoadingSchedule ? (
              <div className="flex items-center gap-2 text-muted-foreground py-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Loading...
              </div>
            ) : !schedule || schedule.length === 0 ? (
              <p className="text-muted-foreground py-1">No bookings on this date</p>
            ) : (
              <div className="space-y-1">
                {schedule.map((slot: ScheduleItem) => (
                  <div key={slot.ticket_id} className="flex items-center justify-between">
                    <span>{slot.interval}</span>
                    <Badge variant="outline">#{slot.ticket_id}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Time */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Start Time *</Label>
          <Input
            type="time"
            value={data.start_time}
            onChange={(e) => {
              onChange(index, "start_time", e.target.value);
              onChange(index, "end_time", "");
            }}
            disabled={!data.date}
            className={timeConflict ? "border-destructive" : ""}
          />
        </div>
        <div className="space-y-1">
          <Label>End Time *</Label>
          <Input
            type="time"
            value={data.end_time}
            min={data.start_time}
            onChange={(e) => onChange(index, "end_time", e.target.value)}
            disabled={!data.start_time}
            className={timeConflict || endBeforeStart ? "border-destructive" : ""}
          />
        </div>
      </div>

      {endBeforeStart && (
        <div className="flex items-center gap-2 text-destructive text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>End time must be after start time</span>
        </div>
      )}
      {timeConflict && (
        <div className="flex items-center gap-2 text-destructive text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>Time conflicts with detailer's schedule!</span>
        </div>
      )}

      {/* Location & Note */}
      <div className="space-y-1">
        <Label>Location</Label>
        <Input
          placeholder="Location or Google Maps link"
          value={data.location}
          onChange={(e) => onChange(index, "location", e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label>Note</Label>
        <Input
          placeholder="Any notes..."
          value={data.note}
          onChange={(e) => onChange(index, "note", e.target.value)}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────

export function AddSubscriptionDialog({
  role,
  detailers = [],
}: {
  role?: string;
  detailers?: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [planType, setPlanType] = useState<"2" | "4" | "8">("2");

  // User search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  // Only admin/secretary set a total price
  const [totalPrice, setTotalPrice] = useState("");

  const isInternal = role === "admin" || role === "secretary";

  const makeEmptyTicket = () => ({
    service: "wash",
    typeOfService: "Blink",
    location: "",
    note: "",
    detailer_id: "",
    date: "",
    start_time: "",
    end_time: "",
  });

  const [ticketsData, setTicketsData] = useState<any[]>(Array(parseInt(planType)).fill(null).map(makeEmptyTicket));

  const { createSubscriptionMutation, isCreatingSubscription } = useCreateSubscription(role);

  // Debounced user search
  useEffect(() => {
    if (!isInternal || isAnonymous || searchQuery.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await searchUsers(searchQuery);
        setSearchResults(res.data || []);
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, isAnonymous, isInternal]);

  useEffect(() => {
    setTicketsData(Array(parseInt(planType)).fill(null).map(makeEmptyTicket));
  }, [planType]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTicketChange = (index: number, field: string, value: string) => {
    setTicketsData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleUserSelect = (user: SearchResult) => {
    setSelectedUser(user);
    setSearchQuery(`${user.name} — ${user.phone}`);
    setShowDropdown(false);
  };

  const resetForm = () => {
    setIsAnonymous(true);
    setPlanType("2");
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUser(null);
    setCustomerName("");
    setCustomerPhone("");
    setTotalPrice("");
    setTicketsData(Array(2).fill(null).map(makeEmptyTicket));
  };

  const handleSubmit = () => {
    const payload: any = {
      isAnonymous: isInternal ? isAnonymous : false,
      plan_type: planType,
      tickets: ticketsData.map((t) => ({
        ...t,
        detailer_id: t.detailer_id || null,
        // Only internal roles set price per ticket
        ...(isInternal && totalPrice ? { price: Number(totalPrice) / Number(planType) } : {}),
      })),
    };

    if (isInternal) {
      if (totalPrice) payload.total_price = Number(totalPrice);
      if (isAnonymous) {
        payload.customer_name = customerName;
        payload.customer_phone = customerPhone;
      } else {
        payload.user_id = selectedUser?.id || null;
      }
    }
    // For users, no user_id needed — the backend uses req.user.id

    createSubscriptionMutation(payload, {
      onSuccess: () => {
        setOpen(false);
        resetForm();
      },
    });
  };

  const canSubmit = () => {
    if (isInternal) {
      if (isAnonymous && (!customerName || !customerPhone)) return false;
      if (!isAnonymous && !selectedUser) return false;
    }
    for (const t of ticketsData) {
      if (!t.service) return false;
      if (isInternal && !t.detailer_id) return false;
      if (!t.date || !t.start_time || !t.end_time) return false;
      if (t.end_time <= t.start_time) return false;
    }
    return true;
  };

  if (role !== "admin" && role !== "secretary" && role !== "user") return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">{isInternal ? "Add Subscription" : "Book a Subscription"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isInternal ? "Add New Subscription" : "Book a Subscription"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer section — internal only */}
          {isInternal && (
            <>
              <div className="flex gap-2">
                <Button size="sm" variant={isAnonymous ? "default" : "outline"} onClick={() => setIsAnonymous(true)}>Anonymous</Button>
                <Button size="sm" variant={!isAnonymous ? "default" : "outline"} onClick={() => setIsAnonymous(false)}>Signed User</Button>
              </div>

              {isAnonymous ? (
                <div className="space-y-3">
                  <div className="space-y-1"><Label>Customer Name *</Label><Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></div>
                  <div className="space-y-1"><Label>Customer Phone *</Label><Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} /></div>
                </div>
              ) : (
                <div className="space-y-1" ref={searchRef}>
                  <Label>Search User *</Label>
                  <div className="relative">
                    <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5 z-10" />
                    <Input
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setSelectedUser(null); }}
                      onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                    />
                    {isSearching && <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-2.5" />}
                    {showDropdown && searchResults.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover shadow-md">
                        {searchResults.map((u) => (
                          <button key={u.id} type="button" className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex flex-col" onClick={() => handleUserSelect(u)}>
                            <span className="font-medium">{u.name}</span>
                            <span className="text-muted-foreground text-xs">{u.phone} · {u.email}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedUser && (
                    <p className="text-sm mt-1 p-2 rounded bg-muted/50">
                      Selected: <span className="font-medium">{selectedUser.name}</span> — {selectedUser.phone}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Plan type + price (price admin/sec only) */}
          <div className={`grid gap-4 ${isInternal ? "grid-cols-2" : "grid-cols-1"}`}>
            <div className="space-y-1">
              <Label>Plan Type *</Label>
              <Select value={planType} onValueChange={(v: "2" | "4" | "8") => setPlanType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Tickets</SelectItem>
                  <SelectItem value="4">4 Tickets</SelectItem>
                  <SelectItem value="8">8 Tickets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isInternal && (
              <div className="space-y-1">
                <Label>Total Price</Label>
                <Input type="number" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} />
              </div>
            )}
          </div>

          {/* Per-ticket accordion */}
          <Accordion type="single" collapsible defaultValue="ticket-0" className="w-full">
            {ticketsData.map((t, i) => (
              <AccordionItem value={`ticket-${i}`} key={i}>
                <AccordionTrigger>
                  Ticket #{i + 1}
                </AccordionTrigger>
                <AccordionContent className="px-1 pt-2">
                  <TicketForm
                    index={i}
                    data={t}
                    detailers={detailers}
                    role={role}
                    onChange={handleTicketChange}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Button className="w-full" disabled={!canSubmit() || isCreatingSubscription} onClick={handleSubmit}>
            {isCreatingSubscription ? "Creating..." : "Create Subscription"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

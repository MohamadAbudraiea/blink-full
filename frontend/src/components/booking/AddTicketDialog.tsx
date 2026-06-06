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
import { useAddPendingTicket } from "@/hooks/useTicket";
import { searchUsers } from "@/api/ticket";
import { Label } from "@/components/ui/label";
import { useGetDetailerScheduleByDate } from "@/hooks/useAdmin";
import { useGetDetailerScheduleForSecretary } from "@/hooks/useSecretary";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { formatInterval } from "@/shared/utils";
import type { ScheduleItem } from "@/shared/types";

interface SearchResult {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export function AddTicketDialog({
  role,
  detailers = [],
  subscriptionId,
  subscriptionUserId,
  subscriptionCustomerName,
  subscriptionCustomerPhone,
}: {
  role?: string;
  detailers?: { id: string; name: string }[];
  subscriptionId?: string;
  subscriptionUserId?: string;
  subscriptionCustomerName?: string;
  subscriptionCustomerPhone?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);

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
  const [service, setService] = useState("wash");
  const [typeOfService, setTypeOfService] = useState("Blink");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [price, setPrice] = useState("");
  const [detailerId, setDetailerId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const { addPendingTicketMutation, isAddingPendingTicket } =
    useAddPendingTicket(role);

  // Schedule hook - use correct hook based on role
  const useScheduleHook =
    role === "admin"
      ? useGetDetailerScheduleByDate
      : useGetDetailerScheduleForSecretary;

  const dateObj = selectedDate
    ? new Date(selectedDate + "T00:00:00")
    : undefined;
  const { schedule, isGettingDetailerSchedule } = useScheduleHook(
    detailerId || undefined,
    dateObj,
  );

  // Debounced user search
  useEffect(() => {
    if (isAnonymous || searchQuery.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (
      selectedUser &&
      searchQuery === `${selectedUser.name} — ${selectedUser.phone}`
    ) {
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
  }, [searchQuery, isAnonymous]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Time conflict check
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
    return schedule.some((slot: ScheduleItem) => {
      const busyStart = slot.interval.split(" - ")[0];
      const busyEnd = slot.interval.split(" - ")[1];
      return startTime < busyEnd && endTime > busyStart;
    });
  };

  const endBeforeStart = startTime && endTime ? endTime <= startTime : false;
  const timeConflict = hasTimeConflict();

  const handleUserSelect = (user: SearchResult) => {
    setSelectedUser(user);
    setSearchQuery(`${user.name} — ${user.phone}`);
    setShowDropdown(false);
  };

  const resetForm = () => {
    if (!subscriptionId) {
      setIsAnonymous(true);
      setSearchQuery("");
      setSearchResults([]);
      setSelectedUser(null);
      setCustomerName("");
      setCustomerPhone("");
    }
    setService("wash");
    setTypeOfService("Blink");
    setLocation("");
    setNote("");
    setPrice("");
    setDetailerId("");
    setSelectedDate("");
    setStartTime("");
    setEndTime("");
  };

  const handleSubmit = () => {
    const payload: any = {
      isAnonymous,
      service,
      typeOfService,
      location,
      date: selectedDate,
      start_time: startTime,
      end_time: endTime,
      detailer_id: detailerId,
      ...(note ? { note } : {}),
      ...(price ? { price: Number(price) } : {}),
    };

    if (subscriptionId) {
      payload.subscription_id = subscriptionId;
      if (subscriptionUserId) payload.user_id = subscriptionUserId;
      if (subscriptionCustomerName)
        payload.customer_name = subscriptionCustomerName;
      if (subscriptionCustomerPhone)
        payload.customer_phone = subscriptionCustomerPhone;
    } else if (isAnonymous) {
      payload.customer_name = customerName;
      payload.customer_phone = customerPhone;
    } else {
      payload.user_id = selectedUser?.id;
    }

    addPendingTicketMutation(payload, {
      onSuccess: () => {
        setOpen(false);
        resetForm();
      },
    });
  };

  const canSubmit = () => {
    if (!detailerId || !selectedDate || !startTime || !endTime) return false;
    if (timeConflict || endBeforeStart) return false;
    if (subscriptionId) return true;
    if (isAnonymous) return !!customerName && !!customerPhone;
    return !!selectedUser;
  };

  if (role !== "admin" && role !== "secretary") return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">Add Ticket</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Pending Ticket</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Toggle: Anonymous vs Signed User (Hide if in subscription context) */}
          {!subscriptionId && (
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={isAnonymous ? "default" : "outline"}
                onClick={() => {
                  setIsAnonymous(true);
                  setSelectedUser(null);
                  setSearchQuery("");
                }}
              >
                Anonymous
              </Button>
              <Button
                type="button"
                size="sm"
                variant={!isAnonymous ? "default" : "outline"}
                onClick={() => {
                  setIsAnonymous(false);
                  setCustomerName("");
                  setCustomerPhone("");
                }}
              >
                Signed User
              </Button>
            </div>
          )}

          {/* User Info Section (Hide if in subscription context) */}
          {!subscriptionId &&
            (isAnonymous ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Customer Name *</Label>
                  <Input
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Customer Phone *</Label>
                  <Input
                    placeholder="Enter phone number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              /* Signed User: Debounced search */
              <div className="space-y-1" ref={searchRef}>
                <Label>Search User *</Label>
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground absolute left-3 z-10" />
                    <Input
                      placeholder="Search by name, phone, or email..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedUser(null);
                      }}
                      onFocus={() => {
                        if (searchResults.length > 0) setShowDropdown(true);
                      }}
                    />
                    {isSearching && (
                      <Loader2 className="h-4 w-4 animate-spin absolute right-3" />
                    )}
                  </div>

                  {/* Search results dropdown */}
                  {showDropdown && searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover shadow-md">
                      {searchResults.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex flex-col"
                          onClick={() => handleUserSelect(u)}
                        >
                          <span className="font-medium">{u.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {u.phone} · {u.email}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {showDropdown &&
                    searchResults.length === 0 &&
                    searchQuery.length >= 2 &&
                    !isSearching && (
                      <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md px-3 py-2 text-sm text-muted-foreground">
                        No users found
                      </div>
                    )}
                </div>

                {selectedUser && (
                  <div className="mt-2 p-2 rounded-md bg-muted/50 text-sm">
                    Selected:{" "}
                    <span className="font-medium">{selectedUser.name}</span> —{" "}
                    {selectedUser.phone}
                  </div>
                )}
              </div>
            ))}

          {/* Detailer Selection */}
          <div className="space-y-1">
            <Label>Assign Detailer *</Label>
            <Select
              value={detailerId}
              onValueChange={(val) => {
                setDetailerId(val);
                setStartTime("");
                setEndTime("");
              }}
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

          {/* Date */}
          <div className="space-y-1">
            <Label>Date *</Label>
            <Input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setStartTime("");
                setEndTime("");
              }}
            />
          </div>

          {/* Detailer Schedule Display */}
          {detailerId && selectedDate && (
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Detailer Schedule
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
                  <p className="text-sm text-muted-foreground text-center py-1">
                    No bookings for this date
                  </p>
                ) : (
                  <div className="space-y-1">
                    {schedule.map((slot: ScheduleItem) => (
                      <div
                        key={slot.ticket_id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="font-medium">
                          {formatInterval(slot.interval)}
                        </span>
                        <Badge variant="outline">#{slot.ticket_id}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Time Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Start Time *</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setEndTime("");
                }}
                disabled={!selectedDate}
                className={timeConflict ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-1">
              <Label>End Time *</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                min={startTime}
                disabled={!startTime}
                className={
                  timeConflict || endBeforeStart ? "border-destructive" : ""
                }
              />
            </div>
          </div>

          {endBeforeStart && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>End time must be after start time</span>
            </div>
          )}

          {timeConflict && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Time conflicts with detailer's schedule!</span>
            </div>
          )}

          {/* Service */}
          <div className="space-y-1">
            <Label>Service *</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wash">Wash</SelectItem>
                <SelectItem value="dryclean">Dryclean</SelectItem>
                <SelectItem value="polish">Polish</SelectItem>
                <SelectItem value="graphene">Graphene</SelectItem>
                <SelectItem value="nanoceramic">Nanoceramic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type of Service */}
          <div className="space-y-1">
            <Label>Type of Service</Label>
            <Select value={typeOfService} onValueChange={setTypeOfService}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="One Stage">One Stage</SelectItem>
                <SelectItem value="Three Stages">Three Stages</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <Label>Location</Label>
            <Input
              placeholder="Location or Google Maps link"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Price */}
          <div className="space-y-1">
            <Label>Price</Label>
            <Input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Note */}
          <div className="space-y-1">
            <Label>Note</Label>
            <Input
              placeholder="Any notes..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            disabled={!canSubmit() || isAddingPendingTicket}
            onClick={handleSubmit}
          >
            {isAddingPendingTicket ? "Creating..." : "Create Pending Ticket"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

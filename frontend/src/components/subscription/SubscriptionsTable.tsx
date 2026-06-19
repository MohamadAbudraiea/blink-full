import { BookingsTable } from "@/components/booking/BookingsTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCancelSubscription } from "@/hooks/useSubscription";
import type { Subscription } from "@/shared/types";
import { useBookingStore } from "@/stores/useBookingStore";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { ResubscribeDialog } from "./ResubscribeDialog";

function derivedStatus(sub: Subscription): string {
  const tickets = sub.tickets;
  if (!tickets || tickets.length === 0) return sub.status;

  const statuses = tickets.map((t) => t.status);

  if (statuses.includes("requested")) return "requested";
  if (statuses.includes("pending")) return "pending";
  if (statuses.includes("finished")) return "finished";
  if (statuses.every((s) => s === "canceled")) return "canceled";

  return sub.status;
}

export function SubscriptionsTable({
  subscriptions,
  role,
  detailers = [],
}: {
  subscriptions: Subscription[];
  role: "admin" | "secretary" | "detailer";
  detailers?: any[];
}) {
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [resubscribeTarget, setResubscribeTarget] = useState<Subscription | null>(null);
  const { cancelSubscriptionMutation, isCancelingSubscription } =
    useCancelSubscription(role);
  const { filter, filterYear, filterMonth } = useBookingStore();

  useEffect(() => {
    if (selectedSub) {
      const updated = subscriptions.find((s) => s.id === selectedSub.id);
      if (updated) setSelectedSub(updated);
    }
  }, [subscriptions]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "requested":
        return (
          <Badge
            className="px-3 py-1.5 rounded-lg text-xs w-20"
            variant="warning"
          >
            Requested
          </Badge>
        );
      case "pending":
        return (
          <Badge
            className="px-3 py-1.5 rounded-lg text-xs w-20"
            variant="default"
          >
            Pending
          </Badge>
        );
      case "finished":
        return (
          <Badge
            className="px-3 py-1.5 rounded-lg text-xs w-20"
            variant="success"
          >
            Finished
          </Badge>
        );
      case "canceled":
        return (
          <Badge
            className="px-3 py-1.5 rounded-lg text-xs w-20"
            variant="destructive"
          >
            Canceled
          </Badge>
        );
      default:
        return (
          <Badge
            className="px-3 py-1.5 rounded-lg text-xs font-semibold w-20"
            variant="outline"
          >
            {status}
          </Badge>
        );
    }
  };

  // Filter subscriptions by status
  const filteredSubscriptions =
    statusFilter === "All"
      ? subscriptions
      : subscriptions.filter((sub) => derivedStatus(sub) === statusFilter);

  const selectItems: Record<string, string> = {
    All: "All",
    requested: "Requested",
    pending: "Pending",
    canceled: "Cancelled",
    finished: "Finished",
  };

  return (
    <>
      {/* Status Filter */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 rounded-md border-muted-foreground bg-muted/50">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(selectItems).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {statusFilter !== "All" && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setStatusFilter("All")}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <Table className="text-center bg-muted/50 mt-4">
        <TableHeader className="bg-muted/50 font-bold">
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">Customer</TableHead>
            <TableHead className="text-center">Plan Type</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Total Price</TableHead>
            <TableHead className="text-center">Created At</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubscriptions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 text-muted-foreground"
              >
                No subscriptions found.
              </TableCell>
            </TableRow>
          ) : (
            filteredSubscriptions.map((sub) => {
              const computedStatus = derivedStatus(sub);
              const additionalTickets = Math.abs(
                Number(sub.plan_type || 0) - Number(sub.tickets?.length || 0),
              );
              return (
                <TableRow key={sub.id}>
                  <TableCell>#{sub.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center">
                      <span className="font-medium">
                        {sub.user?.name || sub.customer_name || "-"}
                      </span>
                      <a
                        href={`tel:${sub.user?.phone || sub.customer_phone || ""}`}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        {sub.user?.phone || sub.customer_phone || "-"}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    {sub.plan_type} Tickets{" "}
                    {additionalTickets ? (
                      <span className="text-blue-500 font-semibold">
                        (+{additionalTickets}{" "}
                        {additionalTickets > 1 ? " Tickets" : "Ticket"})
                      </span>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(computedStatus)}</TableCell>
                  <TableCell>
                    {sub.tickets
                      ? sub.tickets?.reduce(
                          (acc, t) => acc + (Number(t.price) || 0),
                          0,
                        )
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(sub.created_at), "PP")}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => setSelectedSub(sub)}
                    >
                      View Tickets
                    </Button>
                    {(role === "admin" || role === "secretary") &&
                      computedStatus !== "canceled" &&
                      computedStatus !== "finished" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => cancelSubscriptionMutation(sub.id)}
                          disabled={isCancelingSubscription}
                        >
                          Cancel
                        </Button>
                      )}
                    {/* Resubscribe — available for finished subscriptions */}
                    {(computedStatus === "finished" || computedStatus === "canceled") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-primary/30 text-primary hover:bg-primary/5"
                        onClick={() => setResubscribeTarget(sub)}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Resubscribe
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <Dialog
        open={!!selectedSub}
        onOpenChange={(v) => !v && setSelectedSub(null)}
      >
        <DialogContent className="min-w-[80vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Subscription #{selectedSub?.id} Tickets</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <BookingsTable
              tickets={(selectedSub?.tickets || []).filter((t) => {
                if (filter !== "All" && t.status !== filter) return false;
                if (filterYear) {
                  const date = new Date(t.date ?? "");
                  if (date.getFullYear().toString() !== filterYear)
                    return false;
                  if (
                    filterMonth &&
                    (date.getMonth() + 1).toString() !== filterMonth
                  )
                    return false;
                }
                return true;
              })}
              selectItems={selectItems}
              pagination={{
                currentPage: 1,
                totalPages: 1,
                totalItems: selectedSub?.tickets?.length || 0,
              }}
              isFetchingTickets={false}
              detailers={detailers}
              role={role}
              subscriptionId={selectedSub?.id}
              subscriptionUserId={selectedSub?.user_id || undefined}
              subscriptionCustomerName={selectedSub?.customer_name || undefined}
              subscriptionCustomerPhone={
                selectedSub?.customer_phone || undefined
              }
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Resubscribe Dialog */}
      {resubscribeTarget && (
        <ResubscribeDialog
          subscriptionId={String(resubscribeTarget.id)}
          planType={resubscribeTarget.plan_type}
          role={role}
          open={!!resubscribeTarget}
          onOpenChange={(v) => !v && setResubscribeTarget(null)}
        />
      )}
    </>
  );
}

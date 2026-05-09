import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCancelSubscription } from "@/hooks/useSubscription";
import type { Subscription } from "@/shared/types";
import { BookingsTable } from "../booking/BookingsTable";

export function SubscriptionsTable({
  subscriptions,
  role,
  detailers = []
}: {
  subscriptions: Subscription[];
  role: "admin" | "secretary" | "detailer";
  detailers?: any[];
}) {
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const { cancelSubscriptionMutation, isCancelingSubscription } = useCancelSubscription(role);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "requested": return <Badge variant="secondary">Requested</Badge>;
      case "pending": return <Badge variant="default">Pending</Badge>;
      case "finished": return <Badge variant="success" className="bg-green-500">Finished</Badge>;
      case "canceled": return <Badge variant="destructive">Canceled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
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
          {subscriptions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No subscriptions found.
              </TableCell>
            </TableRow>
          ) : (
            subscriptions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>#{sub.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col items-center">
                    <span className="font-medium">{sub.user?.name || sub.customer_name || "-"}</span>
                    <a href={`tel:${sub.user?.phone || sub.customer_phone || ""}`} className="text-sm text-muted-foreground hover:underline">
                      {sub.user?.phone || sub.customer_phone || "-"}
                    </a>
                  </div>
                </TableCell>
                <TableCell>{sub.plan_type} Tickets</TableCell>
                <TableCell>{getStatusBadge(sub.status)}</TableCell>
                <TableCell>{sub.total_price ? `${sub.total_price}` : "-"}</TableCell>
                <TableCell>{format(new Date(sub.created_at), "PP")}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedSub(sub)}>
                    View Tickets
                  </Button>
                  {(role === "admin" || role === "secretary") && sub.status !== "canceled" && sub.status !== "finished" && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => cancelSubscriptionMutation(sub.id)}
                      disabled={isCancelingSubscription}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={!!selectedSub} onOpenChange={(v) => !v && setSelectedSub(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Subscription #{selectedSub?.id} Tickets</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <BookingsTable
              tickets={selectedSub?.tickets || []}
              selectItems={{}}
              pagination={{ totalPages: 1 }}
              isFetchingTickets={false}
              detailers={detailers}
              role={role}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

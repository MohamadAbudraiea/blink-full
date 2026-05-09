import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookingsTable } from "@/components/booking/BookingsTable";
import { useBookingStore } from "@/stores/useBookingStore";
import {
  useGetAllDetailersForSecretary,
  useGetTicketsForSecretary,
} from "@/hooks/useSecretary";
import Loader from "@/components/ui/Loader";
import { SubscriptionsTable } from "@/components/subscription/SubscriptionsTable";
import { AddSubscriptionDialog } from "@/components/subscription/AddSubscriptionDialog";
import { useGetSubscriptions } from "@/hooks/useSubscription";
import { Loader2 } from "lucide-react";

export default function SecretaryDashboard() {
  const { detailers, isFetchingDetailers } = useGetAllDetailersForSecretary();
  const {
    filter,
    filterMonth,
    filterDay,
    filterYear,
    currentPage,
    itemsPerPage,
  } = useBookingStore();

  const queryParams: Record<string, string | number> = {
    page: currentPage,
    limit: itemsPerPage,
  };

  if (filter !== "All") {
    queryParams.filter = filter;
  }

  if (filterMonth) {
    queryParams.filterMonth = filterMonth;
  }

  if (filterDay) {
    queryParams.filterDay = filterDay;
  }

  if (filterYear) {
    queryParams.filterYear = filterYear;
  }

  const selectItems: Record<string, string> = {
    All: "All",
    requested: "Requested",
    pending: "Pending",
    canceled: "Cancelled",
    finished: "Finished",
  };

  const { tickets, pagination, isFetchingTickets } =
    useGetTicketsForSecretary(queryParams);

  const { subscriptions, isGettingSubscriptions } = useGetSubscriptions("secretary");

  if (isFetchingTickets || isFetchingDetailers) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">BLINK Secretary Dashboard</h1>
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings">
          <Card>
            <CardContent>
              <BookingsTable
                tickets={tickets}
                selectItems={selectItems}
                pagination={pagination}
                isFetchingTickets={isFetchingTickets}
                detailers={detailers}
                role="secretary"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Manage Subscriptions</CardTitle>
              <AddSubscriptionDialog role="secretary" detailers={detailers} />
            </CardHeader>
            <CardContent>
              {isGettingSubscriptions ? (
                <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : (
                <SubscriptionsTable subscriptions={subscriptions} role="secretary" detailers={detailers} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookingsTable } from "@/components/booking/BookingsTable";
import { ScheduleGantt } from "@/components/booking/ScheduleGantt";
import { useBookingStore } from "@/stores/useBookingStore";
import { useGetTicketsForDetailer } from "@/hooks/usedetailer";
import Loader from "@/components/ui/Loader";

function DetailerDashboard() {
  const {
    filter,
    filterMonth,
    filterDay,
    filterYear,
    currentPage,
    itemsPerPage,
    filterTicketId,
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
  if (filterTicketId) {
    queryParams.ticketId = filterTicketId;
  }

  const selectItems: Record<string, string> = {
    All: "All",
    requested: "Requested",
    pending: "Pending",
    canceled: "Cancelled",
    finished: "Finished",
  };

  const { tickets, pagination, isFetchingTickets } =
    useGetTicketsForDetailer(queryParams);

  if (isFetchingTickets) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">BLINK Detailer Dashboard</h1>
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings">
          <Card>
            <CardContent>
              <BookingsTable
                tickets={tickets}
                selectItems={selectItems}
                pagination={pagination}
                isFetchingTickets={isFetchingTickets}
                role="detailer"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules">
          <Card>
            <CardHeader>
              <CardTitle>My Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <ScheduleGantt role="detailer" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DetailerDashboard;

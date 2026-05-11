import { Card, CardContent } from "@/components/ui/card";
import { BookingsTable } from "@/components/booking/BookingsTable";
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
    </div>
  );
}

export default DetailerDashboard;

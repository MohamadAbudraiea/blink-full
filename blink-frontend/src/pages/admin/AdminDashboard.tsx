import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/admin/DataTable";
import { SecretaryForm } from "@/components/admin/SecretaryForm";
import { DetailerForm } from "@/components/admin/DetailerForm";
import { BookingsTable } from "@/components/booking/BookingsTable";
import { BookingsChart } from "@/components/admin/BookingsChart";
import { useGetUsers } from "@/hooks/useAdmin";
import { useGetFilteredTickets } from "@/hooks/useTicket";
import { useBookingStore } from "@/stores/useBookingStore";
import Loader from "@/components/ui/Loader";

export default function AdminDashboard() {
  const { users, isGettingUsers } = useGetUsers();
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

  const { tickets, pagination, isFetchingTickets } =
    useGetFilteredTickets(queryParams);

  const selectItems: Record<string, string> = {
    All: "All",
    requested: "Requested",
    pending: "Pending",
    canceled: "Cancelled",
    finished: "Finished",
  };

  if (isGettingUsers) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">BLINK Admin Dashboard</h1>

      <Tabs defaultValue="secretary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="secretary">Secretaries</TabsTrigger>
          <TabsTrigger value="detailer">Detailer</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        {/* Secretary CRUD */}
        <TabsContent value="secretary">
          <Card>
            <CardHeader>
              <CardTitle>Manage Secretaries</CardTitle>
            </CardHeader>
            <CardContent>
              <SecretaryForm />
              <DataTable
                data={users.secretaries}
                columns={[
                  { key: "name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailer CRUD */}
        <TabsContent value="detailer">
          <Card>
            <CardHeader>
              <CardTitle>Manage Detailer Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <DetailerForm />
              <DataTable
                data={users.detailers}
                columns={[
                  { key: "name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                ]}
                detailer={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings list */}
        <TabsContent value="bookings">
          <Card>
            <CardContent>
              <BookingsTable
                tickets={tickets}
                selectItems={selectItems}
                pagination={pagination}
                isFetchingTickets={isFetchingTickets}
                detailers={users.detailers}
                role="admin"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chart */}
        <TabsContent value="charts">
          <Card>
            <CardHeader>
              <CardTitle>Booking Status Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingsChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

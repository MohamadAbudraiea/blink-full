import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/admin/DataTable";
import { SecretaryForm } from "@/components/admin/SecretaryForm";
import { DetailerForm } from "@/components/admin/DetailerForm";
import { BookingsTable } from "@/components/booking/BookingsTable";
import { BookingsChart } from "@/components/admin/BookingsChart";
import { ScheduleGantt } from "@/components/admin/ScheduleGantt";
import { useGetUsers } from "@/hooks/useAdmin";
import { useGetFilteredTickets } from "@/hooks/useTicket";
import { useBookingStore } from "@/stores/useBookingStore";
import Loader from "@/components/ui/Loader";
import { SubscriptionsTable } from "@/components/subscription/SubscriptionsTable";
import { AddSubscriptionDialog } from "@/components/subscription/AddSubscriptionDialog";
import { useGetSubscriptions } from "@/hooks/useSubscription";
import { Loader2 } from "lucide-react";

// Finance components
import { AccountsManager } from "@/components/admin/finance/AccountsManager";
import { TransactionsTable } from "@/components/admin/finance/TransactionsTable";
import { FinanceReports } from "@/components/admin/finance/FinanceReports";

interface SelectedAccount {
  id: number;
  name: string;
}

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

  const { subscriptions, isGettingSubscriptions } = useGetSubscriptions("admin");

  // Finance state
  const [selectedAccount, setSelectedAccount] = useState<SelectedAccount | null>(null);
  const [financeView, setFinanceView] = useState<"accounts" | "transactions" | "reports">("accounts");

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
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
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

        {/* Subscriptions list */}
        <TabsContent value="subscriptions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Manage Subscriptions</CardTitle>
              <AddSubscriptionDialog role="admin" detailers={users.detailers} />
            </CardHeader>
            <CardContent>
              {isGettingSubscriptions ? (
                <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : (
                <SubscriptionsTable subscriptions={subscriptions} role="admin" detailers={users.detailers} />
              )}
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

        {/* Detailer Schedules Gantt */}
        <TabsContent value="schedules">
          <Card>
            <CardHeader>
              <CardTitle>Detailer Schedules</CardTitle>
            </CardHeader>
            <CardContent>
              <ScheduleGantt />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Finance */}
        <TabsContent value="finance">
          <div className="space-y-4">
            {/* Sub-navigation */}
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  financeView === "accounts" || financeView === "transactions"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                onClick={() => {
                  setFinanceView("accounts");
                  setSelectedAccount(null);
                }}
              >
                Accounts & Transactions
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  financeView === "reports"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                onClick={() => setFinanceView("reports")}
              >
                Reports & Charts
              </button>
            </div>

            {/* Finance Content */}
            {financeView === "reports" ? (
              <FinanceReports />
            ) : selectedAccount ? (
              <TransactionsTable
                accountId={selectedAccount.id}
                accountName={selectedAccount.name}
                onBack={() => {
                  setSelectedAccount(null);
                  setFinanceView("accounts");
                }}
              />
            ) : (
              <AccountsManager
                onSelectAccount={(acc) => {
                  setSelectedAccount({ id: acc.id, name: acc.name });
                  setFinanceView("transactions");
                }}
                selectedAccountId={selectedAccount}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

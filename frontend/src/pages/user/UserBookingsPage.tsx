import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import BookingCard from "@/components/user-bookings/BookingCard";
import { useGetUserTickets } from "@/hooks/useUser";
import { useBookingStore } from "@/stores/useBookingStore";
import { PaginationControls } from "@/components/booking/PaginationControls";
import { useEffect } from "react";
import Loader from "@/components/ui/Loader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGetSubscriptions } from "@/hooks/useSubscription";
import UserSubscriptionCard from "@/components/user-bookings/UserSubscriptionCard";
import { AddSubscriptionDialog } from "@/components/subscription/AddSubscriptionDialog";
import { useCheckAuth } from "@/hooks/useAuth";
import { CalendarDays, Car, CheckCircle2, Clock } from "lucide-react";

export default function UserBookingsPage() {
  const { t } = useTranslation();
  const { user } = useCheckAuth();

  const {
    filter,
    filterMonth,
    filterDay,
    filterYear,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setFilter,
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

  const {
    tickets = [],
    pagination,
    isGettingUserTickets,
  } = useGetUserTickets(queryParams);

  const { subscriptions, isGettingSubscriptions } = useGetSubscriptions("user");

  useEffect(() => {
    if (tickets.length > 0) {
      const hasPending = tickets.some((ticket) => ticket.status === "pending");
      const hasFinished = tickets.some(
        (ticket) => ticket.status === "finished",
      );
      const hasRequested = tickets.some(
        (ticket) => ticket.status === "requested",
      );
      const hasCanceled = tickets.some(
        (ticket) => ticket.status === "canceled",
      );

      if (hasPending) {
        setFilter("pending");
      } else if (hasFinished) {
        setFilter("finished");
      } else if (hasRequested) {
        setFilter("requested");
      } else if (hasCanceled) {
        setFilter("canceled");
      } else {
        setFilter("All");
      }
    }
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectItems: Record<string, string> = {
    All: "All",
    pending: "Pending",
    finished: "Finished",
    requested: "Requested",
    canceled: "Cancelled",
  };

  if (isGettingUserTickets) return <Loader />;

  const totalBookings = tickets.length;
  const activeBookings = tickets.filter((t) =>
    ["requested", "pending"].includes(t.status),
  ).length;
  const completedBookings = tickets.filter(
    (t) => t.status === "finished",
  ).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">
              {t("book.myBookings.welcome", {
                name: user?.name?.split(" ")[0] || "User",
              })}
            </h1>
            <p className="text-muted-foreground">
              {t("book.myBookings.subtitle")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Button asChild size="lg" className="shadow-lg shadow-primary/20">
              <a href="/booking" className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                {t("book.myBookings.bookNow")}
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 md:gap-4 mb-8"
        >
          <Card className="bg-background/50 backdrop-blur-sm border-border/50 shadow-sm">
            <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  {t("book.myBookings.quickStats.total")}
                </p>
                <p className="text-xl md:text-2xl font-bold">{totalBookings}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur-sm border-border/50 shadow-sm">
            <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  {t("book.myBookings.quickStats.active")}
                </p>
                <p className="text-xl md:text-2xl font-bold">
                  {activeBookings}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur-sm border-border/50 shadow-sm">
            <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  {t("book.myBookings.quickStats.completed")}
                </p>
                <p className="text-xl md:text-2xl font-bold">
                  {completedBookings}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            {/* Chip Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {Object.entries(selectItems).map(([key, _]) => {
                const isActive =
                  filter === key || (filter === "All" && key === "All");
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setFilter(key);
                      setCurrentPage(1);
                    }}
                    className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border/50 hover:text-foreground"
                    }`}
                  >
                    {t(`book.myBookings.filters.${key.toLowerCase()}`)}
                  </button>
                );
              })}
            </div>

            {tickets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center"
              >
                <div className="relative w-40 h-40 mx-auto mb-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"
                  />
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                    className="relative z-10 w-full h-full flex items-center justify-center bg-muted/50 rounded-full border border-border/50"
                  >
                    <Car className="w-20 h-20 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                  </motion.div>
                </div>
                <h3 className="text-3xl font-bold mb-3">
                  {t("book.myBookings.empty.title")}
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                  {t("book.myBookings.empty.bookFirst")}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="px-8 shadow-lg shadow-primary/20"
                >
                  <a href="/booking">{t("book.myBookings.bookNow")}</a>
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BookingCard booking={ticket} />
                  </motion.div>
                ))}
                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <PaginationControls
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            {isGettingSubscriptions ? (
              <Loader />
            ) : subscriptions.length === 0 ? (
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="pt-8 pb-8 text-center">
                  <p className="text-muted-foreground mb-6">
                    You have no subscriptions yet.
                  </p>
                  <AddSubscriptionDialog role="user" />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-end mb-4">
                  <AddSubscriptionDialog role="user" />
                </div>
                {subscriptions.map((sub) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <UserSubscriptionCard subscription={sub} />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

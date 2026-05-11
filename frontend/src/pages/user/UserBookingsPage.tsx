import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import BookingCard from "@/components/user-bookings/BookingCard";
import { useGetUserTickets } from "@/hooks/useUser";
import { useBookingStore } from "@/stores/useBookingStore";
import BookingFilters from "@/components/booking/BookingFilters";
import { PaginationControls } from "@/components/booking/PaginationControls";
import { useEffect } from "react";
import Loader from "@/components/ui/Loader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGetSubscriptions } from "@/hooks/useSubscription";
import UserSubscriptionCard from "@/components/user-bookings/UserSubscriptionCard";
import { AddSubscriptionDialog } from "@/components/subscription/AddSubscriptionDialog";

export default function UserBookingsPage() {
  const { t } = useTranslation();

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

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            {t("book.myBookings.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("book.myBookings.subtitle")}
          </p>
        </motion.div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-end">
              <Button asChild>
                <a href="/booking">{t("book.myBookings.bookNow")}</a>
              </Button>
            </div>

            {/* Filter options */}
            <BookingFilters role="user" selectItems={selectItems} />

            {tickets.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    {t("book.myBookings.noBookings")}
                  </p>
                  <Button asChild>
                    <a href="/booking">{t("book.myBookings.bookNow")}</a>
                  </Button>
                </CardContent>
              </Card>
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
                  <div className="mt-4 flex justify-center">
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
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">
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

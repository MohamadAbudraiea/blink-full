import type { Ticket } from "@/shared/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { BookingsTableRow } from "@/components/booking/BookingsTableRow";
import { PaginationControls } from "@/components/booking/PaginationControls";
import { CancelConfirmationDialog } from "@/components/booking/CancelConfirmationDialog";
import { useBookingStore } from "@/stores/useBookingStore";
import BookingFilters from "./BookingFilters";
import Loader from "../ui/Loader";

export function BookingsTable({
  detailers = [],
  selectItems,
  isFetchingTickets = false,
  tickets = [],
  pagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  role = "admin",
  subscriptionId,
  subscriptionUserId,
  subscriptionCustomerName,
  subscriptionCustomerPhone,
}: {
  detailers?: { id: string; name: string }[];
  selectItems: Record<string, string>;
  isFetchingTickets?: boolean;
  tickets?: Ticket[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  role?: "admin" | "secretary" | "detailer";
  subscriptionId?: string;
  subscriptionUserId?: string;
  subscriptionCustomerName?: string;
  subscriptionCustomerPhone?: string;
}) {
  const {
    cancelDialogOpen,
    setCurrentPage,
    setCancelDialogOpen,
    confirmCancel,
  } = useBookingStore();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isFetchingTickets) return <Loader />;
  return (
    <>
      {/* Filter options */}
      <BookingFilters 
        selectItems={selectItems} 
        role={role} 
        detailers={detailers} 
        subscriptionId={subscriptionId}
        subscriptionUserId={subscriptionUserId}
        subscriptionCustomerName={subscriptionCustomerName}
        subscriptionCustomerPhone={subscriptionCustomerPhone}
      />
      {/* Table */}
      <Table className="text-center bg-muted/50">
        <TableHeader className="bg-muted/50 font-bold">
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Service</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Note</TableCell>
            <TableCell>Secretary</TableCell>
            <TableCell>Detailer</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets && tickets.length > 0 ? (
            tickets.map((ticket: Ticket) => (
              <BookingsTableRow
                key={ticket.id}
                ticket={ticket}
                detailers={detailers}
                role={role}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10}>No bookings found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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

      {/* Cancel confirmation dialog */}
      <CancelConfirmationDialog
        open={cancelDialogOpen}
        setOpen={setCancelDialogOpen}
        onConfirm={confirmCancel}
      />
    </>
  );
}

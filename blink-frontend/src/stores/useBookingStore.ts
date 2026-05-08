// stores/useBookingStore.ts
import { create } from "zustand";
import type { Ticket } from "@/shared/types";

interface ScheduleItem {
  ticket_id: string;
  date: string;
  start: string;
  end: string;
  interval: string;
}

interface BookingState {
  // Filter and pagination
  filter: string;
  currentPage: number;
  itemsPerPage: number;
  filterMonth: string | null;
  filterDay: string | null;
  filterYear: string | null;

  // Cancel dialog state
  cancelDialogOpen: boolean;
  selectedTicket: Ticket | null;
  cancelReason: string;
  customReason: string;

  // Booking dialog state
  selectedDate: Date | undefined;
  startTime: string;
  endTime: string;

  // Detailer schedule state
  selectedDetailerId: string | null;
  detailerSchedule: ScheduleItem[];
  isGettingDetailerSchedule: boolean;

  // Actions
  setFilter: (filter: string) => void;
  setCurrentPage: (page: number) => void;
  setCancelDialogOpen: (open: boolean) => void;
  setSelectedTicket: (ticket: Ticket | null) => void;
  setCancelReason: (reason: string) => void;
  setCustomReason: (reason: string) => void;
  setSelectedDate: (date: Date | undefined) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  handleCancelClick: (ticket: Ticket) => void;
  confirmCancel: () => void;
  handleDialogOpen: (ticket: Ticket) => void;
  resetCancelState: () => void;
  setSelectedDetailerId: (id: string | null) => void;
  setDetailerSchedule: (schedule: ScheduleItem[]) => void;
  setIsGettingDetailerSchedule: (loading: boolean) => void;
  setFilterMonth: (month: string | null) => void;
  setFilterDay: (day: string | null) => void;
  setFilterYear: (year: string | null) => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  // Initial state
  filter: "All",
  filterMonth: null,
  filterDay: null,
  filterYear: null,
  currentPage: 1,
  itemsPerPage: 5,
  cancelDialogOpen: false,
  selectedTicket: null,
  cancelReason: "",
  customReason: "",
  selectedDate: undefined,
  startTime: "",
  endTime: "",
  selectedDetailerId: null,
  detailerSchedule: [],
  isGettingDetailerSchedule: false,

  // Actions
  setFilter: (filter) => set({ filter, currentPage: 1 }),
  setFilterMonth: (filterMonth) => set({ filterMonth, currentPage: 1 }),
  setFilterDay: (filterDay) => set({ filterDay, currentPage: 1 }),
  setFilterYear: (filterYear) => set({ filterYear, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setCancelDialogOpen: (cancelDialogOpen) => set({ cancelDialogOpen }),
  setSelectedTicket: (selectedTicket) => set({ selectedTicket }),
  setCancelReason: (cancelReason) => set({ cancelReason }),
  setCustomReason: (customReason) => set({ customReason }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setStartTime: (startTime) => set({ startTime }),
  setEndTime: (endTime) => set({ endTime }),

  handleCancelClick: (ticket) => {
    set({ selectedTicket: ticket, cancelDialogOpen: true });
  },

  confirmCancel: () => {
    set({ cancelDialogOpen: false });
    get().resetCancelState();
  },

  handleDialogOpen: (ticket) => {
    set({ selectedTicket: ticket });

    if (ticket.date) {
      const parsedDate = new Date(ticket.date);
      if (!isNaN(parsedDate.getTime())) {
        set({ selectedDate: parsedDate });
      } else {
        set({ selectedDate: undefined });
      }
    } else {
      set({ selectedDate: undefined });
    }
  },

  resetCancelState: () => {
    set({ cancelReason: "", customReason: "" });
  },

  setSelectedDetailerId: (selectedDetailerId) => set({ selectedDetailerId }),
  setDetailerSchedule: (detailerSchedule) => set({ detailerSchedule }),
  setIsGettingDetailerSchedule: (isGettingDetailerSchedule) =>
    set({ isGettingDetailerSchedule }),
}));

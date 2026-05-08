export type ServiceType = "wash" | "dryclean" | "polish" | "nano" | "graphene";
export type StatusType = "requested" | "pending" | "finished" | "canceled";

export interface User {
  id: string;
  created_at?: Date;
  name: string;
  email: string;
  phone: string;
  type?: string;
  password?: string;
}

export interface Ticket {
  id: string;
  created_at: Date;
  user: User;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  price: number;
  phone: string;
  note: string;
  service: ServiceType;
  status: StatusType;
  location: string;
  secretary: User | null;
  detailer: User | null;
  secretary_id: string | null;
  detailer_id: string | null;
  cancel_reason: string | null;
  rating: Rating | null;
  typeOfService?: string;
}

export interface Rating {
  id: string;
  created_at: Date;
  user?: User;
  user_id: string;
  ticket_id: string;
  description: string;
  rating_number: number;
  isPublished?: boolean;
}

export type AddUser = {
  name: string;
  email: string;
  phone: string;
  password: string;
  type: string;
};

export type EditUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  [key: string]: string;
};

export interface ScheduleItem {
  ticket_id: string;
  date: string;
  start: string;
  end: string;
  interval: string;
}

export interface Booking {
  id: string;
  created_at: string;
  user_id: string;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  price: string | null;
  service: ServiceType;
  typeOfService?: string;
  status: StatusType;
  location: string;
  secretary_id: string | null;
  detailer_id: string | null;
  cancel_reason: string | null;
  note: string | null;
  detailer: { name: string } | null;
  secretary: { name: string } | null;
  ratings: { rating_number: number; description: string | null }[] | null;
}

export interface AcceptTicketParams {
  id: string;
  detailer_id: string;
  date: string;
  start_time: string;
  end_time: string;
  price: number;
  location: string;
}

export interface CancelTicketParams {
  id: string;
  reason: string;
}

export interface UseAcceptTicketHook {
  acceptTicketMutation: (params: AcceptTicketParams) => void;
  isAcceptingTicket: boolean;
}

export interface UseCancelTicketHook {
  cancelTicketMutation: (params: CancelTicketParams) => void;
  isCancellingTicket: boolean;
}

import type {
  PriorityValue,
  StatusValue,
  TicketFormValues,
} from "@/features/tickets/validation/ticket-schema";

export type FormOption = {
  id: string;
  name: string;
};

export type TicketListItem = {
  id: string;
  title: string;
  description: string | null;
  priority: PriorityValue;
  status: StatusValue;
  assignedToName: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
};

export type TicketEditItem = TicketFormValues & {
  id: string;
};

export type TicketFormOptions = {
  users: FormOption[];
  categories: FormOption[];
};

export type TicketActionResult = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof TicketFormValues, string[]>>;
};

export type SortField = "createdAt" | "status" | "priority";
export type SortOrder = "asc" | "desc";

export type TicketFilters = {
  search?: string;
  status?: StatusValue;
  priority?: PriorityValue;
  sortBy?: SortField;
  sortOrder?: SortOrder;
};

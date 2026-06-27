"use server";

import { revalidatePath } from "next/cache";

import {
  statusUpdateSchema,
  ticketFormSchema,
  type StatusValue,
  type TicketFormValues,
} from "@/features/tickets/validation/ticket-schema";
import type { TicketActionResult } from "@/features/tickets/types";
import {
  createTicket,
  deleteTicket,
  updateTicket,
  updateTicketStatus,
} from "@/features/tickets/services/ticket-service";

function revalidateTicketPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/tickets");
}

function toActionError(message: string): TicketActionResult {
  return {
    success: false,
    message,
  };
}

export async function createTicketAction(
  input: TicketFormValues,
): Promise<TicketActionResult> {
  const parsed = ticketFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Check the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createTicket(parsed.data);
    revalidateTicketPaths();
    return { success: true };
  } catch {
    return toActionError("Unable to create ticket.");
  }
}

export async function updateTicketAction(
  id: string,
  input: TicketFormValues,
): Promise<TicketActionResult> {
  const parsed = ticketFormSchema.safeParse(input);

  if (!id) {
    return toActionError("Ticket id is missing.");
  }

  if (!parsed.success) {
    return {
      success: false,
      message: "Check the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateTicket(id, parsed.data);
    revalidateTicketPaths();
    revalidatePath(`/tickets/${id}/edit`);
    return { success: true };
  } catch {
    return toActionError("Unable to update ticket.");
  }
}

export async function updateTicketStatusAction(
  id: string,
  status: StatusValue,
): Promise<TicketActionResult> {
  const parsed = statusUpdateSchema.safeParse({ id, status });

  if (!parsed.success) {
    return toActionError("Select a valid status.");
  }

  try {
    await updateTicketStatus(parsed.data.id, parsed.data.status);
    revalidateTicketPaths();
    revalidatePath(`/tickets/${parsed.data.id}/edit`);
    return { success: true };
  } catch {
    return toActionError("Unable to update ticket status.");
  }
}

export async function deleteTicketAction(
  id: string,
): Promise<TicketActionResult> {
  if (!id) {
    return toActionError("Ticket id is missing.");
  }

  try {
    await deleteTicket(id);
    revalidateTicketPaths();
    return { success: true };
  } catch {
    return toActionError("Unable to delete ticket.");
  }
}

import { z } from "zod";

export const priorityValues = ["LOW", "MEDIUM", "HIGH"] as const;
export const statusValues = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
] as const;

export const ticketFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be 120 characters or less"),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional(),
  priority: z.enum(priorityValues, {
    error: "Select a priority",
  }),
  status: z.enum(statusValues, {
    error: "Select a status",
  }),
  assignedToId: z.string().min(1, "Select an assignee"),
  categoryId: z.string().min(1, "Select a category"),
});

export const statusUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(statusValues),
});

export type PriorityValue = (typeof priorityValues)[number];
export type StatusValue = (typeof statusValues)[number];
export type TicketFormValues = z.infer<typeof ticketFormSchema>;

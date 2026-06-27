import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import type {
  StatusValue,
  TicketFormValues,
} from "@/features/tickets/validation/ticket-schema";
import type {
  TicketEditItem,
  TicketFilters,
  TicketFormOptions,
  TicketListItem,
} from "@/features/tickets/types";

const ticketInclude = {
  assignedTo: {
    select: {
      id: true,
      name: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
    },
  },
};

function normalizeTicketInput(data: TicketFormValues) {
  return {
    title: data.title.trim(),
    description: data.description?.trim() || null,
    priority: data.priority,
    status: data.status,
    assignedToId: data.assignedToId,
    categoryId: data.categoryId,
  };
}

function mapTicketListItem(ticket: {
  id: string;
  title: string;
  description: string | null;
  priority: TicketListItem["priority"];
  status: TicketListItem["status"];
  assignedTo: { name: string };
  category: { name: string };
  createdAt: Date;
  updatedAt: Date;
}): TicketListItem {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
    assignedToName: ticket.assignedTo.name,
    categoryName: ticket.category.name,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  };
}

const priorityOrder: Record<string, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

const statusOrder: Record<string, number> = {
  OPEN: 0,
  IN_PROGRESS: 1,
  RESOLVED: 2,
  CLOSED: 3,
};

export async function getTickets(
  filters?: TicketFilters,
): Promise<TicketListItem[]> {
  const where: Prisma.TicketWhereInput = {};

  if (filters?.search) {
    where.title = { contains: filters.search, mode: "insensitive" };
  }
  if (filters?.status) {
    where.status = filters.status;
  }
  if (filters?.priority) {
    where.priority = filters.priority;
  }

  const orderBy: Prisma.TicketOrderByWithRelationInput[] = [];
  const sortBy = filters?.sortBy;
  const sortOrder = filters?.sortOrder ?? "desc";

  if (sortBy === "createdAt") {
    orderBy.push({ createdAt: sortOrder });
  } else if (sortBy === "status" || sortBy === "priority") {
    orderBy.push({ [sortBy]: sortOrder });
  } else {
    orderBy.push({ updatedAt: "desc" }, { createdAt: "desc" });
  }

  let tickets = (
    await prisma.ticket.findMany({ where, include: ticketInclude, orderBy })
  ).map(mapTicketListItem);

  if (sortBy === "priority") {
    tickets = tickets.sort((a, b) => {
      const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
      return sortOrder === "asc" ? diff : -diff;
    });
  }

  if (sortBy === "status") {
    tickets = tickets.sort((a, b) => {
      const diff = statusOrder[a.status] - statusOrder[b.status];
      return sortOrder === "asc" ? diff : -diff;
    });
  }

  return tickets;
}

export async function getRecentTickets(limit = 5): Promise<TicketListItem[]> {
  const tickets = await prisma.ticket.findMany({
    include: ticketInclude,
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return tickets.map(mapTicketListItem);
}

export async function getDashboardStats() {
  const [
    total,
    open,
    inProgress,
    resolved,
    closed,
    highPriority,
    recentTickets,
  ] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { status: "OPEN" } }),
    prisma.ticket.count({ where: { status: "IN_PROGRESS" } }),
    prisma.ticket.count({ where: { status: "RESOLVED" } }),
    prisma.ticket.count({ where: { status: "CLOSED" } }),
    prisma.ticket.count({ where: { priority: "HIGH" } }),
    getRecentTickets(),
  ]);

  return {
    total,
    open,
    inProgress,
    resolved,
    closed,
    highPriority,
    recentTickets,
  };
}

export async function getTicketFormOptions(): Promise<TicketFormOptions> {
  const [users, categories] = await Promise.all([
    prisma.user.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return { users, categories };
}

export async function getTicketById(
  id: string,
): Promise<TicketEditItem | null> {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      priority: true,
      status: true,
      assignedToId: true,
      categoryId: true,
    },
  });

  if (!ticket) {
    return null;
  }

  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description ?? "",
    priority: ticket.priority,
    status: ticket.status,
    assignedToId: ticket.assignedToId,
    categoryId: ticket.categoryId,
  };
}

export async function createTicket(data: TicketFormValues) {
  return prisma.ticket.create({
    data: normalizeTicketInput(data),
  });
}

export async function updateTicket(id: string, data: TicketFormValues) {
  return prisma.ticket.update({
    where: { id },
    data: normalizeTicketInput(data),
  });
}

export async function updateTicketStatus(id: string, status: StatusValue) {
  return prisma.ticket.update({
    where: { id },
    data: { status },
  });
}

export async function deleteTicket(id: string) {
  return prisma.ticket.delete({
    where: { id },
  });
}

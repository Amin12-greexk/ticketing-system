import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TicketTable } from "@/features/tickets/components/ticket-table";
import { TicketToolbar } from "@/features/tickets/components/ticket-toolbar";
import { getTickets } from "@/features/tickets/services/ticket-service";
import type { TicketFilters } from "@/features/tickets/types";
import type {
  PriorityValue,
  StatusValue,
} from "@/features/tickets/validation/ticket-schema";
import {
  priorityValues,
  statusValues,
} from "@/features/tickets/validation/ticket-schema";

export const dynamic = "force-dynamic";

function parseSort(sort: string | undefined) {
  if (!sort) return {};

  const [field, order] = sort.split("-");
  const validFields = ["createdAt", "status", "priority"];
  const validOrders = ["asc", "desc"];

  if (
    field &&
    order &&
    validFields.includes(field) &&
    validOrders.includes(order)
  ) {
    return {
      sortBy: field as TicketFilters["sortBy"],
      sortOrder: order as TicketFilters["sortOrder"],
    };
  }

  return {};
}

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const search = typeof params.search === "string" ? params.search : undefined;
  const statusParam =
    typeof params.status === "string" ? params.status : undefined;
  const priorityParam =
    typeof params.priority === "string" ? params.priority : undefined;
  const sortParam =
    typeof params.sort === "string" ? params.sort : undefined;

  const status =
    statusParam && statusValues.includes(statusParam as StatusValue)
      ? (statusParam as StatusValue)
      : undefined;
  const priority =
    priorityParam && priorityValues.includes(priorityParam as PriorityValue)
      ? (priorityParam as PriorityValue)
      : undefined;

  const filters: TicketFilters = {
    search,
    status,
    priority,
    ...parseSort(sortParam),
  };

  const tickets = await getTickets(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Tickets</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, update, and close support tickets.
          </p>
        </div>
        <Button asChild>
          <Link href="/tickets/new">
            <Plus className="size-4" />
            New ticket
          </Link>
        </Button>
      </div>
      <Suspense>
        <TicketToolbar />
      </Suspense>
      <TicketTable tickets={tickets} />
    </div>
  );
}

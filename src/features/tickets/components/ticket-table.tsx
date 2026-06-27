"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteDialog } from "@/features/tickets/components/delete-dialog";
import { PriorityBadge } from "@/features/tickets/components/priority-badge";
import {
  formatStatus,
  StatusBadge,
} from "@/features/tickets/components/status-badge";
import { updateTicketStatusAction } from "@/features/tickets/actions/ticket-actions";
import type { TicketListItem } from "@/features/tickets/types";
import {
  statusValues,
  type StatusValue,
} from "@/features/tickets/validation/ticket-schema";

type TicketTableProps = {
  tickets: TicketListItem[];
};

function formatDate(value: string) {
  return format(new Date(value), "MMM d, yyyy");
}

function StatusSelect({ ticket }: { ticket: TicketListItem }) {
  const router = useRouter();
  const [status, setStatus] = useState<StatusValue>(ticket.status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(nextStatus: string) {
    const parsedStatus = nextStatus as StatusValue;
    const previousStatus = status;

    setStatus(parsedStatus);
    setError(null);

    startTransition(async () => {
      const result = await updateTicketStatusAction(ticket.id, parsedStatus);

      if (!result.success) {
        setStatus(previousStatus);
        setError(result.message ?? "Unable to update status.");
        toast.error(result.message ?? "Unable to update status.");
        return;
      }

      toast.success("Status updated.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-1">
      <Select
        value={status}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-36">
          <SelectValue aria-label={formatStatus(status)} />
        </SelectTrigger>
        <SelectContent>
          {statusValues.map((value) => (
            <SelectItem key={value} value={value}>
              {formatStatus(value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function RowActions({ ticket }: { ticket: TicketListItem }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild variant="outline" size="icon-sm" title="Edit ticket">
        <Link
          href={`/tickets/${ticket.id}/edit`}
          aria-label={`Edit ${ticket.title}`}
        >
          <Pencil className="size-4" />
        </Link>
      </Button>
      <DeleteDialog ticketId={ticket.id} ticketTitle={ticket.title} />
    </div>
  );
}

export function TicketTable({ tickets }: TicketTableProps) {
  if (tickets.length === 0) {
    return (
      <EmptyState
        title="No tickets found"
        description="Create the first ticket to start tracking work, or adjust your filters."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card className="hidden overflow-hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="max-w-xs">
                  <div className="font-medium text-slate-950">
                    {ticket.title}
                  </div>
                  {ticket.description ? (
                    <div className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {ticket.description}
                    </div>
                  ) : null}
                </TableCell>
                <TableCell>{ticket.categoryName}</TableCell>
                <TableCell>{ticket.assignedToName}</TableCell>
                <TableCell>
                  <PriorityBadge priority={ticket.priority} />
                </TableCell>
                <TableCell>
                  <StatusSelect ticket={ticket} />
                </TableCell>
                <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                <TableCell>
                  <RowActions ticket={ticket} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid gap-3 md:hidden">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-medium text-slate-950">
                  {ticket.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {ticket.categoryName} · {ticket.assignedToName}
                </p>
              </div>
              <RowActions ticket={ticket} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <StatusSelect ticket={ticket} />
              <span className="text-sm text-slate-500">
                {formatDate(ticket.createdAt)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

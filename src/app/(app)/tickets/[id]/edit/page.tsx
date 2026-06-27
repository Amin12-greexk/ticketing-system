import { notFound } from "next/navigation";

import { TicketForm } from "@/features/tickets/components/ticket-form";
import {
  getTicketById,
  getTicketFormOptions,
} from "@/features/tickets/services/ticket-service";

export const dynamic = "force-dynamic";

export default async function EditTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [ticket, options] = await Promise.all([
    getTicketById(id),
    getTicketFormOptions(),
  ]);

  if (!ticket) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Edit ticket</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update ticket details, ownership, priority, and status.
        </p>
      </div>
      <TicketForm mode="edit" ticket={ticket} options={options} />
    </div>
  );
}

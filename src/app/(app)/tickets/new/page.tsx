import { TicketForm } from "@/features/tickets/components/ticket-form";
import { getTicketFormOptions } from "@/features/tickets/services/ticket-service";

export const dynamic = "force-dynamic";

export default async function NewTicketPage() {
  const options = await getTicketFormOptions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">New ticket</h1>
        <p className="mt-1 text-sm text-slate-500">
          Capture the request details and assign ownership.
        </p>
      </div>
      <TicketForm mode="create" options={options} />
    </div>
  );
}

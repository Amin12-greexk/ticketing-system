import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function TicketNotFound() {
  return (
    <div className="rounded-md border bg-white p-6">
      <h1 className="text-lg font-semibold">Ticket not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        The ticket may have been deleted or the link is incorrect.
      </p>
      <Button asChild className="mt-4">
        <Link href="/tickets">Back to tickets</Link>
      </Button>
    </div>
  );
}

"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function TicketsError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-md border bg-white p-6">
      <h2 className="text-lg font-semibold">Unable to load tickets</h2>
      <p className="mt-2 text-sm text-slate-500">
        The ticket data could not be loaded.
      </p>
      <Button className="mt-4" type="button" onClick={() => unstable_retry()}>
        Try again
      </Button>
    </div>
  );
}

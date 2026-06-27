"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AppError({
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
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-2 text-sm text-slate-500">
        Refresh this section and try again.
      </p>
      <Button className="mt-4" type="button" onClick={() => unstable_retry()}>
        Try again
      </Button>
    </div>
  );
}

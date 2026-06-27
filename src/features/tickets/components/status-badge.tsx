import { Badge } from "@/components/ui/badge";
import type { StatusValue } from "@/features/tickets/validation/ticket-schema";

const statusMeta: Record<
  StatusValue,
  {
    label: string;
    variant:
      "default" | "secondary" | "outline" | "success" | "warning" | "info";
  }
> = {
  OPEN: {
    label: "Open",
    variant: "info",
  },
  IN_PROGRESS: {
    label: "In progress",
    variant: "warning",
  },
  RESOLVED: {
    label: "Resolved",
    variant: "success",
  },
  CLOSED: {
    label: "Closed",
    variant: "secondary",
  },
};

export function StatusBadge({ status }: { status: StatusValue }) {
  const meta = statusMeta[status];

  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

export function formatStatus(status: StatusValue) {
  return statusMeta[status].label;
}

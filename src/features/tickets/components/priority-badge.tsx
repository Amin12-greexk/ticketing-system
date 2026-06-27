import { Badge } from "@/components/ui/badge";
import type { PriorityValue } from "@/features/tickets/validation/ticket-schema";

const priorityMeta: Record<
  PriorityValue,
  {
    label: string;
    variant: "secondary" | "warning" | "danger";
  }
> = {
  LOW: {
    label: "Low",
    variant: "secondary",
  },
  MEDIUM: {
    label: "Medium",
    variant: "warning",
  },
  HIGH: {
    label: "High",
    variant: "danger",
  },
};

export function PriorityBadge({ priority }: { priority: PriorityValue }) {
  const meta = priorityMeta[priority];

  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

export function formatPriority(priority: PriorityValue) {
  return priorityMeta[priority].label;
}

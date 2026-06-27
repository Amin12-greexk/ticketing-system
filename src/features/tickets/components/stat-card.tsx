import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  accent?: "teal" | "sky" | "amber" | "red";
};

const accentClasses = {
  teal: "bg-teal-50 text-teal-700",
  sky: "bg-sky-50 text-sky-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accent = "teal",
}: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-md",
            accentClasses[accent],
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{description}</p>
    </Card>
  );
}

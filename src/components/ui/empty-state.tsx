import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <Card className="flex min-h-48 items-center justify-center p-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-100">
          <Icon className="size-6 text-slate-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        {children}
      </div>
    </Card>
  );
}

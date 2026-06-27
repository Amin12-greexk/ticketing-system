import Link from "next/link";
import { AlertCircle, Clock3, Flame, Inbox, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TicketTable } from "@/features/tickets/components/ticket-table";
import { StatCard } from "@/features/tickets/components/stat-card";
import { getDashboardStats } from "@/features/tickets/services/ticket-service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ticket workload and recent activity.
          </p>
        </div>
        <Button asChild>
          <Link href="/tickets/new">
            <Plus className="size-4" />
            New ticket
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total tickets"
          value={stats.total}
          description="All tickets in the system"
          icon={Inbox}
          accent="teal"
        />
        <StatCard
          title="Open"
          value={stats.open}
          description="Needs first response"
          icon={AlertCircle}
          accent="sky"
        />
        <StatCard
          title="In progress"
          value={stats.inProgress}
          description="Currently being worked"
          icon={Clock3}
          accent="amber"
        />
        <StatCard
          title="High priority"
          value={stats.highPriority}
          description="Requires focused attention"
          icon={Flame}
          accent="red"
        />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent tickets</h2>
            <p className="text-sm text-slate-500">
              The latest tickets updated by the team.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/tickets">View all</Link>
          </Button>
        </div>
        <TicketTable tickets={stats.recentTickets} />
      </section>
    </div>
  );
}

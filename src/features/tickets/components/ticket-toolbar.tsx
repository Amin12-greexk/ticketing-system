"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPriority } from "@/features/tickets/components/priority-badge";
import { formatStatus } from "@/features/tickets/components/status-badge";
import {
  priorityValues,
  statusValues,
} from "@/features/tickets/validation/ticket-schema";

const ALL = "__all__";

const sortOptions = [
  { value: "createdAt-desc", label: "Newest first" },
  { value: "createdAt-asc", label: "Oldest first" },
  { value: "priority-desc", label: "Priority: High to Low" },
  { value: "priority-asc", label: "Priority: Low to High" },
  { value: "status-asc", label: "Status: Open to Closed" },
  { value: "status-desc", label: "Status: Closed to Open" },
] as const;

export function TicketToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? "",
  );

  const currentStatus = searchParams.get("status") ?? ALL;
  const currentPriority = searchParams.get("priority") ?? ALL;
  const currentSort =
    searchParams.get("sort") ?? `${sortOptions[0].value}`;

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === ALL) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      startTransition(() => {
        router.push(`/tickets?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition],
  );

  const hasFilters =
    searchParams.has("search") ||
    searchParams.has("status") ||
    searchParams.has("priority") ||
    searchParams.has("sort");

  function clearAll() {
    setSearchValue("");
    startTransition(() => {
      router.push("/tickets");
    });
  }

  return (
    <div
      className={`space-y-3 ${isPending ? "pointer-events-none opacity-60" : ""}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <form
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            updateParams({ search: searchValue });
          }}
        >
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search tickets..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </form>

        <div className="flex flex-wrap gap-2">
          <Select
            value={currentStatus}
            onValueChange={(value) => updateParams({ status: value })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              {statusValues.map((status) => (
                <SelectItem key={status} value={status}>
                  {formatStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentPriority}
            onValueChange={(value) => updateParams({ priority: value })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All priorities</SelectItem>
              {priorityValues.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {formatPriority(priority)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentSort}
            onValueChange={(value) => updateParams({ sort: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasFilters ? (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearAll}
          >
            <X className="size-3" />
            Clear filters
          </Button>
        </div>
      ) : null}
    </div>
  );
}

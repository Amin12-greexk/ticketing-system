"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createTicketAction,
  updateTicketAction,
} from "@/features/tickets/actions/ticket-actions";
import type {
  TicketEditItem,
  TicketFormOptions,
} from "@/features/tickets/types";
import { formatPriority } from "@/features/tickets/components/priority-badge";
import { formatStatus } from "@/features/tickets/components/status-badge";
import {
  priorityValues,
  statusValues,
  ticketFormSchema,
  type TicketFormValues,
} from "@/features/tickets/validation/ticket-schema";

type TicketFormProps = {
  mode: "create" | "edit";
  options: TicketFormOptions;
  ticket?: TicketEditItem;
};

const emptyDefaults: TicketFormValues = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "OPEN",
  assignedToId: "",
  categoryId: "",
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-600">{message}</p>;
}

export function TicketForm({ mode, options, ticket }: TicketFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: ticket ?? emptyDefaults,
  });

  function applyServerErrors(
    errors: Partial<Record<keyof TicketFormValues, string[]>> | undefined,
  ) {
    if (!errors) {
      return;
    }

    for (const [field, messages] of Object.entries(errors)) {
      if (messages?.[0]) {
        form.setError(field as keyof TicketFormValues, {
          type: "server",
          message: messages[0],
        });
      }
    }
  }

  function onSubmit(values: TicketFormValues) {
    setFormError(null);

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createTicketAction(values)
          : await updateTicketAction(ticket?.id ?? "", values);

      if (!result.success) {
        setFormError(result.message ?? "Unable to save ticket.");
        applyServerErrors(result.errors);
        toast.error(result.message ?? "Unable to save ticket.");
        return;
      }

      toast.success(
        mode === "create"
          ? "Ticket created successfully."
          : "Ticket updated successfully.",
      );
      router.push("/tickets");
      router.refresh();
    });
  }

  return (
    <Card className="max-w-3xl p-5">
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {formError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        ) : null}

        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Unable to access VPN"
            aria-invalid={Boolean(form.formState.errors.title)}
            {...form.register("title")}
          />
          <FieldError message={form.formState.errors.title?.message} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the incident or request"
            aria-invalid={Boolean(form.formState.errors.description)}
            {...form.register("description")}
          />
          <FieldError message={form.formState.errors.description?.message} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="priority"
            render={({ field, fieldState }) => (
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={Boolean(fieldState.error)}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityValues.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {formatPriority(priority)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />

          <Controller
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={Boolean(fieldState.error)}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusValues.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="assignedToId"
            render={({ field, fieldState }) => (
              <div className="grid gap-2">
                <Label>Assignee</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={Boolean(fieldState.error)}>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />

          <Controller
            control={form.control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={Boolean(fieldState.error)}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-between">
          <Button asChild type="button" variant="outline">
            <Link href="/tickets">
              <ArrowLeft className="size-4" />
              Back to tickets
            </Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            <Save className="size-4" />
            {isPending
              ? "Saving..."
              : mode === "create"
                ? "Create ticket"
                : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

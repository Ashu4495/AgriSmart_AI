"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FieldConditionCardProps<T extends string | number = string | number> {
  icon: ReactNode;
  iconBg?: string;
  label: string;
  value: string;
  options: { label: string; value: T }[];
  onSelect: (value: T) => void;
}

export function FieldConditionCard<
  T extends string | number = string | number,
>({
  icon,
  iconBg = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  label,
  value,
  options,
  onSelect,
}: FieldConditionCardProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group relative flex w-full items-center justify-between gap-3 rounded-xl border border-border/80 bg-card p-3.5 text-left shadow-xs transition-all hover:border-emerald-500/50 hover:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base shadow-2xs transition-transform group-hover:scale-105",
                iconBg,
              )}
            >
              {icon}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground truncate">
                {label}
              </p>
              <p className="text-sm font-bold text-foreground truncate">
                {value}
              </p>
            </div>
          </div>

          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180 text-emerald-600",
            )}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="max-h-60 w-52 overflow-y-auto rounded-xl border p-1 shadow-lg"
      >
        {options.map((opt) => (
          <DropdownMenuItem
            key={String(opt.value)}
            onClick={() => onSelect(opt.value)}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer"
          >
            <span>{opt.label}</span>
            {String(value).includes(String(opt.label)) ||
            String(value) === String(opt.value) ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

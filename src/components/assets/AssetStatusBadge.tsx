import React from "react";
import { AssetStatus } from "@/types";

interface AssetStatusBadgeProps {
  status: AssetStatus;
  size?: "sm" | "md";
}

export function AssetStatusBadge({ status, size = "md" }: AssetStatusBadgeProps) {
  const getBadgeStyle = () => {
    switch (status) {
      case "Available":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
      case "Allocated":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";
      case "Reserved":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20";
      case "Under Maintenance":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
      case "Lost":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20";
      case "Retired":
        return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
      case "Disposed":
        return "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const px = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide capitalize ${px} ${getBadgeStyle()}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}


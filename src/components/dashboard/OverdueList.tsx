import React from "react";
import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import { Allocation } from "@/types";

interface OverdueListProps {
  allocations: Allocation[];
}

export function OverdueList({ allocations }: OverdueListProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const overdues = allocations.filter(
    (a) => a.status === "overdue" || (a.status === "active" && a.expectedReturnDate < todayStr)
  );

  if (overdues.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
        No overdue asset returns at this time.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {overdues.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
            <div>
              <p className="font-bold text-foreground">
                <Link href={`/assets/${item.assetId}`} className="hover:underline">
                  {item.assetName}
                </Link>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Held by {item.employeeName} ({item.departmentName})
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-destructive">
              Due: {item.expectedReturnDate}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}


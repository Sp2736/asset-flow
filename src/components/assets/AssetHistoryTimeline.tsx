"use client";

import React from "react";
import { ArrowRightLeft, Wrench, ClipboardCheck } from "lucide-react";
import { Allocation, MaintenanceRequest, AuditVerification } from "@/types";

interface AssetHistoryTimelineProps {
  allocations: Allocation[];
  maintenance: MaintenanceRequest[];
  audits: AuditVerification[];
}

export function AssetHistoryTimeline({
  allocations,
  maintenance,
  audits,
}: AssetHistoryTimelineProps) {
  const events = [
    ...allocations.map((a) => ({
      date: a.allocatedAt,
      title: `Allocated to ${a.employeeName}`,
      description: `Assigned in ${a.departmentName}. Expected return: ${a.expectedReturnDate}. Status: ${a.status.toUpperCase()}`,
      icon: ArrowRightLeft,
      color: "text-blue-500",
    })),
    ...maintenance.map((m) => ({
      date: m.createdAt,
      title: `Maintenance Ticket (${m.status})`,
      description: `${m.issueDescription} Reported by ${m.reportedByEmployeeName}. Priority: ${m.priority}`,
      icon: Wrench,
      color: "text-amber-500",
    })),
    ...audits.map((v) => ({
      date: v.verifiedAt.split("T")[0],
      title: `Audit Verification: ${v.status}`,
      description: v.notes || `Asset scanned and marked as ${v.status} during scoped cycle.`,
      icon: ClipboardCheck,
      color: v.status === "Verified" ? "text-emerald-500" : "text-rose-500",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (events.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-muted-foreground">
        No historical custody handoffs recorded for this asset yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 border-l-2 border-border/80">
      {events.map((evt, idx) => {
        const Icon = evt.icon;
        return (
          <div key={idx} className="relative group">
            <div className={`absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-card border-2 border-border ${evt.color}`}>
              <Icon className="h-3 w-3" />
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground">
                  {evt.title}
                </h4>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {evt.date}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {evt.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}


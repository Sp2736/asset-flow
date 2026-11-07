"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ArrowRightLeft,
  Wrench,
  ClipboardCheck,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { Button } from "@/components/ui/button";
import { AssetHistoryTimeline } from "./AssetHistoryTimeline";

export function AssetHistoryClient({ assetId }: { assetId: string }) {
  const { assets, allocations, maintenance, auditVerifications } = useMockDatabase();

  const asset = assets.find((a) => a.id === assetId) || assets[0];
  const assetAllocations = allocations.filter((a) => a.assetId === asset.id);
  const assetMaintenance = maintenance.filter((m) => m.assetId === asset.id);
  const assetAudits = auditVerifications.filter((v) => v.assetId === asset.id);

  // Combine into timeline
  const events = [
    ...assetAllocations.map((a) => ({
      type: "allocation",
      date: a.allocatedAt,
      title: `Allocated to ${a.employeeName}`,
      description: `Assigned in ${a.departmentName}. Expected return: ${a.expectedReturnDate}. Status: ${a.status.toUpperCase()}`,
      icon: ArrowRightLeft,
      color: "text-blue-500",
    })),
    ...assetMaintenance.map((m) => ({
      type: "maintenance",
      date: m.createdAt,
      title: `Maintenance Ticket (${m.status})`,
      description: `${m.issueDescription} Reported by ${m.reportedByEmployeeName}. Priority: ${m.priority}`,
      icon: Wrench,
      color: "text-amber-500",
    })),
    ...assetAudits.map((v) => ({
      type: "audit",
      date: v.verifiedAt.split("T")[0],
      title: `Audit Verification: ${v.status}`,
      description: v.notes || `Asset scanned and marked as ${v.status} during scoped cycle.`,
      icon: ClipboardCheck,
      color: v.status === "Verified" ? "text-emerald-500" : "text-rose-500",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
          <Link href={`/assets/${asset.id}`}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Asset Details
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-6">
        <div>
          <span className="font-mono text-xs text-muted-foreground font-semibold">
            {asset.id}
          </span>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Lifecycle & Custody Timeline: {asset.name}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit-grade record of physical allocations, handoffs, repair interventions, and inspection milestones.
          </p>
        </div>

        <AssetHistoryTimeline
          allocations={assetAllocations}
          maintenance={assetMaintenance}
          audits={assetAudits}
        />
      </div>
    </div>
  );
}


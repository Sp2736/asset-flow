"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  Shield,
  Plus,
  Lock,
  Unlock,
  MapPin,
  Building2,
} from "lucide-react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";

export default function AuditsPage() {
  const { auditCycles, auditVerifications, assets } = useMockDatabase();
  const { role, permissions } = useRole();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Physical Audit Cycles & Verification
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Scoped physical inspections, asset barcode verification grids, and discrepancy reconciliation.
          </p>
        </div>
      </div>

      {/* Audit Cycles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {auditCycles.map((cycle) => {
          const isCompleted = cycle.status === "Completed";
          const total = cycle.totalAssetsInScope;
          const verifiedPct = Math.round((cycle.verifiedCount / total) * 100);

          return (
            <div
              key={cycle.id}
              className={`rounded-2xl border p-5 shadow-xs flex flex-col justify-between bg-card transition-all ${
                isCompleted ? "border-border/60 opacity-90" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    {cycle.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isCompleted
                        ? "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20"
                        : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    }`}
                  >
                    {isCompleted ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    {cycle.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {cycle.name}
                  </h3>
                  <div className="space-y-0.5 mt-1.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      <span>{cycle.scopeLocation}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span>{cycle.scopeDepartmentName || "Organization-wide"}</span>
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pt-2 space-y-1.5 border-t border-border/60">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-foreground">
                      Verification Progress
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {cycle.verifiedCount} / {total} Assets ({verifiedPct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${(cycle.verifiedCount / total) * 100}%` }}
                    />
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${(cycle.damagedCount / total) * 100}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full"
                      style={{ width: `${(cycle.missingCount / total) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                    <span className="text-emerald-600 font-semibold">{cycle.verifiedCount} Verified</span>
                    <span className="text-amber-600 font-semibold">{cycle.damagedCount} Damaged</span>
                    <span className="text-rose-600 font-semibold">{cycle.missingCount} Missing</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground font-mono">
                  Auditor: {cycle.assignedAuditorName.split(" ")[0]}
                </span>

                <Button asChild size="sm" variant={isCompleted ? "outline" : "default"} className="text-xs h-7">
                  <Link href={`/audits/${cycle.id}`} className="gap-1">
                    <span>{isCompleted ? "View Report" : "Inspect Grid"}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

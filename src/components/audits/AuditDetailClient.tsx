"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lock,
  Unlock,
} from "lucide-react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { AuditorVerificationGrid } from "./AuditorVerificationGrid";
import { toast } from "sonner";

export function AuditDetailClient({ auditId }: { auditId: string }) {
  const { auditCycles, auditVerifications, assets, verifyAuditAsset, closeAuditCycle } = useMockDatabase();
  const { permissions } = useRole();

  const cycle = auditCycles.find((c) => c.id === auditId) || auditCycles[0];
  const isLocked = cycle.status === "Completed";

  // Assets in scope (match by department or location)
  const scopedAssets = assets.filter((a) => {
    if (cycle.scopeDepartmentId && a.departmentId === cycle.scopeDepartmentId) return true;
    if (cycle.scopeLocation && a.location.toLowerCase().includes(cycle.scopeLocation.toLowerCase().split(" ")[0])) return true;
    return false;
  }).slice(0, 12);

  const getVerificationStatus = (assetId: string): "Verified" | "Missing" | "Damaged" | "Pending" => {
    const v = auditVerifications.find((item) => item.auditCycleId === cycle.id && item.assetId === assetId);
    return v ? v.status : "Pending";
  };

  const handleSetStatus = (assetId: string, status: "Verified" | "Missing" | "Damaged") => {
    if (isLocked) {
      toast.error("This audit cycle is finalized and locked against edits.");
      return;
    }
    verifyAuditAsset(cycle.id, assetId, status);
    toast.success(`Asset marked as ${status}`);
  };

  const handleCloseCycle = () => {
    if (isLocked) return;
    const success = closeAuditCycle(cycle.id);
    if (success) {
      toast.success("Audit Cycle Finalized & Locked!", {
        description: `Discrepancies reconciled. ${cycle.missingCount} missing units updated to status "Lost".`,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
          <Link href="/audits">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Audits List
          </Link>
        </Button>

        {!isLocked && permissions.canCloseAudits && (
          <Button
            size="sm"
            onClick={handleCloseCycle}
            className="text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5 shadow-xs"
          >
            <Lock className="h-3.5 w-3.5" />
            Finalize & Lock Cycle
          </Button>
        )}
      </div>

      {/* Audit Header Card */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                {cycle.id}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  isLocked
                    ? "bg-slate-500/10 text-slate-600 border border-slate-500/20"
                    : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                }`}
              >
                {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                {cycle.status}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
              {cycle.name}
            </h1>
            <p className="text-xs text-muted-foreground">
              Scope: {cycle.scopeLocation} • Assigned Auditor: {cycle.assignedAuditorName}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs">
            <p className="font-semibold text-foreground">Audit Window</p>
            <p className="text-muted-foreground font-mono">{cycle.startDate} to {cycle.endDate}</p>
          </div>
        </div>

        {/* Tally Metrics */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border text-center">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
            <p className="text-xl font-black text-emerald-600 font-mono">{cycle.verifiedCount}</p>
            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Verified Units</p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
            <p className="text-xl font-black text-amber-600 font-mono">{cycle.damagedCount}</p>
            <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">Damaged Units</p>
          </div>
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3">
            <p className="text-xl font-black text-rose-600 font-mono">{cycle.missingCount}</p>
            <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-300">Missing Units</p>
          </div>
        </div>
      </div>

      {/* Auditor Verification Grid */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              Physical Asset Verification Grid ({scopedAssets.length} In Scope)
            </h3>
          </div>
          {isLocked ? (
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
              <Lock className="h-3.5 w-3.5" /> Read-Only Record
            </span>
          ) : (
            <span className="text-xs text-primary font-semibold">
              Click status to verify asset
            </span>
          )}
        </div>

        <AuditorVerificationGrid
          assets={scopedAssets}
          verifications={auditVerifications.filter((v) => v.auditCycleId === cycle.id)}
          isLocked={isLocked}
          onSetStatus={handleSetStatus}
        />
      </div>
    </div>
  );
}


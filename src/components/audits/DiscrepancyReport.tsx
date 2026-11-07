"use client";

import React from "react";
import { AuditVerification } from "@/types";
import { AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";

interface DiscrepancyReportProps {
  verifications: AuditVerification[];
  auditName: string;
}

export function DiscrepancyReport({ verifications, auditName }: DiscrepancyReportProps) {
  const missing = verifications.filter((v) => v.status === "Missing");
  const damaged = verifications.filter((v) => v.status === "Damaged");

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-xs">
      <div>
        <h3 className="text-sm font-bold text-foreground">
          Audit Discrepancy & Variance Report: {auditName}
        </h3>
        <p className="text-xs text-muted-foreground">
          Summary of unverified, missing, or compromised assets requiring management reconciliation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Missing Section */}
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold">
            <XCircle className="h-4 w-4" />
            <span>Missing Physical Units ({missing.length})</span>
          </div>
          {missing.length === 0 ? (
            <p className="text-muted-foreground italic">No missing assets logged.</p>
          ) : (
            <ul className="space-y-1.5 divide-y divide-rose-500/20">
              {missing.map((m) => (
                <li key={m.id} className="pt-1.5 flex justify-between">
                  <span className="font-semibold text-foreground">{m.assetName}</span>
                  <span className="font-mono text-muted-foreground">{m.assetId}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Damaged Section */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold">
            <AlertTriangle className="h-4 w-4" />
            <span>Damaged Equipment ({damaged.length})</span>
          </div>
          {damaged.length === 0 ? (
            <p className="text-muted-foreground italic">No damaged assets logged.</p>
          ) : (
            <ul className="space-y-1.5 divide-y divide-amber-500/20">
              {damaged.map((d) => (
                <li key={d.id} className="pt-1.5 flex justify-between">
                  <span className="font-semibold text-foreground">{d.assetName}</span>
                  <span className="font-mono text-muted-foreground">{d.assetId}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}


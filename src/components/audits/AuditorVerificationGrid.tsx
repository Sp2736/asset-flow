"use client";

import React from "react";
import { Asset, AuditVerification } from "@/types";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface AuditorVerificationGridProps {
  assets: Asset[];
  verifications: AuditVerification[];
  isLocked: boolean;
  onSetStatus: (assetId: string, status: "Verified" | "Missing" | "Damaged") => void;
}

export function AuditorVerificationGrid({
  assets,
  verifications,
  isLocked,
  onSetStatus,
}: AuditorVerificationGridProps) {
  const getStatus = (assetId: string) => {
    const v = verifications.find((item) => item.assetId === assetId);
    return v ? v.status : "Pending";
  };

  return (
    <div className="divide-y divide-border/60">
      {assets.map((asset) => {
        const currentStatus = getStatus(asset.id);

        return (
          <div
            key={asset.id}
            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-muted-foreground font-semibold">
                  {asset.id}
                </span>
                <span className="font-bold text-foreground">
                  {asset.name}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Location: {asset.location} • Holder: {asset.assignedToEmployeeName || "Storage"}
              </p>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <button
                disabled={isLocked}
                onClick={() => onSetStatus(asset.id, "Verified")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  currentStatus === "Verified"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </button>

              <button
                disabled={isLocked}
                onClick={() => onSetStatus(asset.id, "Damaged")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  currentStatus === "Damaged"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Damaged
              </button>

              <button
                disabled={isLocked}
                onClick={() => onSetStatus(asset.id, "Missing")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  currentStatus === "Missing"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <XCircle className="h-3.5 w-3.5" />
                Missing
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}


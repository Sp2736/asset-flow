"use client";

import React, { useState } from "react";
import { ShieldAlert, Send } from "lucide-react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { Button } from "@/components/ui/button";

interface ConflictDialogProps {
  conflict: {
    assetId: string;
    assetName: string;
    heldBy: string;
    holderEmpId?: string;
  };
  onDismiss: () => void;
  onRequestTransfer: (toEmpId: string, reason: string) => void;
}

export function ConflictDialog({
  conflict,
  onDismiss,
  onRequestTransfer,
}: ConflictDialogProps) {
  const { employees } = useMockDatabase();
  const [targetEmpId, setTargetEmpId] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmpId || !reason) return;
    onRequestTransfer(targetEmpId, reason);
  };

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-3">
      <div className="flex items-start gap-2.5 text-amber-800 dark:text-amber-300">
        <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold">
            Double-Allocation Conflict Detected
          </h4>
          <p className="text-xs mt-1 leading-relaxed">
            <strong>{conflict.assetName}</strong> is already allocated and held by{" "}
            <span className="font-bold underline">{conflict.heldBy}</span>. An asset cannot be allocated twice.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="pt-2 border-t border-amber-500/20 space-y-2 text-xs">
        <p className="font-semibold text-foreground">
          Initiate a Transfer Request to re-assign this asset:
        </p>
        <div>
          <label className="text-muted-foreground block mb-1">
            Recipient Employee:
          </label>
          <select
            required
            value={targetEmpId}
            onChange={(e) => setTargetEmpId(e.target.value)}
            className="w-full rounded-lg border border-input bg-background p-2 text-xs text-foreground"
          >
            <option value="">Select recipient...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.fullName} ({emp.departmentName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-muted-foreground block mb-1">
            Business Reason for Transfer:
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Cross-functional assignment to UI design sprint"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border border-input bg-background p-2 text-xs text-foreground"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDismiss}
            className="text-xs"
          >
            Choose Different Asset
          </Button>
          <Button
            type="submit"
            size="sm"
            className="text-xs bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            Submit Transfer Request
          </Button>
        </div>
      </form>
    </div>
  );
}


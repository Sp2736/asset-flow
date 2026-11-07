"use client";

import React from "react";
import { TransferRequest } from "@/types";
import { Button } from "@/components/ui/button";

interface TransferRequestCardProps {
  transfer: TransferRequest;
  onApprove?: (id: string) => void;
  canApprove?: boolean;
}

export function TransferRequestCard({
  transfer,
  onApprove,
  canApprove = false,
}: TransferRequestCardProps) {
  return (
    <div className="rounded-xl border border-border p-4 bg-card space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-mono text-muted-foreground font-semibold">
          {transfer.id}
        </span>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
            transfer.status === "requested"
              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
              : transfer.status === "approved"
              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {transfer.status}
        </span>
      </div>

      <h4 className="font-bold text-foreground text-sm">
        {transfer.assetName}
      </h4>

      <div className="space-y-0.5 text-muted-foreground">
        <p>From: <span className="text-foreground font-medium">{transfer.fromEmployeeName}</span></p>
        <p>To: <span className="text-foreground font-medium">{transfer.toEmployeeName}</span></p>
        <p className="pt-1 italic">"{transfer.reason}"</p>
      </div>

      {transfer.status === "requested" && canApprove && onApprove && (
        <div className="pt-2 border-t border-border flex justify-end">
          <Button
            size="sm"
            onClick={() => onApprove(transfer.id)}
            className="text-[11px] h-7 bg-primary text-primary-foreground"
          >
            Approve Transfer
          </Button>
        </div>
      )}
    </div>
  );
}


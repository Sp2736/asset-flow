"use client";

import React from "react";
import { MaintenanceRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface MaintenanceWorkflowBoardProps {
  tickets: MaintenanceRequest[];
  onApproveTicket?: (id: string, assetName: string) => void;
  onStartTicket?: (id: string) => void;
  onOpenResolveModal?: (ticket: MaintenanceRequest) => void;
  canApprove?: boolean;
}

export function MaintenanceWorkflowBoard({
  tickets,
  onApproveTicket,
  onStartTicket,
  onOpenResolveModal,
  canApprove = false,
}: MaintenanceWorkflowBoardProps) {
  const pending = tickets.filter((t) => t.status === "Pending");
  const approved = tickets.filter((t) => t.status === "Approved");
  const inProgress = tickets.filter((t) => t.status === "In Progress");
  const resolved = tickets.filter((t) => t.status === "Resolved");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {/* 1. Pending */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            1. Pending ({pending.length})
          </span>
          <span className="text-[10px] text-muted-foreground">Triage</span>
        </div>

        <div className="space-y-3 min-h-[200px]">
          {pending.length === 0 ? (
            <p className="text-xs text-muted-foreground/60 italic text-center py-6">No pending tickets</p>
          ) : (
            pending.map((t) => (
              <div key={t.id} className="rounded-xl border border-amber-500/30 bg-muted/20 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground text-[10px]">{t.id}</span>
                  <span className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {t.priority}
                  </span>
                </div>
                <h4 className="font-bold text-foreground">{t.assetName}</h4>
                <p className="text-muted-foreground text-[11px] leading-relaxed">{t.issueDescription}</p>
                {canApprove && onApproveTicket && (
                  <Button
                    size="sm"
                    onClick={() => onApproveTicket(t.id, t.assetName)}
                    className="w-full text-xs h-7 bg-amber-600 hover:bg-amber-700 text-white mt-1"
                  >
                    Approve Ticket
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Approved */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            2. Approved ({approved.length})
          </span>
          <span className="text-[10px] text-muted-foreground">Queued</span>
        </div>

        <div className="space-y-3 min-h-[200px]">
          {approved.length === 0 ? (
            <p className="text-xs text-muted-foreground/60 italic text-center py-6">No queued tickets</p>
          ) : (
            approved.map((t) => (
              <div key={t.id} className="rounded-xl border border-blue-500/30 bg-muted/20 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground text-[10px]">{t.id}</span>
                  <span className="bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {t.priority}
                  </span>
                </div>
                <h4 className="font-bold text-foreground">{t.assetName}</h4>
                <p className="text-muted-foreground text-[11px] leading-relaxed">{t.issueDescription}</p>
                {onStartTicket && (
                  <Button
                    size="sm"
                    onClick={() => onStartTicket(t.id)}
                    className="w-full text-xs h-7 bg-blue-600 hover:bg-blue-700 text-white mt-1"
                  >
                    Assign Tech & Start
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. In Progress */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            3. In Progress ({inProgress.length})
          </span>
          <span className="text-[10px] text-muted-foreground">Repairs Active</span>
        </div>

        <div className="space-y-3 min-h-[200px]">
          {inProgress.length === 0 ? (
            <p className="text-xs text-muted-foreground/60 italic text-center py-6">No active repairs</p>
          ) : (
            inProgress.map((t) => (
              <div key={t.id} className="rounded-xl border border-purple-500/30 bg-muted/20 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground text-[10px]">{t.id}</span>
                  <span className="bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    In Repair
                  </span>
                </div>
                <h4 className="font-bold text-foreground">{t.assetName}</h4>
                <p className="text-muted-foreground text-[11px] leading-relaxed">{t.issueDescription}</p>
                {onOpenResolveModal && (
                  <Button
                    size="sm"
                    onClick={() => onOpenResolveModal(t)}
                    className="w-full text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white mt-1"
                  >
                    Resolve & Return
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. Resolved */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            4. Resolved ({resolved.length})
          </span>
          <span className="text-[10px] text-muted-foreground">Available</span>
        </div>

        <div className="space-y-3 min-h-[200px]">
          {resolved.length === 0 ? (
            <p className="text-xs text-muted-foreground/60 italic text-center py-6">No closed tickets</p>
          ) : (
            resolved.map((t) => (
              <div key={t.id} className="rounded-xl border border-emerald-500/30 bg-muted/20 p-3.5 space-y-2 text-xs opacity-90">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground text-[10px]">{t.id}</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                    <CheckCircle2 className="h-3 w-3" />
                    Closed
                  </span>
                </div>
                <h4 className="font-bold text-foreground">{t.assetName}</h4>
                <div className="text-[10px] text-muted-foreground flex items-center justify-between pt-1 border-t border-border/50">
                  <span>Cost: ${t.actualCost || 0}</span>
                  <span>{t.resolvedAt}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


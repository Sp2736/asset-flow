"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  ShieldCheck,
  DollarSign,
  ChevronRight,
  Info,
  X,
} from "lucide-react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { useRole } from "@/hooks/useRole";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { MaintenanceWorkflowBoard } from "@/components/maintenance/MaintenanceWorkflowBoard";
import { MaintenanceRequest } from "@/types";
import { toast } from "sonner";

export default function MaintenancePage() {
  const {
    maintenance,
    assets,
    createMaintenanceRequest,
    updateMaintenanceStatus,
  } = useMockDatabase();
  const user = useUIStore((state) => state.user);
  const { permissions } = useRole();

  // Create Ticket Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [issueDescription, setIssueDescription] = useState("");

  // Resolve Ticket Modal State
  const [resolveTarget, setResolveTarget] = useState<MaintenanceRequest | null>(null);
  const [technician, setTechnician] = useState("");
  const [actualCost, setActualCost] = useState("150");

  const pendingTickets = maintenance.filter((m) => m.status === "Pending");
  const approvedTickets = maintenance.filter((m) => m.status === "Approved");
  const inProgressTickets = maintenance.filter((m) => m.status === "In Progress");
  const resolvedTickets = maintenance.filter((m) => m.status === "Resolved");

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !issueDescription || !user) {
      toast.error("Please fill out all fields.");
      return;
    }

    const req = createMaintenanceRequest(
      selectedAssetId,
      user.id,
      issueDescription,
      priority
    );

    if (req) {
      toast.success(`Maintenance ticket ${req.id} created!`, {
        description: "Status is Pending until reviewed by an Asset Manager.",
      });
      setCreateModalOpen(false);
      setSelectedAssetId("");
      setIssueDescription("");
    }
  };

  const handleApprove = (reqId: string, assetName: string) => {
    updateMaintenanceStatus(reqId, "Approved");
    toast.success(`Ticket ${reqId} approved!`, {
      description: `${assetName} lifecycle state flipped to "Under Maintenance".`,
    });
  };

  const handleStartWork = (reqId: string) => {
    updateMaintenanceStatus(reqId, "In Progress", "Internal Hardware Lab");
    toast.info(`Ticket ${reqId} moved to In Progress.`);
  };

  const handleConfirmResolve = () => {
    if (!resolveTarget) return;
    updateMaintenanceStatus(
      resolveTarget.id,
      "Resolved",
      technician || resolveTarget.technician || "Certified Depot",
      parseFloat(actualCost) || 0
    );
    toast.success(`Ticket ${resolveTarget.id} Resolved!`, {
      description: `${resolveTarget.assetName} status successfully reverted to "Available".`,
    });
    setResolveTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Maintenance & Repair Lifecycle
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Strict multi-stage workflow: Pending → Approved → In Progress → Resolved.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="gap-2 bg-primary text-primary-foreground text-xs shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Raise Repair Ticket
          </Button>
        </div>
      </div>

      {/* Info Banner on Lifecycle Rule */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground flex items-start gap-2.5">
        <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <span>
          <strong>Domain Rule 5:</strong> A reported asset remains in its active status until the repair ticket is approved by an Asset Manager. Only on approval does the asset flip to <em>Under Maintenance</em>. Upon ticket resolution, the asset automatically reverts to <em>Available</em>.
        </span>
      </div>

      {/* Kanban Board Layout */}
      <MaintenanceWorkflowBoard
        tickets={maintenance}
        onApproveTicket={handleApprove}
        onStartTicket={handleStartWork}
        onOpenResolveModal={(ticket) => {
          setResolveTarget(ticket);
          setTechnician(ticket.technician || "Certified Tech");
        }}
        canApprove={permissions.canApproveMaintenance}
      />

      {/* Raise Ticket Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Raise Maintenance Ticket
                </h3>
                <p className="text-xs text-muted-foreground">
                  Report hardware malfunction, battery wear, or physical damage
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Target Asset <span className="text-destructive">*</span>
                </label>
                <select
                  required
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
                >
                  <option value="">Select asset to service...</option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.id}) [{asset.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Urgency / Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
                >
                  <option value="low">Low (Cosmetic / Periodic Check)</option>
                  <option value="medium">Medium (Degraded Performance)</option>
                  <option value="high">High (Prevents Core Work)</option>
                  <option value="urgent">Urgent (Safety / Battery Swelling / Critical)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Issue Description & Diagnostic Symptoms <span className="text-destructive">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Screen flickering when connected to external monitor; internal fan rattle during rendering."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-primary text-primary-foreground"
                >
                  Submit Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Ticket Modal */}
      {resolveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Finalize Repair & Return to Available
                </h3>
                <p className="text-xs text-muted-foreground">
                  {resolveTarget.assetName} ({resolveTarget.id})
                </p>
              </div>
              <button
                onClick={() => setResolveTarget(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Servicing Technician / Vendor
                </label>
                <input
                  type="text"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  placeholder="e.g. Dell Certified Repair Depot"
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Actual Repair Cost ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  value={actualCost}
                  onChange={(e) => setActualCost(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground font-mono outline-none focus:border-primary"
                />
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-[11px] text-emerald-800 dark:text-emerald-300">
                Resolving this ticket automatically resets the physical asset's lifecycle status to <strong>Available</strong> for future allocations.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResolveTarget(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmResolve}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Mark Resolved & Revert Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

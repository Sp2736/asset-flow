"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRightLeft,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  UserCheck,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Send,
  X,
} from "lucide-react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { useRole } from "@/hooks/useRole";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { ConflictDialog } from "@/components/allocations/ConflictDialog";
import { TransferRequestCard } from "@/components/allocations/TransferRequestCard";
import { toast } from "sonner";

export default function AllocationsPage() {
  const {
    allocations,
    assets,
    employees,
    transfers,
    allocateAsset,
    returnAsset,
    requestTransfer,
    approveTransfer,
  } = useMockDatabase();
  const user = useUIStore((state) => state.user);
  const { permissions } = useRole();

  const [activeTab, setActiveTab] = useState<"allocations" | "transfers">("allocations");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Allocation Modal State
  const [allocModalOpen, setAllocModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState(
    new Date(Date.now() + 180 * 86400000).toISOString().split("T")[0]
  );
  const [allocNotes, setAllocNotes] = useState("");

  // Conflict / Transfer Prompt State
  const [conflictPrompt, setConflictPrompt] = useState<{
    assetId: string;
    assetName: string;
    heldBy: string;
    holderEmpId?: string;
  } | null>(null);
  const [transferReason, setTransferReason] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const filteredAllocations = allocations.filter((a) => {
    const isOverdue = a.status === "overdue" || (a.status === "active" && a.expectedReturnDate < todayStr);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "overdue" ? isOverdue : a.status === statusFilter);

    const matchesSearch =
      a.assetName.toLowerCase().includes(search.toLowerCase()) ||
      a.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      a.assetId.toLowerCase().includes(search.toLowerCase()) ||
      a.departmentName.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Handle Asset selection in New Allocation modal
  const handleAssetSelect = (assetId: string) => {
    setSelectedAssetId(assetId);
    const asset = assets.find((a) => a.id === assetId);

    // Rule 3: No double allocation! If currently held by someone, trigger conflict workflow
    if (asset && asset.status === "Allocated") {
      setConflictPrompt({
        assetId: asset.id,
        assetName: asset.name,
        heldBy: asset.assignedToEmployeeName || "Another Employee",
        holderEmpId: asset.assignedToEmployeeId || undefined,
      });
    } else {
      setConflictPrompt(null);
    }
  };

  const handleCreateAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !selectedEmpId || !expectedReturnDate) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const res = allocateAsset(selectedAssetId, selectedEmpId, expectedReturnDate, allocNotes);
    if (!res.success) {
      toast.error(res.error || "Allocation failed.");
      return;
    }

    toast.success("Asset allocated successfully!", {
      description: `Assigned to ${res.allocation?.employeeName}`,
    });
    setAllocModalOpen(false);
    setSelectedAssetId("");
    setSelectedEmpId("");
    setConflictPrompt(null);
  };

  const handleCreateTransferRequest = () => {
    if (!conflictPrompt || !selectedEmpId || !transferReason) {
      toast.error("Please select the recipient employee and specify a reason.");
      return;
    }

    const targetEmp = employees.find((e) => e.fullName === conflictPrompt.heldBy);
    const fromEmpId = targetEmp?.id || conflictPrompt.holderEmpId || employees[0].id;

    requestTransfer(conflictPrompt.assetId, fromEmpId, selectedEmpId, transferReason);
    toast.success("Transfer Request submitted!", {
      description: `Waiting for Department Head or Asset Manager authorization.`,
    });

    setConflictPrompt(null);
    setAllocModalOpen(false);
    setActiveTab("transfers");
  };

  const handleReturnAsset = (allocId: string, assetName: string) => {
    const success = returnAsset(allocId);
    if (success) {
      toast.success(`${assetName} returned to storage.`, {
        description: "Status successfully reverted to Available.",
      });
    }
  };

  const handleApproveTransfer = (transferId: string, assetName: string) => {
    const success = approveTransfer(transferId);
    if (success) {
      toast.success(`Transfer of ${assetName} approved and re-allocated!`, {
        description: "Historical custody ledger updated automatically.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Allocations & Custody Transfers
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage equipment assignments, return schedules, and inter-employee hardware transfers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {permissions.canAllocateAssets && (
            <Button
              onClick={() => setAllocModalOpen(true)}
              className="gap-2 bg-primary text-primary-foreground text-xs shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Allocate Asset
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("allocations")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "allocations"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Active Allocations ({allocations.filter((a) => a.status === "active" || a.status === "overdue").length})
        </button>
        <button
          onClick={() => setActiveTab("transfers")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "transfers"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Transfer Workflow</span>
          {transfers.filter((t) => t.status === "requested").length > 0 && (
            <span className="rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold px-1.5 py-0.2">
              {transfers.filter((t) => t.status === "requested").length} pending
            </span>
          )}
        </button>
      </div>

      {activeTab === "allocations" ? (
        <>
          {/* Filter Bar */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search allocations by asset, employee, or dept..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder-muted-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-input bg-background py-2 px-3 text-xs text-foreground outline-none focus:border-primary"
              >
                <option value="all">All States</option>
                <option value="active">Active Only</option>
                <option value="overdue">Overdue Only</option>
                <option value="returned">Returned</option>
                <option value="transferred">Transferred</option>
              </select>
            </div>
          </div>

          {/* Allocations Table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Allocation ID</th>
                    <th className="py-3 px-4">Asset</th>
                    <th className="py-3 px-4">Assigned Employee</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Allocated Date</th>
                    <th className="py-3 px-4">Expected Return</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredAllocations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-muted-foreground">
                        No allocation records found.
                      </td>
                    </tr>
                  ) : (
                    filteredAllocations.map((alloc) => {
                      const isOverdue =
                        alloc.status === "overdue" ||
                        (alloc.status === "active" && alloc.expectedReturnDate < todayStr);

                      return (
                        <tr key={alloc.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-semibold text-foreground">
                            {alloc.id}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-foreground">
                              <Link href={`/assets/${alloc.assetId}`} className="hover:text-primary hover:underline">
                                {alloc.assetName}
                              </Link>
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono">
                              {alloc.assetId}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-foreground">
                            {alloc.employeeName}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {alloc.departmentName}
                          </td>
                          <td className="py-3 px-4 font-mono text-muted-foreground">
                            {alloc.allocatedAt}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <span className={isOverdue ? "text-destructive font-bold flex items-center gap-1" : "text-muted-foreground"}>
                              {isOverdue && <AlertTriangle className="h-3 w-3 shrink-0" />}
                              {alloc.expectedReturnDate}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                isOverdue
                                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                                  : alloc.status === "active"
                                  ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                  : alloc.status === "transferred"
                                  ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {isOverdue ? "Overdue" : alloc.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {alloc.status === "active" || alloc.status === "overdue" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReturnAsset(alloc.id, alloc.assetName)}
                                className="text-[11px] h-7 px-2.5 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/30"
                              >
                                Return Asset
                              </Button>
                            ) : (
                              <span className="text-[11px] text-muted-foreground italic">
                                {alloc.actualReturnDate ? `Closed ${alloc.actualReturnDate}` : "Completed"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Transfers Workflow Tab */
        <div className="space-y-6">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
            <p>
              <strong>Domain Transfer Rule:</strong> When an asset is already allocated, AssetFlow offers a peer-to-peer <strong>Transfer Request</strong> workflow. Once approved by an authorized manager, custody is re-allocated and historical custody is updated.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Transfer ID</th>
                    <th className="py-3 px-4">Asset</th>
                    <th className="py-3 px-4">Current Holder</th>
                    <th className="py-3 px-4">Requested Recipient</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {transfers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        No transfer requests active.
                      </td>
                    </tr>
                  ) : (
                    transfers.map((trf) => (
                      <tr key={trf.id} className="hover:bg-muted/30">
                        <td className="py-3 px-4 font-mono font-semibold text-foreground">
                          {trf.id}
                        </td>
                        <td className="py-3 px-4 font-bold text-foreground">
                          {trf.assetName}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {trf.fromEmployeeName}
                        </td>
                        <td className="py-3 px-4 font-semibold text-foreground">
                          {trf.toEmployeeName}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">
                          {trf.reason}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                              trf.status === "requested"
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                : trf.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {trf.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {trf.status === "requested" ? (
                            permissions.canApproveTransfers ? (
                              <Button
                                size="sm"
                                onClick={() => handleApproveTransfer(trf.id, trf.assetName)}
                                className="text-[11px] h-7 bg-primary text-primary-foreground hover:bg-primary/90"
                              >
                                Approve Transfer
                              </Button>
                            ) : (
                              <span className="text-[11px] text-muted-foreground italic">
                                Pending Manager Review
                              </span>
                            )
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-semibold">
                              Transfer Finalized
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Allocate Modal (with Double Allocation conflict handling!) */}
      {allocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Allocate Equipment to Employee
                </h3>
                <p className="text-xs text-muted-foreground">
                  Enforces single-allocation rules and return schedules
                </p>
              </div>
              <button
                onClick={() => {
                  setAllocModalOpen(false);
                  setConflictPrompt(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* If conflict prompt is active (Rule 3) */}
            {conflictPrompt ? (
              <ConflictDialog
                conflict={conflictPrompt}
                onDismiss={() => setConflictPrompt(null)}
                onRequestTransfer={(toEmpId, reason) => {
                  const targetEmp = employees.find((e) => e.id === toEmpId);
                  const fromEmpId = conflictPrompt.holderEmpId || employees[0].id;
                  requestTransfer(conflictPrompt.assetId, fromEmpId, toEmpId, reason);
                  toast.success("Transfer Request submitted!", {
                    description: `Waiting for Department Head or Asset Manager authorization.`,
                  });
                  setConflictPrompt(null);
                  setAllocModalOpen(false);
                  setActiveTab("transfers");
                }}
              />
            ) : (
              <form onSubmit={handleCreateAllocation} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Select Physical Asset <span className="text-destructive">*</span>
                  </label>
                  <select
                    required
                    value={selectedAssetId}
                    onChange={(e) => handleAssetSelect(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="">Choose an asset...</option>
                    {assets.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name} ({asset.id}) — [{asset.status}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Assignee Employee <span className="text-destructive">*</span>
                  </label>
                  <select
                    required
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="">Choose employee...</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName} • {emp.designation} ({emp.departmentName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Expected Return Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Allocation Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Assigned with laptop bag, charger, and security badge."
                    value={allocNotes}
                    onChange={(e) => setAllocNotes(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAllocModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="text-xs bg-primary text-primary-foreground"
                  >
                    Confirm Allocation
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

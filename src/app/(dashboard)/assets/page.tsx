"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Laptop,
  Search,
  Filter,
  Plus,
  ArrowRightLeft,
  Wrench,
  Eye,
  SlidersHorizontal,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { useRole } from "@/hooks/useRole";
import { AssetStatusBadge } from "@/components/assets/AssetStatusBadge";
import { AssetTable } from "@/components/assets/AssetTable";
import { Button } from "@/components/ui/button";
import { Asset, AssetStatus } from "@/types";
import { toast } from "sonner";

export default function AssetsPage() {
  const { assets, departments, categories, updateAssetStatus } = useMockDatabase();
  const { permissions } = useRole();

  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Status Change Dialog State
  const [statusTargetAsset, setStatusTargetAsset] = useState<Asset | null>(null);
  const [newStatus, setNewStatus] = useState<AssetStatus>("Available");
  const [statusNote, setStatusNote] = useState("");

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.model.toLowerCase().includes(search.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      asset.id.toLowerCase().includes(search.toLowerCase()) ||
      asset.location.toLowerCase().includes(search.toLowerCase()) ||
      (asset.assignedToEmployeeName && asset.assignedToEmployeeName.toLowerCase().includes(search.toLowerCase()));

    const matchesDept = selectedDept === "all" || asset.departmentId === selectedDept;
    const matchesCat = selectedCat === "all" || asset.categoryId === selectedCat;
    const matchesStatus = selectedStatus === "all" || asset.status === selectedStatus;

    return matchesSearch && matchesDept && matchesCat && matchesStatus;
  });

  const handleOpenStatusModal = (asset: Asset) => {
    setStatusTargetAsset(asset);
    setNewStatus(asset.status);
    setStatusNote("");
  };

  const handleConfirmStatusChange = () => {
    if (!statusTargetAsset) return;
    updateAssetStatus(statusTargetAsset.id, newStatus, statusNote);
    toast.success(`Updated ${statusTargetAsset.name} status to ${newStatus}`);
    setStatusTargetAsset(null);
  };

  const statusOptions: AssetStatus[] = [
    "Available",
    "Allocated",
    "Reserved",
    "Under Maintenance",
    "Lost",
    "Retired",
    "Disposed",
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Central Asset Ledger
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Complete physical inventory catalog ({assets.length} total units registered)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {permissions.canManageAssets && (
            <Button asChild className="gap-2 bg-primary text-primary-foreground text-xs shadow-xs">
              <Link href="/assets/new">
                <Plus className="h-3.5 w-3.5" />
                Register New Asset
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, model, serial, or holder..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="all">All Departments ({departments.length})</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-input bg-background py-2 px-3 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="all">All Lifecycle States</option>
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px] text-muted-foreground">
          <span>Showing {filteredAssets.length} of {assets.length} assets</span>
          {(search || selectedDept !== "all" || selectedCat !== "all" || selectedStatus !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedDept("all");
                setSelectedCat("all");
                setSelectedStatus("all");
              }}
              className="text-primary hover:underline font-semibold"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Asset Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <AssetTable
          assets={filteredAssets}
          onOpenStatusModal={handleOpenStatusModal}
          canManageAssets={permissions.canManageAssets}
        />
      </div>

      {/* Status Transition Modal */}
      {statusTargetAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Update Lifecycle State
                </h3>
                <p className="text-xs text-muted-foreground">
                  {statusTargetAsset.name} ({statusTargetAsset.id})
                </p>
              </div>
              <button
                onClick={() => setStatusTargetAsset(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Target Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AssetStatus)}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Transition Notes / Audit Reason
                </label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Reason for lifecycle transition..."
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-[11px] text-muted-foreground">
                <p>
                  <strong>Domain Lifecycle Rule:</strong> Changing status to 'Under Maintenance' will sync with the maintenance queue. Changing to 'Available' releases any assigned employee lock.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusTargetAsset(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmStatusChange}
                className="text-xs bg-primary text-primary-foreground"
              >
                Apply Transition
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

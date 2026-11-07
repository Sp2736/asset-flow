"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Laptop,
  Calendar,
  DollarSign,
  Tag,
  Building2,
  MapPin,
  Clock,
  History,
  ArrowRightLeft,
  Wrench,
  CheckCircle2,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { useRole } from "@/hooks/useRole";
import { AssetStatusBadge } from "@/components/assets/AssetStatusBadge";
import { Button } from "@/components/ui/button";

export function AssetDetailClient({ assetId }: { assetId: string }) {
  const { assets, allocations, maintenance, auditVerifications } = useMockDatabase();
  const { permissions } = useRole();

  const asset = assets.find((a) => a.id === assetId) || assets[0];
  const activeAlloc = allocations.find((al) => al.assetId === asset.id && al.status === "active");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
          <Link href="/assets">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Asset Ledger
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
            <Link href={`/assets/${asset.id}/history`}>
              <History className="h-3.5 w-3.5" />
              Audit & Custody History
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Asset Header Card */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">
                {asset.id}
              </span>
              <AssetStatusBadge status={asset.status} />
              {asset.condition && (
                <span className="text-[11px] font-semibold text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                  Condition: {asset.condition}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              {asset.name}
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Model: {asset.model} • Serial: {asset.serialNumber}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Acquisition Value
            </p>
            <p className="text-2xl font-black text-foreground font-mono">
              ${asset.acquisitionCost.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Purchased: {asset.purchaseDate}
            </p>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/60">
            <Building2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <p className="text-muted-foreground font-medium">Department</p>
              <p className="font-bold text-foreground">{asset.departmentName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/60">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <p className="text-muted-foreground font-medium">Physical Location</p>
              <p className="font-bold text-foreground">{asset.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/60">
            <Tag className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <p className="text-muted-foreground font-medium">Category</p>
              <p className="font-bold text-foreground">{asset.categoryName}</p>
            </div>
          </div>
        </div>

        {/* Custody Box */}
        <div className="rounded-xl border border-border p-4 bg-muted/10 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-primary" />
              Current Custody & Allocation
            </h3>
            {activeAlloc && (
              <span className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                Active Assignment
              </span>
            )}
          </div>

          {asset.assignedToEmployeeName ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
              <div>
                <p className="font-bold text-foreground text-sm">
                  {asset.assignedToEmployeeName}
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Employee ID: {asset.assignedToEmployeeId}
                </p>
              </div>

              {activeAlloc && (
                <div className="text-xs text-muted-foreground">
                  <p>Allocated: <span className="font-mono text-foreground">{activeAlloc.allocatedAt}</span></p>
                  <p>Expected Return: <span className="font-mono text-foreground">{activeAlloc.expectedReturnDate}</span></p>
                </div>
              )}

              <Button asChild variant="outline" size="sm" className="text-xs gap-1">
                <Link href="/allocations">
                  <ArrowRightLeft className="h-3 w-3" />
                  Transfer / Return
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-muted-foreground italic">
                This asset is currently in storage and available for assignment.
              </p>
              {permissions.canAllocateAssets && (
                <Button asChild size="sm" className="text-xs bg-primary text-primary-foreground">
                  <Link href="/allocations">Allocate Asset</Link>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Notes */}
        {asset.notes && (
          <div className="rounded-xl border border-border/80 p-4 text-xs space-y-1">
            <p className="font-semibold text-foreground">Asset Notes & Inspection Log</p>
            <p className="text-muted-foreground leading-relaxed">{asset.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}


"use client";

import React from "react";
import Link from "next/link";
import {
  Laptop,
  ArrowRightLeft,
  Wrench,
  AlertTriangle,
  ClipboardCheck,
  TrendingUp,
  Plus,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { useUIStore } from "@/store/uiStore";
import { useRole } from "@/hooks/useRole";
import { AssetStatusBadge } from "@/components/assets/AssetStatusBadge";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { OverdueList } from "@/components/dashboard/OverdueList";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const {
    assets,
    departments,
    allocations,
    maintenance,
    auditCycles,
    notifications,
    transfers,
  } = useMockDatabase();
  const user = useUIStore((state) => state.user);
  const toggleRoleDetails = useUIStore((state) => state.toggleRoleDetails);
  const { role, permissions } = useRole();

  // Compute metrics
  const totalAssets = assets.length;
  const totalValuation = assets.reduce((sum, a) => sum + (a.acquisitionCost || 0), 0);
  const allocatedAssets = assets.filter((a) => a.status === "Allocated").length;
  const maintenanceAssets = assets.filter((a) => a.status === "Under Maintenance").length;
  const todayStr = new Date().toISOString().split("T")[0];
  const overdueAllocations = allocations.filter(
    (a) => a.status === "overdue" || (a.status === "active" && a.expectedReturnDate < todayStr)
  );
  const activeAudits = auditCycles.filter((c) => c.status === "Active").length;
  const pendingMaintenance = maintenance.filter((m) => m.status === "Pending").length;
  const pendingTransfers = transfers.filter((t) => t.status === "requested").length;

  // Personal assets allocated to this user
  const myAllocatedAssets = assets.filter((a) => a.assignedToEmployeeId === user?.id);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-background p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Active Session
              </span>
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary capitalize">
                {role.replace("_", " ")}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              Welcome, {user?.fullName || "Colleague"}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {user?.designation} • {user?.departmentName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRoleDetails}
              className="text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Role Permissions
            </Button>

            {permissions.canManageAssets && (
              <Button asChild size="sm" className="gap-1.5 bg-primary text-primary-foreground text-xs shadow-xs">
                <Link href="/assets/new">
                  <Plus className="h-3.5 w-3.5" />
                  Add Asset
                </Link>
              </Button>
            )}

            {permissions.canAllocateAssets && (
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                <Link href="/allocations">
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  Allocate
                </Link>
              </Button>
            )}

            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
              <Link href="/bookings">
                <Calendar className="h-3.5 w-3.5" />
                Reserve Space
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <KpiCard
          title="Total Assets"
          value={totalAssets}
          subtitle={`$${totalValuation.toLocaleString()} total book value`}
          icon={<Laptop className="h-5 w-5" />}
          highlightColor="bg-primary/10 text-primary"
        />

        <KpiCard
          title="Active Allocations"
          value={allocatedAssets}
          subtitle={`${Math.round((allocatedAssets / totalAssets) * 100)}% utilization rate`}
          icon={<ArrowRightLeft className="h-5 w-5" />}
          highlightColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />

        <KpiCard
          title="Under Maintenance"
          value={maintenanceAssets}
          subtitle={`${pendingMaintenance} pending tickets`}
          icon={<Wrench className="h-5 w-5" />}
          highlightColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />

        <KpiCard
          title="Overdue Returns"
          value={overdueAllocations.length}
          subtitle={`${activeAudits} audit cycles active`}
          icon={<AlertTriangle className="h-5 w-5" />}
          highlightColor="bg-destructive/10 text-destructive"
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Focus: My Allocated Hardware */}
          {myAllocatedAssets.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">
                    My Assigned Equipment ({myAllocatedAssets.length})
                  </h3>
                </div>
                <Link
                  href="/allocations"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Manage custody <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myAllocatedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex flex-col justify-between rounded-xl border border-border/80 p-3.5 bg-muted/20 hover:border-primary/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                          {asset.id}
                        </span>
                        <AssetStatusBadge status={asset.status} size="sm" />
                      </div>
                      <h4 className="text-xs font-bold text-foreground line-clamp-1">
                        {asset.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {asset.model} • {asset.location}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Serial: {asset.serialNumber}</span>
                      <Link
                        href={`/assets/${asset.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Department Breakdown */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Department Asset Distribution
                </h3>
              </div>
              <Link
                href="/organization"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all depts
              </Link>
            </div>

            <div className="space-y-3">
              {departments.map((dept) => {
                const count = assets.filter((a) => a.departmentId === dept.id).length;
                const pct = Math.round((count / totalAssets) * 100);

                return (
                  <div key={dept.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{dept.name}</span>
                      <span className="text-muted-foreground font-mono">
                        {count} assets ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Assets Table Preview */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">
                Recent Inventory Ledger
              </h3>
              <Link
                href="/assets"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Open Full Ledger <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground">
                    <th className="pb-2.5 font-semibold">Asset ID</th>
                    <th className="pb-2.5 font-semibold">Name</th>
                    <th className="pb-2.5 font-semibold">Department</th>
                    <th className="pb-2.5 font-semibold">Status</th>
                    <th className="pb-2.5 font-semibold">Holder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {assets.slice(0, 6).map((asset) => (
                    <tr key={asset.id} className="hover:bg-muted/30">
                      <td className="py-2.5 font-mono text-muted-foreground font-medium">
                        {asset.id}
                      </td>
                      <td className="py-2.5 font-semibold text-foreground">
                        <Link href={`/assets/${asset.id}`} className="hover:text-primary hover:underline">
                          {asset.name}
                        </Link>
                      </td>
                      <td className="py-2.5 text-muted-foreground">
                        {asset.departmentName}
                      </td>
                      <td className="py-2.5">
                        <AssetStatusBadge status={asset.status} size="sm" />
                      </td>
                      <td className="py-2.5 text-muted-foreground">
                        {asset.assignedToEmployeeName || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col) - Activity Feed & Alerts */}
        <div className="space-y-6">
          {/* Action Required Callout */}
          {overdueAllocations.length > 0 && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 space-y-3">
              <div className="flex items-center gap-2 text-destructive font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Overdue Asset Returns</span>
              </div>
              <OverdueList allocations={overdueAllocations} />
            </div>
          )}

          {/* Activity Log Feed */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
                Audit & Activity Feed
              </h3>
              <Link
                href="/notifications"
                className="text-xs font-semibold text-primary hover:underline"
              >
                History
              </Link>
            </div>

            <div className="space-y-4">
              {notifications.slice(0, 6).map((notif) => (
                <div key={notif.id} className="flex gap-3 text-xs">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <p className="font-bold text-foreground">
                      {notif.title}
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-[11px]">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 font-mono">
                      {notif.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

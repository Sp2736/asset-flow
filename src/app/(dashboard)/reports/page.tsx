"use client";

import React from "react";
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  PieChart,
  Wrench,
  Laptop,
  Building2,
  Calendar,
} from "lucide-react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { useRole } from "@/hooks/useRole";

export default function ReportsPage() {
  const { assets, departments, categories, maintenance } = useMockDatabase();
  const { role } = useRole();

  const totalValuation = assets.reduce((sum, a) => sum + (a.acquisitionCost || 0), 0);
  const totalRepairCost = maintenance.reduce((sum, m) => sum + (m.actualCost || m.estimatedCost || 0), 0);

  // Status breakdown
  const statusCounts = assets.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Valuation & Utilization Reports
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Organizational asset valuation, department budget consumption, and maintenance lifecycle analytics.
        </p>
      </div>

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Capital Asset Valuation
          </span>
          <div className="mt-2 text-2xl font-black text-foreground font-mono">
            ${totalValuation.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across {assets.length} registered hardware units
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Cumulative Maintenance Spend
          </span>
          <div className="mt-2 text-2xl font-black text-amber-600 font-mono">
            ${totalRepairCost.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across {maintenance.length} historical service tickets
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Average Asset Cost
          </span>
          <div className="mt-2 text-2xl font-black text-foreground font-mono">
            ${Math.round(totalValuation / assets.length).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Per enrolled inventory asset
          </p>
        </div>
      </div>

      {/* Department Valuation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              Department Capital Value Allocation
            </h3>
          </div>

          <div className="space-y-3.5">
            {departments.map((dept) => {
              const deptAssets = assets.filter((a) => a.departmentId === dept.id);
              const deptValuation = deptAssets.reduce((sum, a) => sum + (a.acquisitionCost || 0), 0);
              const pct = totalValuation > 0 ? Math.round((deptValuation / totalValuation) * 100) : 0;

              return (
                <div key={dept.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{dept.name}</span>
                    <span className="font-mono text-muted-foreground">
                      ${deptValuation.toLocaleString()} ({pct}%)
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

        {/* Category Breakdown */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Laptop className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              Inventory Composition by Category
            </h3>
          </div>

          <div className="space-y-3.5">
            {categories.map((cat) => {
              const catAssets = assets.filter((a) => a.categoryId === cat.id);
              const catValuation = catAssets.reduce((sum, a) => sum + (a.acquisitionCost || 0), 0);
              const pct = assets.length > 0 ? Math.round((catAssets.length / assets.length) * 100) : 0;

              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{cat.name}</span>
                    <span className="font-mono text-muted-foreground">
                      {catAssets.length} units (${catValuation.toLocaleString()})
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lifecycle Status Distribution */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-foreground">
          Global Lifecycle State Ledger Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-center">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="rounded-xl border border-border p-3 bg-muted/20">
              <p className="text-xl font-black text-foreground font-mono">{count}</p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

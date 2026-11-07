"use client";

import React, { useState } from "react";
import {
  X,
  Shield,
  Layers,
  Database,
  Check,
  Ban,
  ArrowRightLeft,
  RotateCcw,
  Sparkles,
  Info,
  Server,
  Lock,
  Workflow,
  Cpu,
} from "lucide-react";
import { useUIStore, MOCK_PERSONAS } from "@/store/uiStore";
import { useRole } from "@/hooks/useRole";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { Role } from "@/types";
import { toast } from "sonner";

export function RoleDetailsPanel() {
  const roleDetailsOpen = useUIStore((state) => state.roleDetailsOpen);
  const setRoleDetailsOpen = useUIStore((state) => state.setRoleDetailsOpen);
  const user = useUIStore((state) => state.user);
  const loginAs = useUIStore((state) => state.loginAs);
  const { role, permissions } = useRole();
  const { resetToDefaults } = useMockDatabase();

  const [activeTab, setActiveTab] = useState<"rbac" | "architecture">("rbac");

  if (!roleDetailsOpen) return null;

  const handleRoleSwitch = (newRole: Role) => {
    loginAs(newRole);
    const persona = MOCK_PERSONAS[newRole];
    toast.success(`Switched role to ${persona.designation}`, {
      description: `Now viewing system as ${persona.fullName} (${persona.departmentName})`,
    });
  };

  const handleResetData = () => {
    resetToDefaults();
    toast.info("Mock database reset to original 55+ seed assets.");
  };

  const rbacCapabilities = [
    { label: "Global Asset Ledger & Registration", key: permissions.canManageAssets },
    { label: "Organization Structure (Depts & Categories)", key: permissions.canManageOrg },
    { label: "Employee Role Elevation (Admin-Only)", key: permissions.canPromoteEmployees },
    { label: "Allocate Physical Assets", key: permissions.canAllocateAssets },
    { label: "Approve Asset Transfer Requests", key: permissions.canApproveTransfers },
    { label: "Authorize Maintenance & Assign Techs", key: permissions.canApproveMaintenance },
    { label: "Perform Scoped Physical Audits", key: permissions.canPerformAudits },
    { label: "Finalize & Lock Audit Discrepancies", key: permissions.canCloseAudits },
    { label: "Reserve Shared Resources (Rooms / Labs / AV)", key: permissions.canBookResources },
    { label: "Submit Equipment Repair Tickets", key: permissions.canRaiseMaintenance },
    { label: "Initiate Equipment Transfer", key: permissions.canInitiateTransfer },
    { label: "View Organizational Analytics & Valuation", key: permissions.canViewReports },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-xl bg-card border-l border-border shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="border-b border-border/80 px-6 py-4 flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Architecture & RBAC Explorer
                </h2>
                <p className="text-xs text-muted-foreground">
                  Technical showcase & persona inspector
                </p>
              </div>
            </div>
            <button
              onClick={() => setRoleDetailsOpen(false)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 border-b border-border text-center text-xs font-semibold bg-muted/20">
            <button
              onClick={() => setActiveTab("rbac")}
              className={`py-3 transition-colors border-b-2 ${
                activeTab === "rbac"
                  ? "border-primary text-primary bg-card"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              RBAC Personas & Permissions
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={`py-3 transition-colors border-b-2 ${
                activeTab === "architecture"
                  ? "border-primary text-primary bg-card"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              System Architecture & Engine
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {activeTab === "rbac" ? (
              <>
                {/* Active Persona Box */}
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      Current Active Persona
                    </span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary capitalize">
                      {role.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md">
                      {user?.avatar || "AF"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {user?.fullName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {user?.designation} • {user?.departmentName}
                      </p>
                      <p className="text-[11px] text-muted-foreground/80 mt-0.5 font-mono">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Role Quick Switcher */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Switch Persona to Test RBAC
                    </h3>
                    <span className="text-[11px] text-muted-foreground">
                      Instant state adaptation
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(["admin", "department_head", "employee", "auditor"] as Role[]).map((r) => {
                      const persona = MOCK_PERSONAS[r];
                      const isCurrent = role === r;
                      return (
                        <button
                          key={r}
                          onClick={() => handleRoleSwitch(r)}
                          className={`flex flex-col text-left p-3 rounded-xl border text-xs transition-all ${
                            isCurrent
                              ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                              : "border-border hover:border-primary/50 hover:bg-muted/40"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-foreground capitalize">
                              {r.replace("_", " ")}
                            </span>
                            {isCurrent && (
                              <span className="flex h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground truncate">
                            {persona.fullName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Capabilities Checklist */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Persona Capability Matrix
                  </h3>
                  <div className="rounded-xl border border-border bg-card divide-y divide-border/60">
                    {rbacCapabilities.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3.5 py-2.5 text-xs"
                      >
                        <span className={item.key ? "text-foreground font-medium" : "text-muted-foreground line-through"}>
                          {item.label}
                        </span>
                        {item.key ? (
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                            <Check className="h-3.5 w-3.5" />
                            <span>Allowed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-muted-foreground/60 text-[11px]">
                            <Ban className="h-3.5 w-3.5" />
                            <span>Restricted</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Architecture Tab */
              <div className="space-y-5 text-xs">
                {/* Tech Highlights */}
                <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-foreground font-bold">
                    <Server className="h-4 w-4 text-primary" />
                    <span>Dual Architectural Design</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    AssetFlow is engineered for enterprise ERP scalability. This branch (<code className="font-mono text-primary font-bold">gh-pages</code>) features a completely decoupled static simulation for zero-latency browser demonstrations.
                  </p>
                </div>

                {/* Architecture Comparison Cards */}
                <div className="space-y-3">
                  <div className="rounded-xl border border-border p-4 bg-card space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Lock className="h-4 w-4 text-emerald-600" />
                        Production Architecture
                      </span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
                        Postgres + RLS
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
                      <li><strong>Supabase Auth & Postgres:</strong> Relational hierarchy with strict foreign keys.</li>
                      <li><strong>Row Level Security (RLS):</strong> Policy checks executed inside database engine.</li>
                      <li><strong>Server Actions & Route Handlers:</strong> Zod-validated mutation pipeline.</li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-primary/40 p-4 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary flex items-center gap-1.5">
                        <Database className="h-4 w-4" />
                        Static Demo Architecture
                      </span>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                        This Showcase
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
                      <li><strong>Next.js Static Export:</strong> Compiled to purely static HTML/JS/CSS without server dependencies.</li>
                      <li><strong>SessionStorage Interceptor:</strong> Simulates full database CRUD, transactions, and event bus.</li>
                      <li><strong>Domain State Engines:</strong> Local enforcement of double-allocation guards, maintenance gates, and booking conflict validation.</li>
                    </ul>
                  </div>
                </div>

                {/* Domain Rules Overview */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-foreground font-bold">
                    <Workflow className="h-4 w-4 text-amber-500" />
                    <span>Enforced Domain Constraints</span>
                  </div>
                  <div className="rounded-xl border border-border p-3.5 space-y-2 bg-card text-muted-foreground leading-relaxed">
                    <p>
                      <strong>1. Double Allocation Guard:</strong> Physical items cannot be assigned twice. Conflicts automatically trigger a Transfer Request dialog.
                    </p>
                    <p>
                      <strong>2. Maintenance State Machine:</strong> Requests must be approved before status flips to "Under Maintenance". Reverts to "Available" only on Resolved.
                    </p>
                    <p>
                      <strong>3. Booking Overlap Engine:</strong> Range math authoritatively rejects overlaps for shared resources (touching boundaries are valid).
                    </p>
                    <p>
                      <strong>4. Audit Reconcile Lock:</strong> Scoped audit cycles lock upon closure, propagating confirmed missing assets to Lost status.
                    </p>
                  </div>
                </div>

                {/* Privacy Banner */}
                <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 text-sky-800 dark:text-sky-300 flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Privacy Compliance:</strong> All data, employees, assets, and serial numbers are 100% fictional dummy artifacts.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="border-t border-border/80 px-6 py-4 bg-muted/30 flex items-center justify-between">
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Demo Seed Data</span>
            </button>
            <button
              onClick={() => setRoleDetailsOpen(false)}
              className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold shadow-xs hover:bg-primary/90 transition-all"
            >
              Close Explorer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


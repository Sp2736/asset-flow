"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Tag,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Lock,
} from "lucide-react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { EmployeeDirectoryTable } from "@/components/organization/EmployeeDirectoryTable";
import { Role } from "@/types";
import { toast } from "sonner";

export default function OrganizationPage() {
  const { departments, employees, categories, promoteEmployeeRole } = useMockDatabase();
  const { role, permissions } = useRole();

  const [activeTab, setActiveTab] = useState<"employees" | "departments" | "categories">("employees");

  const handlePromote = (employeeId: string, empName: string, newRole: Role) => {
    if (!permissions.canPromoteEmployees) {
      toast.error("Role elevation requires System Administrator authorization.");
      return;
    }

    promoteEmployeeRole(employeeId, newRole);
    toast.success(`Role elevation applied for ${empName}!`, {
      description: `Elevated to ${newRole.replace("_", " ").toUpperCase()}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Organization Directory & Setup
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administer departmental boundaries, asset taxonomy categories, and employee role elevations.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("employees")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "employees"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Employee Directory & Role Elevation ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("departments")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "departments"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Departments ({departments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "categories"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>Asset Categories ({categories.length})</span>
        </button>
      </div>

      {activeTab === "employees" ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
            <p>
              <strong>Domain Rule 1:</strong> Role promotion (to Department Head, Asset Manager, or Auditor) is strictly restricted to this directory tab by a System Administrator. Self-service role elevation during signup is explicitly prohibited.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <EmployeeDirectoryTable
              employees={employees}
              canPromote={permissions.canPromoteEmployees}
              onPromote={handlePromote}
            />
          </div>
        </div>
      ) : activeTab === "departments" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  {dept.code}
                </span>
                <span className="text-xs font-semibold text-primary">
                  {dept.assetCount} Assets Registered
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground">
                {dept.name}
              </h3>
              <div className="space-y-1 text-xs text-muted-foreground pt-1 border-t border-border/60">
                <p>Location: <span className="font-medium text-foreground">{dept.location}</span></p>
                <p>Department Lead: <span className="font-medium text-foreground">{dept.headEmployeeName || "Unassigned"}</span></p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Categories Tab */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                  <Tag className="h-4 w-4" />
                </div>
                <span className="font-mono text-xs font-bold text-foreground">
                  {cat.assetCount} items
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {cat.name}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ShieldCheck,
  Building2,
  UserCheck,
  ClipboardCheck,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  Laptop,
} from "lucide-react";
import { useUIStore, MOCK_PERSONAS } from "@/store/uiStore";
import { Role } from "@/types";
import { initMockDatabase } from "@/lib/mockDatabase";

interface RoleCardProps {
  role: Role;
  title: string;
  name: string;
  email: string;
  dept: string;
  description: string;
  permissions: string[];
  icon: React.ReactNode;
  badgeColor: string;
  borderColor: string;
  buttonClass: string;
  onSelect: (role: Role) => void;
  isLoading: boolean;
  selectedRole: Role | null;
}

function RoleCard({
  role,
  title,
  name,
  email,
  dept,
  description,
  permissions,
  icon,
  badgeColor,
  borderColor,
  buttonClass,
  onSelect,
  isLoading,
  selectedRole,
}: RoleCardProps) {
  const isSelected = selectedRole === role;

  return (
    <div
      onClick={() => !isLoading && onSelect(role)}
      className={`group relative flex flex-col justify-between rounded-2xl border p-6 text-left transition-all duration-300 hover:shadow-xl cursor-pointer bg-card/90 backdrop-blur-sm ${
        isSelected
          ? `ring-2 ring-primary border-primary shadow-lg scale-[1.02]`
          : `${borderColor} hover:border-primary/60 hover:-translate-y-1`
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/80 text-foreground transition-transform group-hover:scale-105">
              {icon}
            </div>
            <div>
              <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${badgeColor}`}>
                {title}
              </span>
              <h3 className="text-base font-bold text-foreground mt-0.5">
                {name}
              </h3>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-3 space-y-0.5">
          <p><span className="font-medium text-foreground/80">Dept:</span> {dept}</p>
          <p><span className="font-medium text-foreground/80">Email:</span> {email}</p>
        </div>

        <p className="text-xs text-muted-foreground/90 leading-relaxed mb-4">
          {description}
        </p>

        <div className="border-t border-border/60 pt-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Key Capabilities
          </p>
          <ul className="space-y-1.5 text-xs text-foreground/80">
            {permissions.map((perm, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{perm}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border/50">
        <button
          type="button"
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold shadow-sm transition-all duration-200 ${buttonClass}`}
        >
          {isSelected && isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Authenticating Session...</span>
            </div>
          ) : (
            <>
              <span>Enter as {title}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const loginAs = useUIStore((state) => state.loginAs);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setIsLoading(true);

    // Initialize mock database in sessionStorage
    initMockDatabase();

    // Authenticate persona
    loginAs(role);
    const persona = MOCK_PERSONAS[role];

    toast.success(`Logged in as ${persona.fullName}`, {
      description: `Active role: ${persona.designation} (${persona.departmentName})`,
    });

    setTimeout(() => {
      router.push("/dashboard");
    }, 450);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-muted/20 to-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 -z-10 h-96 w-[800px] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/15" />

      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Architecture & Static Demo Showcase</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-blue-400 text-white shadow-lg shadow-primary/25">
              <Laptop className="h-6 w-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Asset<span className="text-primary">Flow</span>
            </h1>
          </div>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
            Enterprise Asset & Resource Management Platform. Select any Role Persona below to test live
            asset lifecycle state machines, double-allocation conflict resolution, booking overlap engines, and audit workflows.
          </p>

          <div className="mx-auto max-w-xl rounded-xl border border-border/80 bg-card/60 p-3 text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>
              <strong>Zero Backend Required:</strong> Powered by an in-browser sessionStorage simulation layer with 50+ fictional assets.
            </span>
          </div>
        </div>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Admin */}
          <RoleCard
            role="admin"
            title="System Admin"
            name="Alex Rivera"
            email="alex.rivera@techcorp.mock"
            dept="Executive Administration"
            description="Global administrator with overarching authority. Oversees departments, asset cataloging, audits, and employee role elevations."
            permissions={[
              "Full Global Asset Registry",
              "Employee Role Promotions",
              "Manage Depts & Categories",
              "Organization Analytics",
            ]}
            icon={<ShieldCheck className="h-6 w-6 text-primary" />}
            badgeColor="bg-primary/10 text-primary border border-primary/20"
            borderColor="border-border hover:border-primary/40"
            buttonClass="bg-primary text-primary-foreground hover:bg-primary/90"
            onSelect={handleRoleSelect}
            isLoading={isLoading}
            selectedRole={selectedRole}
          />

          {/* Department Head */}
          <RoleCard
            role="department_head"
            title="Dept Head"
            name="Sarah Chen"
            email="sarah.chen@techcorp.mock"
            dept="Engineering & Tech"
            description="Leads Engineering assets and facilities. Approves transfer handoffs, initiates equipment repairs, and books resources for projects."
            permissions={[
              "Departmental Asset Oversight",
              "Approve Asset Transfers",
              "Authorise Maintenance Jobs",
              "Team Resource Reservations",
            ]}
            icon={<Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
            badgeColor="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
            borderColor="border-border hover:border-emerald-500/40"
            buttonClass="bg-emerald-600 hover:bg-emerald-700 text-white"
            onSelect={handleRoleSelect}
            isLoading={isLoading}
            selectedRole={selectedRole}
          />

          {/* Employee */}
          <RoleCard
            role="employee"
            title="Employee"
            name="Jane Doe"
            email="jane.doe@techcorp.mock"
            dept="Product & UI/UX"
            description="Individual contributor persona. Views personal hardware allocations, raises repair tickets with symptoms, and reserves meeting rooms."
            permissions={[
              "View Assigned Workstation",
              "Submit Maintenance Tickets",
              "Book Projectors & Spaces",
              "Initiate Asset Transfer",
            ]}
            icon={<UserCheck className="h-6 w-6 text-sky-600 dark:text-sky-400" />}
            badgeColor="bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20"
            borderColor="border-border hover:border-sky-500/40"
            buttonClass="bg-sky-600 hover:bg-sky-700 text-white"
            onSelect={handleRoleSelect}
            isLoading={isLoading}
            selectedRole={selectedRole}
          />

          {/* Auditor */}
          <RoleCard
            role="auditor"
            title="Asset Auditor"
            name="Marcus Vance"
            email="marcus.vance@techcorp.mock"
            dept="Compliance & Risk"
            description="Physical audit and compliance officer. Executes scoped verification cycles, tags missing/damaged units, and reconciles variances."
            permissions={[
              "Run Physical Audit Cycles",
              "Verify/Missing/Damaged Grid",
              "Resolve Discrepancy Records",
              "Audit Lock & Status Sync",
            ]}
            icon={<ClipboardCheck className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
            badgeColor="bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
            borderColor="border-border hover:border-amber-500/40"
            buttonClass="bg-amber-600 hover:bg-amber-700 text-white"
            onSelect={handleRoleSelect}
            isLoading={isLoading}
            selectedRole={selectedRole}
          />
        </div>

        {/* Footer info badge */}
        <div className="pt-6 text-center text-xs text-muted-foreground">
          <p>
            AssetFlow Demo Platform • 100% Mock Dummy Data • Switch roles anytime from the in-app Architecture Explorer
          </p>
        </div>
      </div>
    </div>
  );
}

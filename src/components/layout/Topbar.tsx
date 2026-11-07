"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  Sparkles,
  ShieldCheck,
  Building2,
  UserCheck,
  ClipboardCheck,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useRole } from "@/hooks/useRole";
import { useNotifications } from "@/hooks/useNotifications";
import Link from "next/link";

export function Topbar() {
  const pathname = usePathname();
  const toggleRoleDetails = useUIStore((state) => state.toggleRoleDetails);
  const user = useUIStore((state) => state.user);
  const { role } = useRole();
  const { unreadCount } = useNotifications();

  const getPageTitle = () => {
    if (pathname.startsWith("/dashboard")) return "Executive Dashboard";
    if (pathname.startsWith("/assets/new")) return "Register New Asset";
    if (pathname.startsWith("/assets")) return "Central Asset Ledger";
    if (pathname.startsWith("/allocations")) return "Allocations & Custody Transfers";
    if (pathname.startsWith("/bookings")) return "Resource & Equipment Bookings";
    if (pathname.startsWith("/maintenance")) return "Maintenance & Repair Lifecycle";
    if (pathname.startsWith("/audits")) return "Physical Audit Cycles & Verification";
    if (pathname.startsWith("/organization")) return "Organization Directory & Setup";
    if (pathname.startsWith("/reports")) return "Valuation & Utilization Reports";
    if (pathname.startsWith("/notifications")) return "Activity Feed & Alerts";
    return "AssetFlow ERP";
  };

  const getRoleIcon = () => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="h-3.5 w-3.5 text-primary" />;
      case "department_head":
        return <Building2 className="h-3.5 w-3.5 text-emerald-600" />;
      case "auditor":
        return <ClipboardCheck className="h-3.5 w-3.5 text-amber-600" />;
      case "employee":
      default:
        return <UserCheck className="h-3.5 w-3.5 text-sky-600" />;
    }
  };

  return (
    <header className="h-16 border-b border-border/80 bg-card/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-bold text-foreground tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Enterprise Asset Management • Static Simulation
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Pill Button (opens Role Details Panel) */}
        <button
          onClick={toggleRoleDetails}
          className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 hover:bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition-all shadow-2xs hover:border-primary/40"
        >
          {getRoleIcon()}
          <span className="capitalize">{role.replace("_", " ")}</span>
          <span className="rounded-full bg-primary/10 text-primary text-[10px] px-1.5 py-0.2 font-mono">
            {user?.fullName.split(" ")[0]}
          </span>
          <Sparkles className="h-3 w-3 text-primary animate-pulse ml-0.5" />
        </button>

        {/* Notifications Button */}
        <Link
          href="/notifications"
          className="relative rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}


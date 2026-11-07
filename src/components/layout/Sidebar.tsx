"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Laptop,
  ArrowRightLeft,
  Calendar,
  Wrench,
  ClipboardCheck,
  Building2,
  BarChart3,
  Bell,
  LogOut,
  Sparkles,
  Lock,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useRole } from "@/hooks/useRole";
import { useNotifications } from "@/hooks/useNotifications";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUIStore((state) => state.user);
  const logout = useUIStore((state) => state.logout);
  const toggleRoleDetails = useUIStore((state) => state.toggleRoleDetails);
  const { role, permissions } = useRole();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, allowed: true },
    { label: "Assets Ledger", href: "/assets", icon: Laptop, allowed: true },
    { label: "Allocations & Transfers", href: "/allocations", icon: ArrowRightLeft, allowed: true },
    { label: "Resource Bookings", href: "/bookings", icon: Calendar, allowed: true },
    { label: "Maintenance Workflow", href: "/maintenance", icon: Wrench, allowed: true },
    {
      label: "Audit Cycles",
      href: "/audits",
      icon: ClipboardCheck,
      allowed: permissions.canPerformAudits || role === "admin",
      restrictedNote: "Auditor / Admin Only",
    },
    {
      label: "Organization Setup",
      href: "/organization",
      icon: Building2,
      allowed: permissions.canManageOrg,
      restrictedNote: "Admin Only",
    },
    {
      label: "Reports & Analytics",
      href: "/reports",
      icon: BarChart3,
      allowed: permissions.canViewReports,
      restrictedNote: "Leadership / Auditor",
    },
    {
      label: "Activity & Alerts",
      href: "/notifications",
      icon: Bell,
      allowed: true,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-border/80 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20">
              AF
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-foreground">
                Asset<span className="text-primary">Flow</span>
              </span>
              <span className="block text-[10px] font-semibold text-primary uppercase tracking-wider">
                Static Demo ERP
              </span>
            </div>
          </Link>
        </div>

        {/* Omnipresent Architecture Pill */}
        <div className="p-3">
          <button
            onClick={toggleRoleDetails}
            className="w-full flex items-center justify-between gap-2 rounded-xl bg-primary/10 border border-primary/20 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/15 transition-all shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>RBAC & Architecture</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : item.allowed
                    ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                    : "text-muted-foreground/60 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {!item.allowed && (
                    <span title={item.restrictedNote}>
                      <Lock className="h-3 w-3 text-muted-foreground/50" />
                    </span>
                  )}
                  {item.badge !== undefined && (
                    <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${isActive ? "bg-white text-primary" : "bg-primary text-primary-foreground"}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Session Footer */}
      <div className="p-4 border-t border-border/80 bg-muted/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs">
              {user?.avatar || "AF"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-foreground truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-[10px] text-muted-foreground capitalize truncate">
                {role.replace("_", " ")}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={toggleRoleDetails}
          className="w-full text-center text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors border border-border/60 rounded-lg py-1 bg-card hover:bg-muted/50"
        >
          Switch Role ({role.replace("_", " ")})
        </button>
      </div>
    </aside>
  );
}


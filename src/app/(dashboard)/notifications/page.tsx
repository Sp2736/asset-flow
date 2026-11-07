"use client";

import React from "react";
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const { notifications } = useMockDatabase();

  const getIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <ShieldAlert className="h-4 w-4 text-rose-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Activity Feed & Audit Alerts
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-time cross-cutting chronological event stream of asset allocations, transfer requests, repair milestones, and compliance warnings.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="divide-y divide-border/60">
          {notifications.map((notif) => (
            <NotificationItem key={notif.id} notification={notif} />
          ))}
        </div>
      </div>
    </div>
  );
}

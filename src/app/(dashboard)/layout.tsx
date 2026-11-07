"use client";

import React, { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { RoleGate } from "@/components/layout/RoleGate";
import { RoleDetailsPanel } from "@/components/layout/RoleDetailsPanel";
import { initMockDatabase } from "@/lib/mockDatabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initMockDatabase();
  }, []);

  return (
    <RoleGate>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
      <RoleDetailsPanel />
    </RoleGate>
  );
}

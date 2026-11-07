"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { canAccessRoute } from "@/lib/permissions";
import { ShieldAlert, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoleGateProps {
  children: React.ReactNode;
}

export function RoleGate({ children }: RoleGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUIStore((state) => state.user);
  const toggleRoleDetails = useUIStore((state) => state.toggleRoleDetails);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      // Check session storage directly in case zustand initialized before storage was loaded
      const stored = window.sessionStorage.getItem("assetflow_mock_session");
      if (!stored) {
        router.push("/login");
      }
    }
  }, [user, mounted, router]);

  if (!mounted || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Verifying role credentials...
          </p>
        </div>
      </div>
    );
  }

  const hasAccess = canAccessRoute(user.role, pathname);

  if (!hasAccess) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Access Restricted by RBAC Policy
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Your current persona (
          <span className="font-semibold capitalize text-foreground">
            {user.role.replace("_", " ")}
          </span>
          ) does not have authorization to view this section ({pathname}).
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button
            onClick={toggleRoleDetails}
            className="flex items-center gap-2 bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            Switch Role in Explorer
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


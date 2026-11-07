"use client";

import { useUIStore } from "@/store/uiStore";
import { getRolePermissions } from "@/lib/permissions";
import { Role } from "@/types";

export function useRole() {
  const user = useUIStore((state) => state.user);
  const role: Role = user?.role || "employee";
  const permissions = getRolePermissions(role);

  return {
    role,
    permissions,
    isAdmin: role === "admin",
    isDeptHead: role === "department_head",
    isAuditor: role === "auditor",
    isEmployee: role === "employee",
  };
}


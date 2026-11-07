"use client";

import React from "react";
import { Employee, Role } from "@/types";

interface EmployeeDirectoryTableProps {
  employees: Employee[];
  canPromote: boolean;
  onPromote: (employeeId: string, empName: string, newRole: Role) => void;
}

export function EmployeeDirectoryTable({
  employees,
  canPromote,
  onPromote,
}: EmployeeDirectoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
            <th className="py-3 px-4">Employee</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">Designation</th>
            <th className="py-3 px-4">Assigned Assets</th>
            <th className="py-3 px-4">Active Role</th>
            <th className="py-3 px-4 text-right">Admin Role Elevation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                    {emp.avatar}
                  </div>
                  <span className="font-bold text-foreground">{emp.fullName}</span>
                </div>
              </td>
              <td className="py-3 px-4 font-mono text-muted-foreground text-[11px]">
                {emp.email}
              </td>
              <td className="py-3 px-4 text-foreground/90 font-medium">
                {emp.departmentName}
              </td>
              <td className="py-3 px-4 text-muted-foreground">
                {emp.designation}
              </td>
              <td className="py-3 px-4 font-mono font-semibold text-foreground">
                {emp.allocatedAssetCount} items
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    emp.role === "admin"
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : emp.role === "department_head"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : emp.role === "auditor"
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {emp.role.replace("_", " ")}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                {canPromote ? (
                  <div className="inline-flex items-center gap-1.5">
                    {emp.role !== "department_head" && (
                      <button
                        onClick={() => onPromote(emp.id, emp.fullName, "department_head")}
                        className="rounded-lg px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-300/40"
                      >
                        Elevate Dept Head
                      </button>
                    )}
                    {emp.role !== "auditor" && (
                      <button
                        onClick={() => onPromote(emp.id, emp.fullName, "auditor")}
                        className="rounded-lg px-2 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-300/40"
                      >
                        Elevate Auditor
                      </button>
                    )}
                    {emp.role !== "employee" && (
                      <button
                        onClick={() => onPromote(emp.id, emp.fullName, "employee")}
                        className="rounded-lg px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-muted border border-border"
                      >
                        Reset Employee
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-[11px] text-muted-foreground/60 italic">
                    Admin Only
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


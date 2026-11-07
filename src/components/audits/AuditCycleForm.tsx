"use client";

import React, { useState } from "react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { Button } from "@/components/ui/button";

interface AuditCycleFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AuditCycleForm({ onSuccess, onCancel }: AuditCycleFormProps) {
  const { departments, employees } = useMockDatabase();

  const [name, setName] = useState("");
  const [scopeLocation, setScopeLocation] = useState("");
  const [scopeDepartmentId, setScopeDepartmentId] = useState(departments[0]?.id || "");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className="font-semibold text-foreground block mb-1">Cycle Name</label>
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Q2 2026 Engineering Bay Physical Audit"
          className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-foreground block mb-1">Scope Location</label>
          <input
            required
            type="text"
            value={scopeLocation}
            onChange={(e) => setScopeLocation(e.target.value)}
            placeholder="e.g. Floor 4 - Tech Hub"
            className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="font-semibold text-foreground block mb-1">Scope Department</label>
          <select
            value={scopeDepartmentId}
            onChange={(e) => setScopeDepartmentId(e.target.value)}
            className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-foreground block mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="font-semibold text-foreground block mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
          Create Audit Cycle
        </Button>
      </div>
    </form>
  );
}


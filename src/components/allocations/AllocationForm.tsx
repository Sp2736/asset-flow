"use client";

import React, { useState } from "react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { Button } from "@/components/ui/button";

interface AllocationFormProps {
  onSuccess?: () => void;
  onConflict?: (conflict: { assetId: string; assetName: string; heldBy: string; holderEmpId?: string }) => void;
  onCancel?: () => void;
}

export function AllocationForm({ onSuccess, onConflict, onCancel }: AllocationFormProps) {
  const { assets, employees, allocateAsset } = useMockDatabase();

  const [assetId, setAssetId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState(
    new Date(Date.now() + 180 * 86400000).toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");

  const handleAssetSelect = (id: string) => {
    setAssetId(id);
    const asset = assets.find((a) => a.id === id);
    if (asset && asset.status === "Allocated") {
      if (onConflict) {
        onConflict({
          assetId: asset.id,
          assetName: asset.name,
          heldBy: asset.assignedToEmployeeName || "Another Employee",
          holderEmpId: asset.assignedToEmployeeId || undefined,
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = allocateAsset(assetId, employeeId, expectedReturnDate, notes);
    if (res.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className="font-semibold text-foreground block mb-1">Select Physical Asset</label>
        <select
          required
          value={assetId}
          onChange={(e) => handleAssetSelect(e.target.value)}
          className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
        >
          <option value="">Choose an asset...</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.id}) — [{a.status}]
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-semibold text-foreground block mb-1">Assignee Employee</label>
        <select
          required
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
        >
          <option value="">Choose employee...</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.fullName} ({e.departmentName})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-semibold text-foreground block mb-1">Expected Return Date</label>
        <input
          required
          type="date"
          value={expectedReturnDate}
          onChange={(e) => setExpectedReturnDate(e.target.value)}
          className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="font-semibold text-foreground block mb-1">Notes</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Allocation notes..."
          className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
          Confirm Allocation
        </Button>
      </div>
    </form>
  );
}


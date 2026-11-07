"use client";

import React, { useState } from "react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";

interface MaintenanceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MaintenanceForm({ onSuccess, onCancel }: MaintenanceFormProps) {
  const { assets, createMaintenanceRequest } = useMockDatabase();
  const user = useUIStore((state) => state.user);

  const [assetId, setAssetId] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [issueDescription, setIssueDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId || !issueDescription || !user) return;

    createMaintenanceRequest(assetId, user.id, issueDescription, priority);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className="font-semibold text-foreground block mb-1">Target Asset</label>
        <select
          required
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
        >
          <option value="">Select asset to service...</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name} ({asset.id}) [{asset.status}]
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-semibold text-foreground block mb-1">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
        >
          <option value="low">Low (Cosmetic / Inspection)</option>
          <option value="medium">Medium (Impaired Performance)</option>
          <option value="high">High (Non-functional)</option>
          <option value="urgent">Urgent (Battery / Electrical Danger)</option>
        </select>
      </div>

      <div>
        <label className="font-semibold text-foreground block mb-1">Issue Description</label>
        <textarea
          required
          rows={3}
          value={issueDescription}
          onChange={(e) => setIssueDescription(e.target.value)}
          placeholder="Describe symptoms, error messages, or physical damages..."
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
          Submit Maintenance Ticket
        </Button>
      </div>
    </form>
  );
}


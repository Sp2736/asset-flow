"use client";

import React, { useState } from "react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { Button } from "@/components/ui/button";
import { AssetStatus } from "@/types";

interface AssetFormProps {
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export function AssetForm({ onSubmitSuccess, onCancel }: AssetFormProps) {
  const { departments, categories, createAsset } = useMockDatabase();

  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || "");
  const [location, setLocation] = useState("");
  const [acquisitionCost, setAcquisitionCost] = useState("1200");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [condition, setCondition] = useState<"Mint" | "Good" | "Fair" | "Needs Maintenance">("Mint");
  const [status, setStatus] = useState<AssetStatus>("Available");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCat = categories.find((c) => c.id === categoryId);
    const selectedDept = departments.find((d) => d.id === departmentId);

    createAsset({
      name,
      model,
      serialNumber,
      categoryId,
      categoryName: selectedCat?.name || "General",
      departmentId,
      departmentName: selectedDept?.name || "Operations",
      location: location || `${selectedDept?.name} Office`,
      acquisitionCost: parseFloat(acquisitionCost) || 0,
      purchaseDate,
      condition,
      status,
      notes,
    });

    if (onSubmitSuccess) onSubmitSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-foreground block mb-1">Asset Name</label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. MacBook Pro Mock-16"
            className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="font-semibold text-foreground block mb-1">Model</label>
          <input
            required
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. MBP16-M3-MAX"
            className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="font-semibold text-foreground block mb-1">Serial Number</label>
          <input
            required
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="e.g. SN-MBP-908124"
            className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground font-mono outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="font-semibold text-foreground block mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold text-foreground block mb-1">Department</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
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
          <label className="font-semibold text-foreground block mb-1">Acquisition Cost ($)</label>
          <input
            type="number"
            min="0"
            value={acquisitionCost}
            onChange={(e) => setAcquisitionCost(e.target.value)}
            className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground font-mono outline-none focus:border-primary"
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
          Save Asset
        </Button>
      </div>
    </form>
  );
}


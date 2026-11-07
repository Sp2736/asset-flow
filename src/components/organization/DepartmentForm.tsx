"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface DepartmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DepartmentForm({ onSuccess, onCancel }: DepartmentFormProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className="font-semibold text-foreground block mb-1">Department Name</label>
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Artificial Intelligence Research"
          className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="font-semibold text-foreground block mb-1">Code / Prefix</label>
        <input
          required
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. AIR"
          className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground font-mono outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="font-semibold text-foreground block mb-1">Office Location</label>
        <input
          required
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Annex Lab 4"
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
          Create Department
        </Button>
      </div>
    </form>
  );
}


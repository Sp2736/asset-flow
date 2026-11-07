"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface CategoryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CategoryForm({ onSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className="font-semibold text-foreground block mb-1">Category Name</label>
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Drone & Robotics Fleet"
          className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="font-semibold text-foreground block mb-1">Description</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Category purpose and hardware scope..."
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
          Create Category
        </Button>
      </div>
    </form>
  );
}


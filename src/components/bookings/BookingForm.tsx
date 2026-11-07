"use client";

import React, { useState } from "react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";

interface BookingFormProps {
  resources: Array<{ id: string; name: string; capacity: string }>;
  onSuccess?: () => void;
  onConflict?: (errorMsg: string) => void;
  onCancel?: () => void;
}

export function BookingForm({
  resources,
  onSuccess,
  onConflict,
  onCancel,
}: BookingFormProps) {
  const { createBooking } = useMockDatabase();
  const user = useUIStore((state) => state.user);

  const [resourceId, setResourceId] = useState(resources[0]?.id || "");
  const [startTime, setStartTime] = useState("2026-11-10T14:00");
  const [endTime, setEndTime] = useState("2026-11-10T16:00");
  const [purpose, setPurpose] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const res = resources.find((r) => r.id === resourceId);
    if (!res) return;

    const result = createBooking(
      res.id,
      res.name,
      user.id,
      startTime,
      endTime,
      purpose || "Team Working Session"
    );

    if (!result.success) {
      if (onConflict) onConflict(result.error || "Overlap conflict.");
      return;
    }

    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className="font-semibold text-foreground block mb-1">Shared Resource</label>
        <select
          value={resourceId}
          onChange={(e) => setResourceId(e.target.value)}
          className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
        >
          {resources.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.capacity})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-foreground block mb-1">Start Time</label>
          <input
            required
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="font-semibold text-foreground block mb-1">End Time</label>
          <input
            required
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="font-semibold text-foreground block mb-1">Purpose / Agenda</label>
        <input
          required
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="e.g. Design Critique & Prototype Review"
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
          Confirm Reservation
        </Button>
      </div>
    </form>
  );
}


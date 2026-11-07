"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  X,
  Info,
} from "lucide-react";
import { useMockDatabase } from "@/hooks/useMockDatabase";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { BookingCalendar } from "@/components/bookings/BookingCalendar";
import { toast } from "sonner";

export default function BookingsPage() {
  const { bookings, createBooking } = useMockDatabase();
  const user = useUIStore((state) => state.user);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState("RES-CONF-A");
  const [startTime, setStartTime] = useState("2026-11-10T14:00");
  const [endTime, setEndTime] = useState("2026-11-10T16:00");
  const [purpose, setPurpose] = useState("");
  const [overlapError, setOverlapError] = useState<string | null>(null);

  const sharedResources = [
    { id: "RES-CONF-A", name: "Executive Boardroom A (4K Video)", location: "Floor 4 - Tech Hub", capacity: "18 Persons" },
    { id: "RES-LAB-02", name: "Hardware RF Testing Lab 2", location: "Annex Lab B", capacity: "6 Engineers" },
    { id: "RES-PROJ-01", name: "Sony 4K Mobile Projector Cart", location: "Floor 3 - Design Studio", capacity: "Portable AV" },
    { id: "RES-STUDIO", name: "Neat Bar Pro All-in-One Studio", location: "Floor 3 - Creative Wing", capacity: "8 Persons" },
    { id: "RES-VAN-01", name: "Ford Transit Fleet Cargo Van", location: "Basement Parking Bay P-12", capacity: "Logistics Vehicle" },
  ];

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setOverlapError(null);

    const resource = sharedResources.find((r) => r.id === selectedResourceId);
    if (!resource || !user) return;

    const res = createBooking(
      resource.id,
      resource.name,
      user.id,
      startTime,
      endTime,
      purpose || "Project Planning Meeting"
    );

    if (!res.success) {
      setOverlapError(res.error || "Booking overlap detected.");
      toast.error("Booking Conflict Detected", {
        description: res.error,
      });
      return;
    }

    toast.success("Resource booked successfully!", {
      description: `${resource.name} reserved for ${user.fullName}`,
    });

    setBookingModalOpen(false);
    setPurpose("");
    setOverlapError(null);
  };

  const formatDateTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Resource & Equipment Bookings
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Shared facilities, conference video rooms, mobile projectors, and fleet assets reservation engine.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => {
              setBookingModalOpen(true);
              setOverlapError(null);
            }}
            className="gap-2 bg-primary text-primary-foreground text-xs shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Reserve Resource
          </Button>
        </div>
      </div>

      {/* Shared Resources Catalog */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sharedResources.map((res) => {
          const resBookings = bookings.filter((b) => b.resourceId === res.id && b.status === "confirmed");

          return (
            <div
              key={res.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                    {res.id}
                  </span>
                  <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-medium text-foreground/80">
                    {res.capacity}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {res.name}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {res.location}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">
                  {resBookings.length} confirmed bookings
                </span>
                <button
                  onClick={() => {
                    setSelectedResourceId(res.id);
                    setBookingModalOpen(true);
                  }}
                  className="font-semibold text-primary hover:underline"
                >
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bookings Schedule Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs space-y-3 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              Authoritative Reservations Ledger
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            Strict Non-Overlapping Engine Enforced
          </span>
        </div>

        <BookingCalendar bookings={bookings} />
      </div>

      {/* Reserve Resource Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Reserve Shared Resource
                </h3>
                <p className="text-xs text-muted-foreground">
                  Authoritative conflict check prevents double-booking
                </p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {overlapError && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Booking Overlap Conflict</span>
                </div>
                <p className="leading-relaxed pl-6">{overlapError}</p>
              </div>
            )}

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Shared Resource <span className="text-destructive">*</span>
                </label>
                <select
                  value={selectedResourceId}
                  onChange={(e) => {
                    setSelectedResourceId(e.target.value);
                    setOverlapError(null);
                  }}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
                >
                  {sharedResources.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.name} ({res.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Start Date & Time <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setOverlapError(null);
                    }}
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    End Date & Time <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      setOverlapError(null);
                    }}
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Session Purpose / Meeting Agenda <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Executive Strategy & Engineering Sync"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-[11px] text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Domain Rule 4:</strong> Two bookings for the same resource must not have overlapping time ranges. A booking starting exactly when another ends is valid (touching, not overlapping).
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setBookingModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-primary text-primary-foreground"
                >
                  Verify & Reserve
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

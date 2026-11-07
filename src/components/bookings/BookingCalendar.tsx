"use client";

import React from "react";
import { Booking } from "@/types";
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";

interface BookingCalendarProps {
  bookings: Booking[];
}

export function BookingCalendar({ bookings }: BookingCalendarProps) {
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
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
            <th className="py-3 px-4">Booking ID</th>
            <th className="py-3 px-4">Resource</th>
            <th className="py-3 px-4">Reserved By</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">Time Window</th>
            <th className="py-3 px-4">Purpose</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {bookings.map((b) => (
            <tr key={b.id} className="hover:bg-muted/30 transition-colors">
              <td className="py-3 px-4 font-mono font-semibold text-foreground">
                {b.id}
              </td>
              <td className="py-3 px-4 font-bold text-foreground">
                {b.resourceName}
              </td>
              <td className="py-3 px-4 font-medium text-foreground">
                {b.employeeName}
              </td>
              <td className="py-3 px-4 text-muted-foreground">
                {b.departmentName}
              </td>
              <td className="py-3 px-4 font-mono text-muted-foreground">
                <div>{formatDateTime(b.startTime)}</div>
                <div className="text-[10px] text-muted-foreground/80">to {formatDateTime(b.endTime)}</div>
              </td>
              <td className="py-3 px-4 text-foreground/90 max-w-xs truncate">
                {b.purpose}
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                  <CheckCircle2 className="h-3 w-3" />
                  {b.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


import React from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  highlightColor?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  highlightColor,
}: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${highlightColor || "bg-primary/10 text-primary"}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-black text-foreground">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}


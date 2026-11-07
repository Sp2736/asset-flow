import React from "react";
import { ActivityNotification } from "@/types";
import { Info, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

interface NotificationItemProps {
  notification: ActivityNotification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <ShieldAlert className="h-4 w-4 text-rose-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div
      className={`py-3 flex items-start gap-3 transition-colors ${
        !notification.read ? "bg-primary/5 -mx-3 px-3 rounded-xl" : ""
      }`}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted mt-0.5">
        {getIcon(notification.type)}
      </div>

      <div className="flex-1 space-y-0.5 text-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-foreground">
            {notification.title}
          </h4>
          <span className="text-[10px] text-muted-foreground font-mono">
            {notification.timestamp}
          </span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {notification.message}
        </p>
      </div>
    </div>
  );
}


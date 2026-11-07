"use client";

import { useMockDatabase } from "./useMockDatabase";

export function useNotifications() {
  const { notifications } = useMockDatabase();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
  };
}


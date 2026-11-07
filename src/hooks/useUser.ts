"use client";

import { useUIStore } from "@/store/uiStore";

export function useUser() {
  const user = useUIStore((state) => state.user);
  const setUser = useUIStore((state) => state.setUser);
  const loginAs = useUIStore((state) => state.loginAs);
  const logout = useUIStore((state) => state.logout);

  return {
    user,
    isAuthenticated: !!user,
    setUser,
    loginAs,
    logout,
  };
}


"use client";

import { create } from "zustand";
import { Role, UserSession } from "@/types";

export const MOCK_PERSONAS: Record<Role, UserSession> = {
  admin: {
    id: "emp-admin-01",
    fullName: "Alex Rivera",
    email: "alex.rivera@techcorp.mock",
    role: "admin",
    departmentId: "dept-exec",
    departmentName: "Executive Administration",
    designation: "Global System Administrator",
    avatar: "AR",
    token: "mock-jwt-admin-token-12345",
  },
  department_head: {
    id: "emp-dh-01",
    fullName: "Sarah Chen",
    email: "sarah.chen@techcorp.mock",
    role: "department_head",
    departmentId: "dept-eng",
    departmentName: "Engineering & Tech",
    designation: "VP of Software Engineering",
    avatar: "SC",
    token: "mock-jwt-depthead-token-23456",
  },
  employee: {
    id: "emp-user-01",
    fullName: "Jane Doe",
    email: "jane.doe@techcorp.mock",
    role: "employee",
    departmentId: "dept-design",
    departmentName: "Product & UI/UX",
    designation: "Senior Product Designer",
    avatar: "JD",
    token: "mock-jwt-employee-token-34567",
  },
  auditor: {
    id: "emp-audit-01",
    fullName: "Marcus Vance",
    email: "marcus.vance@techcorp.mock",
    role: "auditor",
    departmentId: "dept-compliance",
    departmentName: "Compliance & Risk",
    designation: "Lead Asset Compliance Auditor",
    avatar: "MV",
    token: "mock-jwt-auditor-token-45678",
  },
};

const SESSION_STORAGE_KEY = "assetflow_mock_session";

function getInitialSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to read mock session from sessionStorage", e);
  }
  return null;
}

interface UIStore {
  user: UserSession | null;
  sidebarOpen: boolean;
  roleDetailsOpen: boolean;
  loginAs: (role: Role) => void;
  setUser: (user: UserSession | null) => void;
  logout: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setRoleDetailsOpen: (open: boolean) => void;
  toggleRoleDetails: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  user: getInitialSession(),
  sidebarOpen: true,
  roleDetailsOpen: false,

  loginAs: (role: Role) => {
    const persona = MOCK_PERSONAS[role];
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(persona));
    }
    set({ user: persona });
  },

  setUser: (user: UserSession | null) => {
    if (typeof window !== "undefined") {
      if (user) {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      } else {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
    set({ user });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    set({ user: null });
  },

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setRoleDetailsOpen: (open: boolean) => set({ roleDetailsOpen: open }),
  toggleRoleDetails: () => set((state) => ({ roleDetailsOpen: !state.roleDetailsOpen })),
}));


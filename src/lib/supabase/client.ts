/**
 * Static Demo Supabase Client Interceptor
 * In this gh-pages static showcase, all database queries are simulated
 * using browser sessionStorage via @/lib/mockDatabase.
 */

import { getMockDatabase, saveMockDatabase } from "@/lib/mockDatabase";

export function createClient() {
  return {
    auth: {
      getUser: async () => {
        if (typeof window === "undefined") return { data: { user: null }, error: null };
        const stored = window.sessionStorage.getItem("assetflow_mock_session");
        return { data: { user: stored ? JSON.parse(stored) : null }, error: null };
      },
      getSession: async () => {
        if (typeof window === "undefined") return { data: { session: null }, error: null };
        const stored = window.sessionStorage.getItem("assetflow_mock_session");
        return {
          data: {
            session: stored
              ? { user: JSON.parse(stored), access_token: "mock-jwt" }
              : null,
          },
          error: null,
        };
      },
      signOut: async () => {
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem("assetflow_mock_session");
        }
        return { error: null };
      },
    },
    from: (table: string) => {
      const db = getMockDatabase();
      const records = (db as any)[table] || [];

      return {
        select: (columns = "*") => ({
          eq: (field: string, value: any) => ({
            data: records.filter((r: any) => r[field] === value),
            error: null,
          }),
          order: () => ({
            data: records,
            error: null,
          }),
          data: records,
          error: null,
        }),
        insert: (data: any) => {
          if (Array.isArray((db as any)[table])) {
            (db as any)[table].push(data);
            saveMockDatabase(db);
          }
          return { data, error: null };
        },
        update: (data: any) => ({
          eq: (field: string, value: any) => {
            const list = (db as any)[table];
            if (Array.isArray(list)) {
              const target = list.find((item: any) => item[field] === value);
              if (target) Object.assign(target, data);
              saveMockDatabase(db);
            }
            return { data, error: null };
          },
        }),
        delete: () => ({
          eq: (field: string, value: any) => {
            const list = (db as any)[table];
            if (Array.isArray(list)) {
              (db as any)[table] = list.filter((item: any) => item[field] !== value);
              saveMockDatabase(db);
            }
            return { error: null };
          },
        }),
      };
    },
  };
}


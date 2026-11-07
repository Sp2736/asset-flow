"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DatabaseState,
  getMockDatabase,
  resetMockDatabase,
  createAsset,
  updateAssetStatus,
  allocateAsset,
  returnAsset,
  requestTransfer,
  approveTransfer,
  createMaintenanceRequest,
  updateMaintenanceStatus,
  createBooking,
  verifyAuditAsset,
  closeAuditCycle,
  promoteEmployeeRole,
  getScopedAllocations,
  getScopedAssets,
  getScopedMaintenance,
} from "@/lib/mockDatabase";
import { useUIStore } from "@/store/uiStore";

export function useMockDatabase() {
  const [data, setData] = useState<DatabaseState>(getMockDatabase);
  const user = useUIStore((state) => state.user);

  useEffect(() => {
    // Initial fetch on mount
    setData(getMockDatabase());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<DatabaseState>;
      if (customEvent.detail) {
        setData(customEvent.detail);
      } else {
        setData(getMockDatabase());
      }
    };

    window.addEventListener("assetflow:db_updated", handleUpdate);
    return () => {
      window.removeEventListener("assetflow:db_updated", handleUpdate);
    };
  }, []);

  const refresh = useCallback(() => {
    setData(getMockDatabase());
  }, []);

  // Role-scoped data (simulating Supabase RLS)
  const scopedAllocations = user
    ? getScopedAllocations(user.role, user.departmentId, user.id)
    : data.allocations;

  const scopedAssets = user
    ? getScopedAssets(user.role, user.departmentId, user.id)
    : data.assets;

  const scopedMaintenance = user
    ? getScopedMaintenance(user.role, user.departmentId, user.id)
    : data.maintenance;

  return {
    ...data,
    refresh,
    resetToDefaults: resetMockDatabase,
    // RLS Scoped views
    scopedAllocations,
    scopedAssets,
    scopedMaintenance,
    // Action wrappers
    createAsset,
    updateAssetStatus,
    allocateAsset,
    returnAsset,
    requestTransfer,
    approveTransfer,
    createMaintenanceRequest,
    updateMaintenanceStatus,
    createBooking,
    verifyAuditAsset,
    closeAuditCycle,
    promoteEmployeeRole,
  };
}

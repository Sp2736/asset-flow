import { Role } from "@/types";

export interface PermissionCapabilities {
  canManageOrg: boolean;
  canManageAssets: boolean;
  canAllocateAssets: boolean;
  canApproveTransfers: boolean;
  canApproveMaintenance: boolean;
  canPerformAudits: boolean;
  canCloseAudits: boolean;
  canPromoteEmployees: boolean;
  canViewFinancials: boolean;
  canBookResources: boolean;
  canRaiseMaintenance: boolean;
  canInitiateTransfer: boolean;
  canViewReports: boolean;
}

export function getRolePermissions(role: Role): PermissionCapabilities {
  switch (role) {
    case "admin":
      return {
        canManageOrg: true,
        canManageAssets: true,
        canAllocateAssets: true,
        canApproveTransfers: true,
        canApproveMaintenance: true,
        canPerformAudits: true,
        canCloseAudits: true,
        canPromoteEmployees: true,
        canViewFinancials: true,
        canBookResources: true,
        canRaiseMaintenance: true,
        canInitiateTransfer: true,
        canViewReports: true,
      };

    case "department_head":
      return {
        canManageOrg: false,
        canManageAssets: true,
        canAllocateAssets: true,
        canApproveTransfers: true,
        canApproveMaintenance: true,
        canPerformAudits: false,
        canCloseAudits: false,
        canPromoteEmployees: false,
        canViewFinancials: false,
        canBookResources: true,
        canRaiseMaintenance: true,
        canInitiateTransfer: true,
        canViewReports: true,
      };

    case "auditor":
      return {
        canManageOrg: false,
        canManageAssets: false,
        canAllocateAssets: false,
        canApproveTransfers: false,
        canApproveMaintenance: false,
        canPerformAudits: true,
        canCloseAudits: true,
        canPromoteEmployees: false,
        canViewFinancials: false,
        canBookResources: false,
        canRaiseMaintenance: false,
        canInitiateTransfer: false,
        canViewReports: true,
      };

    case "employee":
    default:
      return {
        canManageOrg: false,
        canManageAssets: false,
        canAllocateAssets: false,
        canApproveTransfers: false,
        canApproveMaintenance: false,
        canPerformAudits: false,
        canCloseAudits: false,
        canPromoteEmployees: false,
        canViewFinancials: false,
        canBookResources: true,
        canRaiseMaintenance: true,
        canInitiateTransfer: true,
        canViewReports: false,
      };
  }
}

export function canAccessRoute(role: Role, pathname: string): boolean {
  if (role === "admin") return true;

  if (pathname.startsWith("/organization")) {
    return false;
  }

  if (pathname.startsWith("/audits")) {
    return role === "auditor";
  }

  if (pathname.startsWith("/reports")) {
    return role === "department_head" || role === "auditor";
  }

  return true;
}

export type Role = "admin" | "department_head" | "employee" | "auditor";

export type AssetStatus =
  | "Available"
  | "Allocated"
  | "Reserved"
  | "Under Maintenance"
  | "Lost"
  | "Retired"
  | "Disposed";

export interface UserSession {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  departmentId: string;
  departmentName: string;
  designation: string;
  avatar: string;
  token: string;
}

export interface Asset {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  categoryId: string;
  categoryName: string;
  departmentId: string;
  departmentName: string;
  status: AssetStatus;
  acquisitionCost: number;
  purchaseDate: string;
  location: string;
  assignedToEmployeeId?: string | null;
  assignedToEmployeeName?: string | null;
  notes?: string;
  condition?: "Mint" | "Good" | "Fair" | "Needs Maintenance";
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headEmployeeId?: string;
  headEmployeeName?: string;
  location: string;
  assetCount: number;
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  departmentId: string;
  departmentName: string;
  designation: string;
  avatar: string;
  allocatedAssetCount: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  assetCount: number;
  iconName?: string;
}

export interface Allocation {
  id: string;
  assetId: string;
  assetName: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  departmentName: string;
  allocatedAt: string;
  expectedReturnDate: string;
  actualReturnDate?: string | null;
  status: "active" | "returned" | "transferred" | "overdue";
  notes?: string;
}

export interface TransferRequest {
  id: string;
  assetId: string;
  assetName: string;
  fromEmployeeId: string;
  fromEmployeeName: string;
  toEmployeeId: string;
  toEmployeeName: string;
  status: "requested" | "approved" | "rejected";
  requestedAt: string;
  reason: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  departmentName: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  purpose: string;
  status: "confirmed" | "cancelled";
}

export interface MaintenanceRequest {
  id: string;
  assetId: string;
  assetName: string;
  reportedByEmployeeId: string;
  reportedByEmployeeName: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "Pending" | "Approved" | "In Progress" | "Resolved" | "Rejected";
  issueDescription: string;
  technician?: string;
  estimatedCost?: number;
  actualCost?: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditCycle {
  id: string;
  name: string;
  scopeLocation: string;
  scopeDepartmentId?: string;
  scopeDepartmentName?: string;
  status: "Active" | "Completed";
  assignedAuditorId: string;
  assignedAuditorName: string;
  startDate: string;
  endDate: string;
  totalAssetsInScope: number;
  verifiedCount: number;
  missingCount: number;
  damagedCount: number;
}

export interface AuditVerification {
  id: string;
  auditCycleId: string;
  assetId: string;
  assetName: string;
  status: "Verified" | "Missing" | "Damaged";
  verifiedAt: string;
  notes?: string;
}

export interface ActivityNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "warning" | "success" | "critical";
  read: boolean;
  link?: string;
}


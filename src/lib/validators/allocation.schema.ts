import { z } from "zod";

export const allocationStatusSchema = z.enum([
  "active",
  "returned",
  "transferred",
  "overdue",
]);

export const allocationSchema = z.object({
  id: z.string().min(1, "Allocation ID is required"),
  assetId: z.string().min(1, "Asset ID is required"),
  assetName: z.string().min(1, "Asset name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  employeeName: z.string().min(1, "Employee name is required"),
  departmentId: z.string().min(1, "Department ID is required"),
  departmentName: z.string().min(1, "Department name is required"),
  allocatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  expectedReturnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  actualReturnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").nullable().optional(),
  status: allocationStatusSchema,
  notes: z.string().optional(),
});

export const createAllocationInputSchema = z.object({
  assetId: z.string().min(1, "Asset selection is required"),
  employeeId: z.string().min(1, "Employee selection is required"),
  expectedReturnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Return date must be YYYY-MM-DD"),
  notes: z.string().optional(),
});

export const transferRequestSchema = z.object({
  id: z.string().min(1, "Transfer ID is required"),
  assetId: z.string().min(1, "Asset ID is required"),
  assetName: z.string().min(1, "Asset name is required"),
  fromEmployeeId: z.string().min(1, "Source employee is required"),
  fromEmployeeName: z.string().min(1, "Source employee name is required"),
  toEmployeeId: z.string().min(1, "Target employee is required"),
  toEmployeeName: z.string().min(1, "Target employee name is required"),
  status: z.enum(["requested", "approved", "rejected"]),
  requestedAt: z.string(),
  reason: z.string().min(3, "Reason must be at least 3 characters"),
});

export type AllocationInput = z.infer<typeof allocationSchema>;
export type CreateAllocationInput = z.infer<typeof createAllocationInputSchema>;
export type TransferRequestInput = z.infer<typeof transferRequestSchema>;


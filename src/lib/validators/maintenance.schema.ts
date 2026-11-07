import { z } from "zod";

export const maintenancePrioritySchema = z.enum(["low", "medium", "high", "urgent"]);
export const maintenanceStatusSchema = z.enum([
  "Pending",
  "Approved",
  "In Progress",
  "Resolved",
  "Rejected",
]);

export const maintenanceRequestSchema = z.object({
  id: z.string().min(1, "Request ID is required"),
  assetId: z.string().min(1, "Asset ID is required"),
  assetName: z.string().min(1, "Asset name is required"),
  reportedByEmployeeId: z.string().min(1, "Reporter ID is required"),
  reportedByEmployeeName: z.string().min(1, "Reporter name is required"),
  priority: maintenancePrioritySchema,
  status: maintenanceStatusSchema,
  issueDescription: z.string().min(5, "Issue description must be at least 5 characters"),
  technician: z.string().optional(),
  estimatedCost: z.number().nonnegative().optional(),
  actualCost: z.number().nonnegative().optional(),
  createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  resolvedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
});

export const createMaintenanceInputSchema = z.object({
  assetId: z.string().min(1, "Asset is required"),
  issueDescription: z.string().min(5, "Issue description must be at least 5 characters"),
  priority: maintenancePrioritySchema,
});

export type MaintenanceRequestInput = z.infer<typeof maintenanceRequestSchema>;
export type CreateMaintenanceInput = z.infer<typeof createMaintenanceInputSchema>;


import { z } from "zod";

export const auditCycleStatusSchema = z.enum(["Active", "Completed"]);
export const auditVerificationStatusSchema = z.enum(["Verified", "Missing", "Damaged"]);

export const auditCycleSchema = z.object({
  id: z.string().min(1, "Audit ID is required"),
  name: z.string().min(3, "Audit cycle name is required"),
  scopeLocation: z.string().min(1, "Scope location is required"),
  scopeDepartmentId: z.string().optional(),
  scopeDepartmentName: z.string().optional(),
  status: auditCycleStatusSchema,
  assignedAuditorId: z.string().min(1, "Auditor ID is required"),
  assignedAuditorName: z.string().min(1, "Auditor name is required"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  totalAssetsInScope: z.number().int().nonnegative(),
  verifiedCount: z.number().int().nonnegative(),
  missingCount: z.number().int().nonnegative(),
  damagedCount: z.number().int().nonnegative(),
});

export const auditVerificationSchema = z.object({
  id: z.string().min(1),
  auditCycleId: z.string().min(1),
  assetId: z.string().min(1),
  assetName: z.string().min(1),
  status: auditVerificationStatusSchema,
  verifiedAt: z.string(),
  notes: z.string().optional(),
});

export type AuditCycleInput = z.infer<typeof auditCycleSchema>;
export type AuditVerificationInput = z.infer<typeof auditVerificationSchema>;


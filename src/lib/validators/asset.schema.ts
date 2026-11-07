import { z } from "zod";

export const assetStatusSchema = z.enum([
  "Available",
  "Allocated",
  "Reserved",
  "Under Maintenance",
  "Lost",
  "Retired",
  "Disposed",
]);

export const assetConditionSchema = z.enum([
  "Mint",
  "Good",
  "Fair",
  "Needs Maintenance",
]);

export const assetSchema = z.object({
  id: z.string().min(1, "Asset ID is required"),
  name: z.string().min(2, "Asset name must be at least 2 characters"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  categoryId: z.string().min(1, "Category is required"),
  categoryName: z.string().min(1, "Category name is required"),
  departmentId: z.string().min(1, "Department is required"),
  departmentName: z.string().min(1, "Department name is required"),
  status: assetStatusSchema,
  acquisitionCost: z.number().nonnegative("Cost cannot be negative"),
  purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  location: z.string().min(1, "Location is required"),
  assignedToEmployeeId: z.string().nullable().optional(),
  assignedToEmployeeName: z.string().nullable().optional(),
  notes: z.string().optional(),
  condition: assetConditionSchema.optional(),
});

export const createAssetInputSchema = assetSchema.omit({ id: true });

export type AssetInput = z.infer<typeof assetSchema>;
export type CreateAssetInput = z.infer<typeof createAssetInputSchema>;


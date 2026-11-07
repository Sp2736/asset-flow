import { z } from "zod";

export const bookingSchema = z.object({
  id: z.string().min(1, "Booking ID is required"),
  resourceId: z.string().min(1, "Resource ID is required"),
  resourceName: z.string().min(1, "Resource name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  employeeName: z.string().min(1, "Employee name is required"),
  departmentId: z.string().min(1, "Department ID is required"),
  departmentName: z.string().min(1, "Department name is required"),
  startTime: z.string(),
  endTime: z.string(),
  purpose: z.string().min(3, "Purpose must be at least 3 characters"),
  status: z.enum(["confirmed", "cancelled"]),
});

export const createBookingInputSchema = z
  .object({
    resourceId: z.string().min(1, "Resource is required"),
    startTime: z.string(),
    endTime: z.string(),
    purpose: z.string().min(3, "Purpose must be at least 3 characters"),
  })
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type BookingInput = z.infer<typeof bookingSchema>;
export type CreateBookingInput = z.infer<typeof createBookingInputSchema>;


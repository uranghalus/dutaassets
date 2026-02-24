import { z } from "zod";

export const assetLoanFormSchema = z.object({
  assetId: z.string().min(1, "Asset is required"),
  departmentId: z.string().optional().nullable(),
  employeeId: z.string().min(1, "Employee is required"),
  loanDate: z.coerce.date().default(() => new Date()),
  returnDate: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type AssetLoanForm = z.infer<typeof assetLoanFormSchema>;

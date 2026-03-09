import { z } from "zod";

export const safetyEquipmentFormSchema = z
  .object({
    assetId: z.string().min(1, "Asset is required"),
    type: z.enum(["APAR", "HYDRANT"]),
    aparType: z.string().optional(),
    sizeKg: z
      .preprocess((val) => (val === "" ? undefined : Number(val)), z.number())
      .optional(),
    hydrantType: z.string().optional(),
    hydrantSize: z.string().optional(),
    qrCode: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "APAR") return !!data.aparType;
      return true;
    },
    { message: "APAR Type is required", path: ["aparType"] },
  );

export type SafetyEquipmentFormValues = z.infer<
  typeof safetyEquipmentFormSchema
>;

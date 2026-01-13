import z from "zod";

export const packageSchema = z.object({
  itemSku: z.string().min(1, "Item ID / SKU is required"),
  length: z.coerce
    .number<number>()
    .positive("Length must be a positive number"),
  width: z.coerce.number<number>().positive("Width must be a positive number"),
  height: z.coerce
    .number<number>()
    .positive("Height must be a positive number"),
  weightLbs: z.coerce
    .number<number>()
    .min(0, "Weight (lbs) cannot be negative"),
  weightOz: z.coerce.number<number>().min(0, "Weight (oz) cannot be negative"),
});

export type PackageFormData = z.infer<typeof packageSchema>;

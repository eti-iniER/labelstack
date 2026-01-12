import z from "zod";

export const packageSchema = z.object({
  itemSku: z.string().min(1, "Item SKU is required"),
  length: z.number().positive("Length must be a positive number"),
  width: z.number().positive("Width must be a positive number"),
  height: z.number().positive("Height must be a positive number"),
  weightLbs: z.number().positive("Weight (lbs) must be a positive number"),
  weightOz: z.number().min(0, "Weight (oz) cannot be negative"),
});

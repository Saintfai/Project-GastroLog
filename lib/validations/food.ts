import { z } from "zod";

export const FoodCategoryEnum = z.enum([
  "GRAIN",
  "PROTEIN",
  "DAIRY",
  "VEGETABLE",
  "FRUIT",
  "BEVERAGE",
  "SNACK",
  "OTHER",
]);

export const GerdRiskLevelEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const AddFoodItemSchema = z.object({
  name: z.string().min(2, "Nama makanan minimal 2 karakter").max(100, "Nama makanan maksimal 100 karakter"),
  category: FoodCategoryEnum,
  gerdRiskLevel: GerdRiskLevelEnum,
  description: z.string().max(500, "Deskripsi maksimal 500 karakter").optional().nullable(),
});

export type AddFoodItemInput = z.infer<typeof AddFoodItemSchema>;

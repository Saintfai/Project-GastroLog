import { z } from "zod";

export const FoodSearchSchema = z.string().min(2).max(100);

export const JournalEntrySchema = z.object({
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK", "DRINK"]),
  foodName: z.string().min(1, "Nama makanan/minuman harus diisi").max(200),
  foodItemId: z.string().uuid().nullable(),
  portionSize: z.enum(["SMALL", "MEDIUM", "LARGE"]),
  severity: z.number().int().min(1).max(10),
  symptomTypes: z.array(z.enum(["HEARTBURN", "REGURGITATION", "BLOATING", "NAUSEA", "CHEST_PAIN", "OTHER"])),
  stressLevel: z.number().int().min(1).max(5),
  notes: z.string().max(1000),
});

export type JournalEntryInput = z.infer<typeof JournalEntrySchema>;

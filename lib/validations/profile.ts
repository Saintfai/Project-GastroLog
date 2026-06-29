import { z } from "zod";

export const ProfileSchema = z.object({
  age: z.number().int().min(1).max(120).nullable().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().optional(),
  gerdSeverity: z.enum(["MILD", "MODERATE", "SEVERE"]).nullable().optional(),
  gerdDurationMonths: z.number().int().min(0).max(1200).nullable().optional(),
  medications: z.array(z.string().max(100)).optional(),
  foodRestrictions: z.array(z.string().max(100)).optional(),
});

export type ProfileInput = z.infer<typeof ProfileSchema>;

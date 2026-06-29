"use server";

import prisma from "@/lib/prisma";
import { Gender, GerdSeverity } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth-utils";
import { ProfileSchema } from "@/lib/validations/profile";

export async function saveProfile(data: {
  age?: number | null;
  gender?: Gender | null;
  gerdSeverity?: GerdSeverity | null;
  gerdDurationMonths?: number | null;
  medications?: string[];
  foodRestrictions?: string[];
}) {
  try {
    const userId = await requireUserId();

    // Validasi data
    const validatedData = ProfileSchema.parse(data);

    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: validatedData,
      create: {
        userId,
        ...validatedData,
      },
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
    return { success: true, profile };
  } catch (error) {
    console.error("Failed to save profile:", error);
    return { success: false, error: "Failed to save profile" };
  }
}

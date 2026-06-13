import prisma from "@/lib/prisma";
import { Gender, GerdSeverity } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function saveProfile(userId: string, data: {
  age?: number | null;
  gender?: Gender | null;
  gerdSeverity?: GerdSeverity | null;
  gerdDurationMonths?: number | null;
  medications?: string[];
  foodRestrictions?: string[];
}) {
  try {
    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
    revalidatePath("/dashboard/profile");
    return { success: true, profile };
  } catch (error) {
    console.error("Failed to save profile:", error);
    return { success: false, error: "Failed to save profile" };
  }
}

// Keep createProfile for compatibility
export async function createProfile(userId: string, data: any) {
  return saveProfile(userId, data);
}


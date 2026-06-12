import prisma from "@/lib/prisma";
import { Gender, GerdSeverity } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createProfile(userId: string, data: {
  age?: number;
  gender?: Gender;
  gerdSeverity?: GerdSeverity;
  gerdDurationMonths?: number;
  medications?: string[];
  foodRestrictions?: string[];
}) {
  try {
    const profile = await prisma.userProfile.create({
      data: {
        userId,
        ...data,
      },
    });
    revalidatePath("/dashboard/profile");
    return { success: true, profile };
  } catch (error) {
    console.error("Failed to create profile:", error);
    return { success: false, error: "Failed to save profile" };
  }
}

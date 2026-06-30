"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth-utils";
import { AddFoodItemSchema, type AddFoodItemInput } from "@/lib/validations/food";

export async function addCustomFood(data: AddFoodItemInput) {
  await requireUserId();

  const validatedData = AddFoodItemSchema.parse(data);

  const newFoodItem = await prisma.foodItem.create({
    data: {
      name: validatedData.name.trim(),
      category: validatedData.category,
      gerdRiskLevel: validatedData.gerdRiskLevel,
      isVerified: false,
    },
  });

  revalidatePath("/dashboard/foods");
  revalidatePath("/dashboard/journal");

  return { success: true, item: newFoodItem };
}

import prisma from "@/lib/prisma";
import type { FoodCategory, GerdRiskLevel, Prisma } from "@prisma/client";

export interface FoodFilterParams {
  query?: string;
  category?: string;
  riskLevel?: string;
}

export async function getFoodItems(filters: FoodFilterParams = {}) {
  const where: Prisma.FoodItemWhereInput = {};

  if (filters.query && filters.query.trim().length > 0) {
    where.name = {
      contains: filters.query.trim(),
      mode: "insensitive",
    };
  }

  if (filters.category && filters.category !== "ALL") {
    where.category = filters.category as FoodCategory;
  }

  if (filters.riskLevel && filters.riskLevel !== "ALL") {
    where.gerdRiskLevel = filters.riskLevel as GerdRiskLevel;
  }

  return prisma.foodItem.findMany({
    where,
    orderBy: [
      { gerdRiskLevel: "desc" }, // HIGH -> MEDIUM -> LOW
      { name: "asc" },
    ],
  });
}

export async function getFoodStats() {
  const [low, medium, high, total] = await Promise.all([
    prisma.foodItem.count({ where: { gerdRiskLevel: "LOW" } }),
    prisma.foodItem.count({ where: { gerdRiskLevel: "MEDIUM" } }),
    prisma.foodItem.count({ where: { gerdRiskLevel: "HIGH" } }),
    prisma.foodItem.count(),
  ]);

  return { low, medium, high, total };
}

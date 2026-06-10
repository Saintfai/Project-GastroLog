"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { MealType, PortionSize, SymptomType } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────
export type FoodSearchResult = {
  id: string;
  name: string;
  category: string;
  gerdRiskLevel: string;
  description: string | null;
};

type JournalFormData = {
  mealType: MealType;
  foodName: string;
  foodItemId: string | null;
  portionSize: PortionSize;
  severity: number;
  symptomTypes: SymptomType[];
  stressLevel: number;
  notes: string;
};

// ─── Search Food Items ────────────────────────────────────
export async function searchFoodItems(
  query: string
): Promise<FoodSearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const results = await prisma.foodItem.findMany({
    where: {
      name: {
        contains: query.trim(),
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      category: true,
      gerdRiskLevel: true,
      description: true,
    },
    take: 8,
    orderBy: {
      name: "asc",
    },
  });

  return results;
}

// ─── Create Journal Entry ─────────────────────────────────
export async function createJournalEntry(data: JournalFormData) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Cari user berdasarkan email dari session
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const today = new Date();
  // Set ke tanggal saja (tanpa jam) untuk logDate
  const logDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Hitung overall score: berdasarkan severity dan stress
  // Semakin tinggi severity = semakin buruk, stress 1=sangat stres, 5=sangat baik
  // Score = 10 - severity + (stressLevel - 3) => range ~-2 to ~12, clamp ke 1-10
  const stressBonus = data.stressLevel - 3; // -2 to +2
  const rawScore = 10 - data.severity + stressBonus;
  const overallScore = Math.max(1, Math.min(10, rawScore));

  // Upsert DailyLog (buat baru jika belum ada hari ini, atau gunakan yang ada)
  const dailyLog = await prisma.dailyLog.upsert({
    where: {
      userId_logDate: {
        userId: user.id,
        logDate: logDate,
      },
    },
    update: {
      overallScore: overallScore,
      notes: data.notes || undefined,
    },
    create: {
      userId: user.id,
      logDate: logDate,
      overallScore: overallScore,
      notes: data.notes || undefined,
    },
  });

  const now = new Date();

  // Buat MealLog
  await prisma.mealLog.create({
    data: {
      dailyLogId: dailyLog.id,
      foodItemId: data.foodItemId || undefined,
      mealType: data.mealType,
      foodName: data.foodName,
      mealTime: now,
      portionSize: data.portionSize,
      notes: null,
    },
  });

  // Buat SymptomLog untuk setiap jenis gejala yang dipilih
  if (data.symptomTypes.length > 0) {
    await prisma.symptomLog.createMany({
      data: data.symptomTypes.map((symptomType) => ({
        dailyLogId: dailyLog.id,
        symptomType: symptomType,
        severity: data.severity,
        onsetTime: now,
        durationMinutes: null,
        notes: null,
      })),
    });
  }

  // Buat ActivityLog (stress level)
  await prisma.activityLog.create({
    data: {
      dailyLogId: dailyLog.id,
      stressLevel: data.stressLevel,
      sleepHours: null,
      sleepPosition: null,
      exerciseDone: false,
    },
  });

  redirect("/dashboard");
}

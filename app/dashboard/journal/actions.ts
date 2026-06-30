"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { MealType, PortionSize, SymptomType } from "@prisma/client";
import { requireUserId } from "@/lib/auth-utils";
import { JournalEntrySchema, FoodSearchSchema } from "@/lib/validations/journal";

// ─── Types ────────────────────────────────────────────────
export type FoodSearchResult = {
  id: string;
  name: string;
  category: string;
  gerdRiskLevel: string;
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
  // Pastikan user sudah login
  await requireUserId();

  // Validasi query
  const validatedQuery = FoodSearchSchema.parse(query);

  const results = await prisma.foodItem.findMany({
    where: {
      name: {
        contains: validatedQuery.trim(),
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      category: true,
      gerdRiskLevel: true,
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
  const userId = await requireUserId();

  // Validasi input menggunakan schema Zod
  const validatedData = JournalEntrySchema.parse(data);

  const today = new Date();
  // Set ke tanggal saja (tanpa jam) untuk logDate
  const logDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Upsert DailyLog (buat baru jika belum ada hari ini, atau gunakan yang ada).
  const dailyLog = await prisma.dailyLog.upsert({
    where: {
      userId_logDate: {
        userId,
        logDate: logDate,
      },
    },
    update: {
      notes: validatedData.notes || undefined,
    },
    create: {
      userId,
      logDate: logDate,
      notes: validatedData.notes || undefined,
    },
  });

  const now = new Date();

  // Buat MealLog
  await prisma.mealLog.create({
    data: {
      dailyLogId: dailyLog.id,
      foodItemId: validatedData.foodItemId || undefined,
      mealType: validatedData.mealType,
      foodName: validatedData.foodName,
      mealTime: now,
      portionSize: validatedData.portionSize,
      notes: null,
    },
  });

  // Buat SymptomLog untuk setiap jenis gejala yang dipilih
  if (validatedData.symptomTypes.length > 0) {
    await prisma.symptomLog.createMany({
      data: validatedData.symptomTypes.map((symptomType) => ({
        dailyLogId: dailyLog.id,
        symptomType: symptomType,
        severity: validatedData.severity,
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
      stressLevel: validatedData.stressLevel,
      sleepHours: null,
      sleepPosition: null,
      exerciseDone: false,
    },
  });

  // Hitung ulang skor harian dari seluruh data hari ini.
  await recalcDailyScore(dailyLog.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/history");
  revalidatePath("/dashboard/analytics");
  revalidatePath("/dashboard/profile");

  redirect("/dashboard");
}

// ─── Hitung ulang skor harian dari SELURUH data hari itu ───
async function recalcDailyScore(dailyLogId: string) {
  const [symptomAgg, stressAgg] = await Promise.all([
    prisma.symptomLog.aggregate({
      where: { dailyLogId },
      _avg: { severity: true },
    }),
    prisma.activityLog.aggregate({
      where: { dailyLogId },
      _avg: { stressLevel: true },
    }),
  ]);

  const avgSeverity = symptomAgg._avg.severity ?? 0; // 0 = tidak ada gejala
  const avgStress = stressAgg._avg.stressLevel ?? 3; // 3 = netral
  const stressBonus = avgStress - 3; // -2..+2
  const rawScore = 10 - avgSeverity + stressBonus;
  const overallScore = Math.max(1, Math.min(10, Math.round(rawScore)));

  await prisma.dailyLog.update({
    where: { id: dailyLogId },
    data: { overallScore },
  });
}

// ─── Hapus satu MealLog (dengan cek kepemilikan) ───────────
export async function deleteMealLog(mealLogId: string) {
  const userId = await requireUserId();

  // Pastikan item ini milik user yang login sebelum dihapus.
  const meal = await prisma.mealLog.findFirst({
    where: { id: mealLogId, dailyLog: { userId } },
    select: { dailyLogId: true },
  });

  if (!meal) {
    return { success: false, error: "Entri tidak ditemukan." };
  }

  await prisma.mealLog.delete({ where: { id: mealLogId } });
  await finalizeDailyLog(meal.dailyLogId);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/history");
  revalidatePath("/dashboard/analytics");
  revalidatePath("/dashboard/profile");
  return { success: true };
}

// ─── Hapus satu SymptomLog (dengan cek kepemilikan) ────────
export async function deleteSymptomLog(symptomLogId: string) {
  const userId = await requireUserId();

  const symptom = await prisma.symptomLog.findFirst({
    where: { id: symptomLogId, dailyLog: { userId } },
    select: { dailyLogId: true },
  });

  if (!symptom) {
    return { success: false, error: "Gejala tidak ditemukan." };
  }

  await prisma.symptomLog.delete({ where: { id: symptomLogId } });
  await finalizeDailyLog(symptom.dailyLogId);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/history");
  revalidatePath("/dashboard/analytics");
  revalidatePath("/dashboard/profile");
  return { success: true };
}

// ─── Util: setelah hapus, hitung ulang skor; hapus DailyLog
// bila sudah tidak ada makanan & gejala tersisa ──────────────
async function finalizeDailyLog(dailyLogId: string) {
  const [mealCount, symptomCount] = await Promise.all([
    prisma.mealLog.count({ where: { dailyLogId } }),
    prisma.symptomLog.count({ where: { dailyLogId } }),
  ]);

  if (mealCount === 0 && symptomCount === 0) {
    // Hari ini jadi kosong — buang DailyLog (ActivityLog ikut terhapus via cascade).
    await prisma.dailyLog.delete({ where: { id: dailyLogId } });
    return;
  }

  await recalcDailyScore(dailyLogId);
}

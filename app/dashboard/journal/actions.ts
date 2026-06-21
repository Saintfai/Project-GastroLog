"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

  // Upsert DailyLog (buat baru jika belum ada hari ini, atau gunakan yang ada).
  // Skor TIDAK dihitung di sini; dihitung ulang dari data seluruh hari setelah
  // entri ditambahkan (lihat bagian "Hitung ulang skor harian" di bawah).
  const dailyLog = await prisma.dailyLog.upsert({
    where: {
      userId_logDate: {
        userId: user.id,
        logDate: logDate,
      },
    },
    update: {
      notes: data.notes || undefined,
    },
    create: {
      userId: user.id,
      logDate: logDate,
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

  // Hitung ulang skor harian dari seluruh data hari ini.
  await recalcDailyScore(dailyLog.id);

  redirect("/dashboard");
}

// ─── Hitung ulang skor harian dari SELURUH data hari itu ───
// Skor mencerminkan kondisi sepanjang hari, bukan hanya satu entri.
// - Gejala: dipakai keparahan rata-rata (semakin parah = skor turun).
//   Hari tanpa gejala sama sekali tidak dihukum (severity dianggap 0).
// - Stres: rata-rata stres harian memberi bonus/penalti (-2..+2).
// Helper internal (tidak diekspor) supaya tidak menjadi server action publik.
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
  return { success: true };
}

// ─── Util: ambil userId dari session atau redirect ke login ─
async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    redirect("/login");
  }
  return user.id;
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

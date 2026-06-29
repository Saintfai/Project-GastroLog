import type { MealLog, SymptomLog, FoodItem } from "@prisma/client";

export type MealWithFood = MealLog & { foodItem: FoodItem | null };

export type TimelineItem =
  | { type: "meal"; id: string; time: Date; data: MealWithFood }
  | { type: "symptom"; id: string; time: Date; data: SymptomLog };

/**
 * Mendapatkan label status kesehatan berdasarkan skor.
 */
export function getScoreLabel(score: number): string {
  if (score <= 0) return "Belum ada data";
  if (score <= 3) return "Kurang baik";
  if (score <= 6) return "Cukup";
  if (score <= 9) return "Baik";
  return "Sangat baik";
}

/**
 * Membuat data sparkline 7 hari.
 */
export function buildSparkline(
  recentLogs: { logDate: Date; overallScore: number }[],
  startOfToday: Date
) {
  const scoreByDay = new Map(
    recentLogs.map((l) => [
      new Date(l.logDate.getFullYear(), l.logDate.getMonth(), l.logDate.getDate()).getTime(),
      l.overallScore,
    ])
  );

  const sparkline: { score: number | null; isToday: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(startOfToday);
    d.setDate(d.getDate() - i);
    sparkline.push({ score: scoreByDay.get(d.getTime()) ?? null, isToday: i === 0 });
  }
  return sparkline;
}

/**
 * Menggabungkan dan mengurutkan makanan serta gejala hari ini menjadi timeline.
 */
export function buildTimeline(
  todayLog: { meals: MealWithFood[]; symptoms: SymptomLog[] } | null
): TimelineItem[] {
  if (!todayLog) return [];

  const meals: TimelineItem[] = todayLog.meals.map((m) => ({
    type: "meal",
    id: m.id,
    time: m.mealTime,
    data: m,
  }));

  const symptoms: TimelineItem[] = todayLog.symptoms.map((s) => ({
    type: "symptom",
    id: s.id,
    time: s.onsetTime,
    data: s,
  }));

  return [...meals, ...symptoms].sort((a, b) => b.time.getTime() - a.time.getTime());
}

"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

// Ambil userId dari session atau redirect ke login
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

export async function getAnalyticsData(period: number, passedUserId?: string) {
  const userId = passedUserId || await requireUserId();

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const startDate = new Date(startOfToday);
  startDate.setDate(startDate.getDate() - period + 1);

  // Ambil semua log harian dalam rentang waktu tersebut
  const dailyLogs = await prisma.dailyLog.findMany({
    where: {
      userId,
      logDate: {
        gte: startDate,
        lte: startOfToday,
      },
    },
    include: {
      meals: {
        include: { foodItem: true },
      },
      symptoms: true,
      activities: true,
    },
    orderBy: {
      logDate: "asc",
    },
  });

  // 1. Rata-rata skor kesehatan
  const totalLogs = dailyLogs.length;
  const avgHealthScore = totalLogs > 0
    ? Number((dailyLogs.reduce((sum, log) => sum + log.overallScore, 0) / totalLogs).toFixed(1))
    : 0;

  // 2. Hari aktif mencatat jurnal
  const activeDays = totalLogs;

  // 3. Tren Nilai Kesehatan (Trend Data)
  const trendData: { dateLabel: string; score: number | null; dateString: string }[] = [];
  const tempDate = new Date(startDate);
  
  while (tempDate <= startOfToday) {
    const dateCopy = new Date(tempDate);
    const log = dailyLogs.find(l => {
      const lDate = new Date(l.logDate);
      return lDate.getFullYear() === dateCopy.getFullYear() &&
             lDate.getMonth() === dateCopy.getMonth() &&
             lDate.getDate() === dateCopy.getDate();
    });

    const dayStr = dateCopy.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    const fullDateStr = dateCopy.toISOString().split("T")[0];
    
    trendData.push({
      dateLabel: dayStr,
      score: log ? log.overallScore : null,
      dateString: fullDateStr,
    });

    tempDate.setDate(tempDate.getDate() + 1);
  }

  // 4. Distribusi Gejala & Korelasi Makanan Berisiko
  const symptomDistribution: Record<string, { count: number; totalSeverity: number }> = {};
  const riskFoodCounts: Record<string, { count: number; gerdRiskLevel?: string }> = {};

  dailyLogs.forEach(log => {
    // Agregasi gejala
    log.symptoms.forEach(s => {
      const type = s.symptomType;
      if (!symptomDistribution[type]) {
        symptomDistribution[type] = { count: 0, totalSeverity: 0 };
      }
      symptomDistribution[type].count += 1;
      symptomDistribution[type].totalSeverity += s.severity;
    });

    // Cari makanan yang dikonsumsi pada hari di mana ada gejala dengan tingkat keparahan >= 5
    const hasSevereSymptom = log.symptoms.some(s => s.severity >= 5);
    if (hasSevereSymptom) {
      log.meals.forEach(m => {
        const name = m.foodName;
        if (!riskFoodCounts[name]) {
          riskFoodCounts[name] = { count: 0, gerdRiskLevel: m.foodItem?.gerdRiskLevel };
        }
        riskFoodCounts[name].count += 1;
      });
    }
  });

  // Konversi distribusi gejala ke array & urutkan
  const symptomList = Object.entries(symptomDistribution).map(([type, data]) => ({
    type,
    count: data.count,
    avgSeverity: Number((data.totalSeverity / data.count).toFixed(1)),
  })).sort((a, b) => b.count - a.count);

  // Konversi makanan berisiko ke array & urutkan
  const riskiestFoods = Object.entries(riskFoodCounts)
    .map(([name, data]) => ({
      name,
      count: data.count,
      gerdRiskLevel: data.gerdRiskLevel || "MEDIUM",
    }))
    .sort((a, b) => b.count - a.count);

  // Ambil label gejala teratas & makanan teratas untuk ringkasan
  const mostFrequentSymptom = symptomList.length > 0 ? symptomList[0].type : "Tidak ada";
  const riskiestFood = riskiestFoods.length > 0 ? riskiestFoods[0].name : "Tidak ada";

  // 5. Analisis Pola Stres (Stress level 1-5)
  const stressPatterns: Record<number, { count: number; totalScore: number; totalSymptomCount: number }> = {
    1: { count: 0, totalScore: 0, totalSymptomCount: 0 },
    2: { count: 0, totalScore: 0, totalSymptomCount: 0 },
    3: { count: 0, totalScore: 0, totalSymptomCount: 0 },
    4: { count: 0, totalScore: 0, totalSymptomCount: 0 },
    5: { count: 0, totalScore: 0, totalSymptomCount: 0 },
  };

  dailyLogs.forEach(log => {
    // Di schema.prisma, dailyLogs has many activities. Kita ambil yang pertama jika ada.
    const activity = log.activities[0];
    if (activity && activity.stressLevel) {
      const stress = activity.stressLevel;
      if (stressPatterns[stress]) {
        stressPatterns[stress].count += 1;
        stressPatterns[stress].totalScore += log.overallScore;
        stressPatterns[stress].totalSymptomCount += log.symptoms.length;
      }
    }
  });

  const stressAnalysis = Object.entries(stressPatterns).map(([level, data]) => {
    const stressLevel = Number(level);
    return {
      stressLevel,
      logCount: data.count,
      avgScore: data.count > 0 ? Number((data.totalScore / data.count).toFixed(1)) : 0,
      avgSymptomCount: data.count > 0 ? Number((data.totalSymptomCount / data.count).toFixed(1)) : 0,
    };
  });

  return {
    period,
    summary: {
      avgHealthScore,
      activeDays,
      mostFrequentSymptom,
      riskiestFood,
    },
    trendData,
    symptomList,
    riskiestFoods: riskiestFoods.slice(0, 5),
    stressAnalysis,
    totalLogsCount: totalLogs,
  };
}

import prisma from "@/lib/prisma";

export async function getTodayLog(userId: string, startOfToday: Date) {
  return prisma.dailyLog.findUnique({
    where: {
      userId_logDate: {
        userId,
        logDate: startOfToday,
      },
    },
    include: {
      meals: {
        include: { foodItem: true },
        orderBy: { mealTime: "desc" },
      },
      symptoms: {
        orderBy: { onsetTime: "desc" },
      },
    },
  });
}

export async function getRecentSymptomLogs(userId: string, sevenDaysAgo: Date) {
  return prisma.symptomLog.findMany({
    where: {
      dailyLog: { userId },
      severity: { gte: 5 },
      onsetTime: { gte: sevenDaysAgo },
    },
    select: { dailyLogId: true },
  });
}

export async function getRecentDailyLogs(userId: string, sevenDaysAgo: Date) {
  return prisma.dailyLog.findMany({
    where: { userId, logDate: { gte: sevenDaysAgo } },
    select: { logDate: true, overallScore: true },
    orderBy: { logDate: "asc" },
  });
}

export async function getTopTriggers(triggerDailyLogIds: string[]) {
  if (triggerDailyLogIds.length === 0) return [];
  
  const triggerMeals = await prisma.mealLog.findMany({
    where: { dailyLogId: { in: triggerDailyLogIds } },
    select: { foodName: true },
  });

  const counts = triggerMeals.reduce((acc, meal) => {
    acc[meal.foodName] = (acc[meal.foodName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([foodName, count]) => ({ foodName, count }));
}

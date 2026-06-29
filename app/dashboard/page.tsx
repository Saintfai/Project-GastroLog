import { requireSession } from "@/lib/auth-utils";
import {
  getTodayLog,
  getRecentSymptomLogs,
  getRecentDailyLogs,
  getTopTriggers,
} from "@/lib/queries/dashboard";
import { buildSparkline, buildTimeline, getScoreLabel } from "@/lib/utils/score";

// UI Components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HealthScoreCard from "@/components/dashboard/HealthScoreCard";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import TopTriggers from "@/components/dashboard/TopTriggers";

export default async function DashboardPage() {
  // Ambil session secara aman
  const session = await requireSession();
  const { id: userId, name, image } = session.user;

  // Date boundaries for today
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Date boundaries for last 7 days
  const sevenDaysAgo = new Date(startOfToday);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Fetch Today's Log, High Symptom Logs (Last 7 days) & Recent scores in parallel
  const [todayLogRaw, highSymptomLogs, recentLogs] = await Promise.all([
    getTodayLog(userId, startOfToday),
    getRecentSymptomLogs(userId, sevenDaysAgo),
    getRecentDailyLogs(userId, sevenDaysAgo),
  ]);

  // Build a 7-day sparkline series (oldest → today), null where no log exists.
  const sparkline = buildSparkline(recentLogs, startOfToday);

  // Combine and sort today's activities (meals and symptoms)
  const timeline = buildTimeline(todayLogRaw);

  // Health Score UI setup
  const score = todayLogRaw?.overallScore || 0;
  const scoreLabel = getScoreLabel(score);

  // Fetch top triggers
  const triggerDailyLogIds = Array.from(new Set(highSymptomLogs.map((s) => s.dailyLogId)));
  const topTriggers = await getTopTriggers(triggerDailyLogIds);

  const mealCount = todayLogRaw?.meals.length ?? 0;
  const symptomCount = todayLogRaw?.symptoms.length ?? 0;

  return (
    <div
      className="min-h-screen antialiased pb-28 md:pb-0"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-on-surface)",
      }}
    >
      {/* ── DashboardHeader ── */}
      <DashboardHeader name={name} image={image} />

      {/* ── Main Content Canvas ── */}
      <main
        className="max-w-4xl mx-auto flex flex-col gap-8 mt-4"
        style={{
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
        }}
      >
        {/* ── 1. Health Score Card ── */}
        <HealthScoreCard
          score={score}
          scoreLabel={scoreLabel}
          sparkline={sparkline}
          mealCount={mealCount}
          symptomCount={symptomCount}
        />

        {/* ── 2. Aktivitas Hari Ini (Timeline) ── */}
        <ActivityTimeline timeline={timeline} />

        {/* ── 3. Pemicu Teratas Section ── */}
        <TopTriggers topTriggers={topTriggers} />
      </main>
    </div>
  );
}

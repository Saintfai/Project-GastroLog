import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DeleteEntryButton from "./DeleteEntryButton";
import { DesktopNavLinks } from "./DashboardNav";
import ThemeToggle from "../ThemeToggle";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id: userId, name, image } = session.user;
  const firstName = name?.split(" ")[0] || "Pengguna";

  // Date boundaries for today
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Date boundaries for last 7 days
  const sevenDaysAgo = new Date(startOfToday);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Fetch Today's Log & High Symptom Logs (Last 7 days) in parallel
  const [todayLog, highSymptomLogs, recentLogs] = await Promise.all([
    prisma.dailyLog.findUnique({
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
    }),
    prisma.symptomLog.findMany({
      where: {
        dailyLog: { userId },
        severity: { gte: 5 },
        onsetTime: { gte: sevenDaysAgo },
      },
      select: { dailyLogId: true },
    }),
    prisma.dailyLog.findMany({
      where: { userId, logDate: { gte: sevenDaysAgo } },
      select: { logDate: true, overallScore: true },
      orderBy: { logDate: "asc" },
    }),
  ]);

  // Build a 7-day sparkline series (oldest → today), null where no log exists.
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

  // Combine and sort today's activities (meals and symptoms)
  type TimelineItem = 
    | { type: "meal"; id: string; time: Date; data: any }
    | { type: "symptom"; id: string; time: Date; data: any };

  let timeline: TimelineItem[] = [];
  
  if (todayLog) {
    const meals: TimelineItem[] = todayLog.meals.map(m => ({ type: "meal", id: m.id, time: m.mealTime, data: m }));
    const symptoms: TimelineItem[] = todayLog.symptoms.map(s => ({ type: "symptom", id: s.id, time: s.onsetTime, data: s }));
    timeline = [...meals, ...symptoms].sort((a, b) => b.time.getTime() - a.time.getTime());
  }

  // Helper for formatting time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  // Health Score UI setup
  const score = todayLog?.overallScore || 0;
  let scoreLabel = "Belum ada data";
  if (score > 0) {
    if (score <= 3) scoreLabel = "Kurang baik";
    else if (score <= 6) scoreLabel = "Cukup";
    else if (score <= 9) scoreLabel = "Baik";
    else scoreLabel = "Sangat baik";
  }

  const triggerDailyLogIds = Array.from(new Set(highSymptomLogs.map(s => s.dailyLogId)));
  let topTriggers: { foodName: string; count: number }[] = [];
  if (triggerDailyLogIds.length > 0) {
    const triggerMeals = await prisma.mealLog.findMany({
      where: { dailyLogId: { in: triggerDailyLogIds } },
      select: { foodName: true },
    });

    const counts = triggerMeals.reduce((acc, meal) => {
      acc[meal.foodName] = (acc[meal.foodName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    topTriggers = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([foodName, count]) => ({ foodName, count }));
  }

  // ── Sparkline geometry (7 days) ──
  const sparkW = 240;
  const sparkH = 56;
  const sparkPad = 6;
  const sparkPoints = sparkline.map((d, i) => {
    const x = sparkPad + (i / (sparkline.length - 1)) * (sparkW - sparkPad * 2);
    const y =
      d.score === null
        ? null
        : sparkPad + (sparkH - sparkPad * 2) - (d.score / 10) * (sparkH - sparkPad * 2);
    return { x, y, score: d.score, isToday: d.isToday };
  });
  let sparkPath = "";
  let sparkStarted = false;
  for (const p of sparkPoints) {
    if (p.y === null) continue;
    sparkPath += sparkStarted ? ` L ${p.x} ${p.y}` : `M ${p.x} ${p.y}`;
    sparkStarted = true;
  }
  const hasSparkData = sparkPoints.some((p) => p.y !== null);

  const mealCount = todayLog?.meals.length ?? 0;
  const symptomCount = todayLog?.symptoms.length ?? 0;

  return (
    <div 
      className="min-h-screen antialiased pb-28 md:pb-0"
      style={{ 
        backgroundColor: "var(--color-background)", 
        color: "var(--color-on-surface)"
      }}
    >
      {/* ── TopAppBar ── */}
      <header className="w-full top-0 flex justify-between items-center py-4 sticky z-40"
        style={{
          backgroundColor: "var(--color-header-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)"
        }}
      >
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 group px-3 py-1.5 rounded-2xl hover:bg-[var(--color-surface-container-low)] active:scale-[0.98] transition-all"
        >
          {image ? (
            <img
              src={image}
              alt={`Foto profil ${name}`}
              className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:ring-2 group-hover:ring-[var(--color-primary-container)] transition-all"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:bg-[var(--color-primary-container)] group-hover:text-[var(--color-on-primary-container)]"
              style={{ backgroundColor: "var(--color-surface-variant)" }}
            >
              <span className="material-symbols-outlined" style={{ color: "var(--color-outline)" }}>person</span>
            </div>
          )}
          <div>
            <h1 className="font-bold flex items-center gap-0.5" style={{ fontSize: "22px", lineHeight: "28px", letterSpacing: "-0.03em", color: "var(--color-on-surface)" }}>
              GastroLog
              <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-4px] group-hover:translate-x-0" style={{ fontSize: "18px" }}>chevron_right</span>
            </h1>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-on-surface-variant)" }}>
              Halo, {firstName}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {/* Desktop Navigation Links */}
          <div className="mr-2">
            <DesktopNavLinks />
          </div>
          <ThemeToggle />
          <button className="flex items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-container-high)]"
            style={{ width: "var(--touch-target-min)", height: "var(--touch-target-min)" }}
          >
            <span className="material-symbols-outlined" style={{ color: "var(--color-on-surface-variant)" }}>notifications</span>
          </button>
        </div>
      </header>

      {/* ── Main Content Canvas ── */}
      <main className="max-w-4xl mx-auto flex flex-col gap-8 mt-4"
        style={{ 
          paddingLeft: "var(--spacing-lg)", 
          paddingRight: "var(--spacing-lg)" 
        }}
      >
        {/* ── 1. Health Score Card ── */}
        <section className="clinical-card p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3">
              <h2 style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-on-surface-variant)" }}>
                Skor Hari Ini
              </h2>
              <div className="flex items-baseline gap-1">
                <span className="stat-number font-bold" style={{ fontSize: "56px", color: "var(--color-on-surface)" }}>
                  {score > 0 ? score : "--"}
                </span>
                <span className="stat-number" style={{ fontSize: "20px", fontWeight: 600, color: "var(--color-on-surface-variant)" }}>/10</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: score > 0 ? "var(--color-primary)" : "var(--color-outline-variant)" }} />
                <span style={{ fontSize: "14px", fontWeight: 600, color: score > 0 ? "var(--color-primary)" : "var(--color-on-surface-variant)" }}>
                  {scoreLabel}
                </span>
              </div>
            </div>

            {/* 7-day sparkline */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-on-surface-variant)" }}>7 hari terakhir</span>
              <svg width={sparkW} height={sparkH} viewBox={`0 0 ${sparkW} ${sparkH}`} className="max-w-[200px] sm:max-w-[240px] w-full h-auto overflow-visible">
                {hasSparkData ? (
                  <>
                    {sparkPath && (
                      <path d={sparkPath} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                    {sparkPoints.map((p, i) =>
                      p.y === null ? null : (
                        <circle
                          key={i}
                          cx={p.x}
                          cy={p.y}
                          r={p.isToday ? 4 : 2.5}
                          fill={p.isToday ? "var(--color-primary)" : "var(--color-surface-bright)"}
                          stroke="var(--color-primary)"
                          strokeWidth={p.isToday ? 0 : 1.5}
                        />
                      )
                    )}
                  </>
                ) : (
                  <line x1={sparkPad} y1={sparkH / 2} x2={sparkW - sparkPad} y2={sparkH / 2} stroke="var(--color-outline-variant)" strokeWidth="1.5" strokeDasharray="3 4" />
                )}
              </svg>
            </div>
          </div>

          <div className="hairline" />

          <div className="flex items-center gap-5" style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--color-primary)" }}>restaurant</span>
              {mealCount} makan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: symptomCount > 0 ? "var(--color-error)" : "var(--color-primary)" }}>monitor_heart</span>
              {symptomCount} gejala
            </span>
            {score === 0 && (
              <span className="ml-auto" style={{ fontSize: "12px" }}>Isi jurnal untuk melihat skor.</span>
            )}
          </div>
        </section>

        {/* ── 2. Aktivitas Hari Ini (Timeline) ── */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-on-surface-variant)" }}>Aktivitas Hari Ini</h2>
            <Link href="/dashboard/history" style={{ fontSize: "13px", color: "var(--color-primary)", fontWeight: 600 }}>
              Lihat Semua
            </Link>
          </div>

          <div className="flex flex-col gap-4 relative">
            {timeline.length > 0 ? (
              timeline.map((item, index) => (
                <div key={item.id} className="relative timeline-item flex gap-4">
                  {/* Timeline Connector Line */}
                  <div className="timeline-connector" />
                  
                  {/* Icon */}
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10"
                    style={{ 
                      backgroundColor: item.type === "meal" ? "var(--color-secondary-container)" : "var(--color-error-container)",
                      color: item.type === "meal" ? "var(--color-on-secondary-container)" : "var(--color-on-error-container)",
                      border: "2px solid var(--color-background)"
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                      {item.type === "meal" ? "restaurant" : "sick"}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="log-card flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 style={{ fontSize: "16px", fontWeight: 500, color: "var(--color-on-surface)" }}>
                        {item.type === "meal" ? item.data.foodName : item.data.symptomType}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <span style={{ fontSize: "12px", color: "var(--color-on-surface-variant)", fontWeight: 500 }}>
                          {formatTime(item.time)}
                        </span>
                        <DeleteEntryButton
                          id={item.id}
                          type={item.type}
                          label={item.type === "meal" ? item.data.foodName : item.data.symptomType}
                        />
                      </div>
                    </div>

                    {item.type === "meal" ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
                          Porsi: {item.data.portionSize}
                        </span>
                        {item.data.foodItem && (
                          <span className={`risk-badge ${
                            item.data.foodItem.gerdRiskLevel === "LOW" ? "risk-badge-low" :
                            item.data.foodItem.gerdRiskLevel === "MEDIUM" ? "risk-badge-medium" : "risk-badge-high"
                          }`}>
                            {item.data.foodItem.gerdRiskLevel === "LOW" ? "Aman" :
                             item.data.foodItem.gerdRiskLevel === "MEDIUM" ? "Sedang" : "Berisiko"}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
                          Keparahan:
                        </span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-surface-variant)" }}>
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${(item.data.severity / 10) * 100}%`,
                              backgroundColor: item.data.severity >= 7 ? "var(--color-error)" :
                                             item.data.severity >= 4 ? "var(--color-warning)" : "var(--color-primary)"
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 600 }}>{item.data.severity}/10</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <span className="material-symbols-outlined mb-2" style={{ fontSize: "32px", opacity: 0.5 }}>
                  assignment
                </span>
                <p>Belum ada aktivitas hari ini.</p>
                <p style={{ fontSize: "13px", marginTop: "4px" }}>Catat makanan atau gejalamu sekarang.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── 3. Pemicu Teratas Section ── */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h2 style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-on-surface-variant)" }}>Pemicu Teratas · 7 Hari</h2>
            <span className="material-symbols-outlined" style={{ color: "var(--color-outline)", fontSize: "16px" }}>info</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}>
            {topTriggers.length > 0 ? (
              topTriggers.map((trigger, index) => (
                <div key={index} className="flex items-center gap-2 px-4 h-11 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--color-surface-bright)", border: "1px solid var(--color-outline-variant)" }}
                >
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-on-surface)" }}>
                    {trigger.foodName}
                  </span>
                  <span className="flex items-center justify-center rounded-full stat-number"
                    style={{ backgroundColor: "var(--color-accent-soft)", color: "var(--color-primary)", minWidth: "20px", height: "20px", padding: "0 6px", fontSize: "11px", fontWeight: 700 }}
                  >
                    {trigger.count}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-11 w-full rounded-full"
                style={{ border: "1px dashed var(--color-outline-variant)", color: "var(--color-outline)" }}
              >
                <span style={{ fontSize: "14px" }}>Belum ada data pemicu yang terdeteksi</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

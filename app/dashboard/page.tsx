import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DeleteEntryButton from "./DeleteEntryButton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const { name, image } = session.user;
  const firstName = name?.split(" ")[0] || "Pengguna";

  // Date boundaries for today
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Date boundaries for last 7 days
  const sevenDaysAgo = new Date(startOfToday);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Fetch Today's Log & High Symptom Logs (Last 7 days) in parallel
  const [todayLog, highSymptomLogs] = await Promise.all([
    prisma.dailyLog.findUnique({
      where: {
        userId_logDate: {
          userId: user.id,
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
        dailyLog: { userId: user.id },
        severity: { gte: 5 },
        onsetTime: { gte: sevenDaysAgo },
      },
      select: { dailyLogId: true },
    }),
  ]);

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
          backgroundColor: "var(--color-background)",
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
            <h1 className="font-bold flex items-center gap-0.5" style={{ fontSize: "24px", lineHeight: "30px", letterSpacing: "-0.02em", color: "var(--color-primary)" }}>
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
          <div className="hidden md:flex items-center gap-1 mr-4">
            <Link 
              href="/dashboard" 
              className="px-4 py-2 rounded-full text-sm font-semibold text-[var(--color-on-primary-container)] bg-[var(--color-primary-container)] transition-all"
            >
              Beranda
            </Link>
            <Link 
              href="/dashboard/history" 
              className="px-4 py-2 rounded-full text-sm font-semibold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-primary)] transition-all"
            >
              Riwayat
            </Link>
            <Link 
              href="/dashboard/analytics" 
              className="px-4 py-2 rounded-full text-sm font-semibold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-primary)] transition-all"
            >
              Analitik
            </Link>
            <Link 
              href="/dashboard/profile" 
              className="px-4 py-2 rounded-full text-sm font-semibold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-primary)] transition-all"
            >
              Profil
            </Link>
          </div>
          <button className="flex items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-container-low)]"
            style={{ width: "var(--touch-target-min)", height: "var(--touch-target-min)" }}
          >
            <span className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>notifications</span>
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
        <section className="rounded-3xl p-6 flex flex-col gap-3 relative overflow-hidden"
          style={{ 
            backgroundColor: "var(--color-surface-container)", 
            boxShadow: "var(--shadow-card)" 
          }}
        >
          {/* Decorative background element */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none"
            style={{ backgroundColor: "var(--color-primary-container)" }}
          />
          <h2 style={{ fontSize: "16px", color: "var(--color-on-surface-variant)" }}>Skor Kesehatan Hari Ini</h2>
          
          <div className="flex items-end gap-3">
            <div className="flex items-baseline gap-1">
              <span className="font-bold" style={{ fontSize: "40px", lineHeight: 1, color: "var(--color-primary)" }}>
                {score > 0 ? score : "--"}
              </span>
              <span style={{ fontSize: "18px", color: "var(--color-on-surface-variant)" }}>/10</span>
            </div>
            <div className="mb-1.5 px-3 py-1 rounded-lg" style={{ backgroundColor: "rgba(163, 177, 138, 0.2)", color: "var(--color-primary)", fontSize: "13px", fontWeight: 600 }}>
              {scoreLabel}
            </div>
          </div>

          <div className="score-progress-track mt-1">
            <div 
              className="score-progress-fill" 
              style={{ width: `${score > 0 ? (score / 10) * 100 : 0}%` }}
            />
          </div>
          
          {score === 0 && (
            <p className="mt-1" style={{ fontSize: "12px", color: "var(--color-on-surface-variant)" }}>
              Isi jurnal hari ini untuk melihat skor kesehatanmu.
            </p>
          )}
        </section>

        {/* ── 2. Aktivitas Hari Ini (Timeline) ── */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="font-medium" style={{ fontSize: "18px", color: "var(--color-on-surface)" }}>Aktivitas Hari Ini</h2>
            <Link href="/dashboard/history" style={{ fontSize: "14px", color: "var(--color-primary)", fontWeight: 500 }}>
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
                                             item.data.severity >= 4 ? "#eab308" : "var(--color-primary)"
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
            <h2 className="font-medium" style={{ fontSize: "16px", color: "var(--color-on-surface-variant)" }}>Pemicu Teratas (7 Hari)</h2>
            <span className="material-symbols-outlined" style={{ color: "var(--color-outline)", fontSize: "16px" }}>info</span>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}>
            {topTriggers.length > 0 ? (
              topTriggers.map((trigger, index) => (
                <div key={index} className="flex items-center gap-2 px-4 h-12 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--color-surface-container-high)", border: "1px solid var(--color-outline-variant)" }}
                >
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-on-surface)" }}>
                    {trigger.foodName}
                  </span>
                  <span className="flex items-center justify-center rounded-full" 
                    style={{ backgroundColor: "var(--color-error-container)", color: "var(--color-on-error-container)", width: "20px", height: "20px", fontSize: "11px", fontWeight: 600 }}
                  >
                    {trigger.count}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-12 w-full rounded-full"
                style={{ border: "1px dashed var(--color-outline-variant)", color: "var(--color-outline)" }}
              >
                <span style={{ fontSize: "14px" }}>Belum ada data pemicu yang terdeteksi</span>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ── FAB (Catat Jurnal) ── */}
      <div className="fixed bottom-24 left-0 w-full flex justify-center z-40 md:bottom-8">
        <Link href="/dashboard/journal" className="flex items-center gap-2 px-6 py-4 rounded-full active:scale-95 transition-all duration-200 hover:opacity-90"
          style={{ 
            backgroundColor: "var(--color-primary)", 
            color: "var(--color-on-primary)",
            boxShadow: "var(--shadow-card-hover)" 
          }}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>edit_document</span>
          <span className="font-medium" style={{ fontSize: "14px" }}>Catat Jurnal</span>
        </Link>
      </div>

      {/* ── BottomNavBar (Mobile Only) ── */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 shadow-sm rounded-t-xl md:hidden"
        style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
      >
        <Link href="/dashboard" className="flex flex-col items-center justify-center rounded-full px-3 py-1 transition-transform duration-150 active:scale-95"
          style={{ backgroundColor: "var(--color-secondary-container)", color: "var(--color-on-secondary-container)" }}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="mt-1 font-semibold" style={{ fontSize: "11px" }}>Home</span>
        </Link>
        <Link href="/dashboard/history" className="flex flex-col items-center justify-center px-3 py-1 rounded-full transition-colors"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          <span className="material-symbols-outlined">history</span>
          <span className="mt-1 font-semibold" style={{ fontSize: "11px" }}>Riwayat</span>
        </Link>
        <Link href="/dashboard/analytics" className="flex flex-col items-center justify-center px-3 py-1 rounded-full transition-colors"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          <span className="material-symbols-outlined">monitoring</span>
          <span className="mt-1 font-semibold" style={{ fontSize: "11px" }}>Analitik</span>
        </Link>
        <Link href="/dashboard/profile" className="flex flex-col items-center justify-center px-3 py-1 rounded-full transition-colors"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          <span className="material-symbols-outlined">person</span>
          <span className="mt-1 font-semibold" style={{ fontSize: "11px" }}>Profil</span>
        </Link>
      </nav>
    </div>
  );
}

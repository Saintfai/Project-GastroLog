import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

const RANGE_DAYS = 30;

const symptomLabels: Record<string, string> = {
  HEARTBURN: "Heartburn",
  REGURGITATION: "Regurgitasi",
  BLOATING: "Kembung",
  NAUSEA: "Mual",
  CHEST_PAIN: "Nyeri dada",
  OTHER: "Lainnya",
};

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function shortLabel(date: Date) {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export default async function AnalyticsPage() {
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

  const now = new Date();
  const todayUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const rangeStart = new Date(todayUtc);
  rangeStart.setUTCDate(rangeStart.getUTCDate() - (RANGE_DAYS - 1));

  const logs = await prisma.dailyLog.findMany({
    where: { userId: user.id, logDate: { gte: rangeStart } },
    include: {
      meals: { include: { foodItem: true } },
      symptoms: true,
    },
    orderBy: { logDate: "asc" },
  });

  // ── Build per-day score series for the last 30 days ──────────
  const logByDate = new Map<string, (typeof logs)[number]>();
  for (const log of logs) {
    logByDate.set(dateKey(log.logDate), log);
  }

  const days: { date: Date; score: number | null }[] = [];
  for (let i = RANGE_DAYS - 1; i >= 0; i--) {
    const d = new Date(todayUtc);
    d.setUTCDate(d.getUTCDate() - i);
    const log = logByDate.get(dateKey(d));
    days.push({ date: d, score: log ? log.overallScore : null });
  }

  // ── Summary statistics ───────────────────────────────────────
  const loggedDays = logs.length;
  const scored = logs.filter((l) => l.overallScore > 0);
  const avgScore =
    scored.length > 0
      ? scored.reduce((sum, l) => sum + l.overallScore, 0) / scored.length
      : null;
  const totalSymptoms = logs.reduce((sum, l) => sum + l.symptoms.length, 0);
  const symptomFreeDays = logs.filter((l) => l.symptoms.length === 0).length;

  // ── Symptom frequency by type ────────────────────────────────
  const symptomCounts = new Map<string, number>();
  for (const log of logs) {
    for (const s of log.symptoms) {
      symptomCounts.set(s.symptomType, (symptomCounts.get(s.symptomType) ?? 0) + 1);
    }
  }
  const symptomFrequency = Array.from(symptomCounts.entries())
    .map(([type, count]) => ({
      type,
      label: symptomLabels[type] ?? type,
      count,
    }))
    .sort((a, b) => b.count - a.count);
  const maxSymptomCount = symptomFrequency.reduce(
    (max, s) => Math.max(max, s.count),
    0
  );
  const mostCommonSymptom = symptomFrequency[0]?.label ?? null;

  // ── Trigger correlation: foods on high-symptom days (sev >= 5) ─
  const triggerCounts = new Map<
    string,
    { foodName: string; count: number; risk: string | null }
  >();
  for (const log of logs) {
    const hasHighSymptom = log.symptoms.some((s) => s.severity >= 5);
    if (!hasHighSymptom) continue;
    for (const meal of log.meals) {
      const existing = triggerCounts.get(meal.foodName);
      if (existing) {
        existing.count += 1;
      } else {
        triggerCounts.set(meal.foodName, {
          foodName: meal.foodName,
          count: 1,
          risk: meal.foodItem?.gerdRiskLevel ?? null,
        });
      }
    }
  }
  const topTriggers = Array.from(triggerCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // ── Score trend chart geometry (inline SVG) ──────────────────
  const W = 320;
  const H = 150;
  const PAD_L = 10;
  const PAD_R = 10;
  const PAD_T = 14;
  const PAD_B = 22;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const n = days.length;
  const xFor = (i: number) =>
    n <= 1 ? PAD_L + innerW / 2 : PAD_L + (i / (n - 1)) * innerW;
  const yFor = (score: number) => PAD_T + innerH - (score / 10) * innerH;

  const points = days
    .map((d, i) => (d.score != null ? { x: xFor(i), y: yFor(d.score) } : null))
    .filter((p): p is { x: number; y: number } => p !== null);
  const polyline = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const hasTrend = points.length > 0;

  const summaryCards = [
    {
      icon: "monitoring",
      label: "Rata-rata skor",
      value: avgScore != null ? avgScore.toFixed(1) : "--",
      suffix: avgScore != null ? "/10" : "",
    },
    {
      icon: "event_available",
      label: "Hari tercatat",
      value: String(loggedDays),
      suffix: ` / ${RANGE_DAYS}`,
    },
    {
      icon: "spa",
      label: "Hari tanpa gejala",
      value: String(symptomFreeDays),
      suffix: "",
    },
    {
      icon: "sick",
      label: "Total gejala",
      value: String(totalSymptoms),
      suffix: "",
    },
  ];

  return (
    <div
      className="min-h-screen antialiased pb-28"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-on-surface)",
      }}
    >
      <header
        className="sticky top-0 z-40 flex h-[72px] items-center"
        style={{
          backgroundColor: "rgba(247, 250, 245, 0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
        }}
      >
        <Link
          href="/dashboard"
          className="flex items-center justify-center rounded-full transition-opacity hover:opacity-80 active:scale-95"
          style={{
            width: "var(--touch-target-min)",
            height: "var(--touch-target-min)",
            color: "var(--color-on-surface)",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
            arrow_back
          </span>
        </Link>
        <div className="ml-2">
          <h1 style={{ fontSize: "24px", fontWeight: 600, lineHeight: "32px" }}>
            Analisis
          </h1>
          <p style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
            Tren {RANGE_DAYS} hari terakhir
          </p>
        </div>
      </header>

      <main
        className="mx-auto flex max-w-3xl flex-col gap-8"
        style={{
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
          paddingTop: "var(--spacing-lg)",
        }}
      >
        {loggedDays === 0 ? (
          <div className="empty-state">
            <span className="material-symbols-outlined mb-2" style={{ fontSize: "34px" }}>
              monitoring
            </span>
            <p>Belum ada data untuk dianalisis.</p>
            <Link
              href="/dashboard/journal"
              className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-3"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-on-primary)",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Catat jurnal pertama
            </Link>
          </div>
        ) : (
          <>
            {/* ── Summary stat cards ── */}
            <section className="grid grid-cols-2 gap-3">
              {summaryCards.map((card) => (
                <div
                  key={card.label}
                  className="flex flex-col gap-2 rounded-3xl p-4"
                  style={{
                    backgroundColor: "var(--color-surface-container)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "22px", color: "var(--color-primary)" }}
                  >
                    {card.icon}
                  </span>
                  <div className="flex items-baseline gap-0.5">
                    <span
                      className="font-bold"
                      style={{ fontSize: "26px", lineHeight: 1, color: "var(--color-on-surface)" }}
                    >
                      {card.value}
                    </span>
                    <span style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
                      {card.suffix}
                    </span>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--color-on-surface-variant)" }}>
                    {card.label}
                  </span>
                </div>
              ))}
            </section>

            {/* ── Score trend line chart ── */}
            <section className="flex flex-col gap-4">
              <h2 className="font-medium" style={{ fontSize: "18px" }}>
                Tren Skor Kesehatan
              </h2>
              <div
                className="rounded-3xl p-5"
                style={{
                  backgroundColor: "var(--color-surface-container)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                {hasTrend ? (
                  <svg
                    viewBox={`0 0 ${W} ${H}`}
                    width="100%"
                    role="img"
                    aria-label="Grafik tren skor kesehatan harian"
                    style={{ display: "block" }}
                  >
                    {[0, 5, 10].map((v) => (
                      <g key={v}>
                        <line
                          x1={PAD_L}
                          x2={W - PAD_R}
                          y1={yFor(v)}
                          y2={yFor(v)}
                          stroke="var(--color-outline-variant)"
                          strokeWidth={1}
                          strokeDasharray="3 4"
                        />
                        <text
                          x={0}
                          y={yFor(v) + 3}
                          fontSize={9}
                          fill="var(--color-on-surface-variant)"
                        >
                          {v}
                        </text>
                      </g>
                    ))}
                    {points.length > 1 && (
                      <polyline
                        points={polyline}
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth={2.5}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                    )}
                    {points.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={2.8}
                        fill="var(--color-primary)"
                      />
                    ))}
                    <text
                      x={PAD_L}
                      y={H - 6}
                      fontSize={9}
                      fill="var(--color-on-surface-variant)"
                    >
                      {shortLabel(days[0].date)}
                    </text>
                    <text
                      x={W - PAD_R}
                      y={H - 6}
                      fontSize={9}
                      textAnchor="end"
                      fill="var(--color-on-surface-variant)"
                    >
                      {shortLabel(days[days.length - 1].date)}
                    </text>
                  </svg>
                ) : (
                  <p
                    className="py-6 text-center"
                    style={{ fontSize: "14px", color: "var(--color-on-surface-variant)" }}
                  >
                    Belum cukup data untuk menampilkan tren.
                  </p>
                )}
              </div>
            </section>

            {/* ── Symptom frequency ── */}
            <section className="flex flex-col gap-4">
              <h2 className="font-medium" style={{ fontSize: "18px" }}>
                Frekuensi Gejala
              </h2>
              <div
                className="flex flex-col gap-4 rounded-3xl p-5"
                style={{
                  backgroundColor: "var(--color-surface-container)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                {symptomFrequency.length > 0 ? (
                  symptomFrequency.map((s) => (
                    <div key={s.type} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: "14px", fontWeight: 500 }}>{s.label}</span>
                        <span
                          style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}
                        >
                          {s.count}x
                        </span>
                      </div>
                      <div className="score-progress-track">
                        <div
                          className="score-progress-fill"
                          style={{
                            width: `${maxSymptomCount > 0 ? (s.count / maxSymptomCount) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p
                    className="py-2 text-center"
                    style={{ fontSize: "14px", color: "var(--color-on-surface-variant)" }}
                  >
                    Tidak ada gejala tercatat. Pertahankan! 🌿
                  </p>
                )}
              </div>
            </section>

            {/* ── Top triggers ── */}
            <section className="flex flex-col gap-4">
              <h2 className="font-medium" style={{ fontSize: "18px" }}>
                Dugaan Pemicu
              </h2>
              <p
                className="-mt-3"
                style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}
              >
                Makanan yang tercatat pada hari dengan gejala berat (intensitas ≥ 5).
              </p>
              <div
                className="flex flex-col gap-3 rounded-3xl p-5"
                style={{
                  backgroundColor: "var(--color-surface-container)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                {topTriggers.length > 0 ? (
                  topTriggers.map((trigger, index) => (
                    <div key={trigger.foodName} className="flex items-center gap-3">
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: "var(--color-surface-container-highest)",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "var(--color-on-surface-variant)",
                        }}
                      >
                        {index + 1}
                      </span>
                      <span className="flex-1" style={{ fontSize: "15px", fontWeight: 500 }}>
                        {trigger.foodName}
                      </span>
                      {trigger.risk && (
                        <span
                          className={`risk-badge ${
                            trigger.risk === "LOW"
                              ? "risk-badge-low"
                              : trigger.risk === "MEDIUM"
                              ? "risk-badge-medium"
                              : "risk-badge-high"
                          }`}
                        >
                          {trigger.risk === "LOW"
                            ? "Rendah"
                            : trigger.risk === "MEDIUM"
                            ? "Sedang"
                            : "Tinggi"}
                        </span>
                      )}
                      <span
                        className="flex h-6 min-w-6 items-center justify-center rounded-full px-1.5"
                        style={{
                          backgroundColor: "var(--color-error-container)",
                          color: "var(--color-on-error-container)",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {trigger.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p
                    className="py-2 text-center"
                    style={{ fontSize: "14px", color: "var(--color-on-surface-variant)" }}
                  >
                    Belum ada pemicu yang terdeteksi.
                  </p>
                )}
              </div>
              {mostCommonSymptom && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--color-on-surface-variant)",
                    fontStyle: "italic",
                  }}
                >
                  Gejala yang paling sering kamu alami: {mostCommonSymptom}.
                </p>
              )}
            </section>
          </>
        )}
      </main>

      {/* ── BottomNavBar (Mobile Only) ── */}
      <nav
        className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl px-4 pb-4 pt-2 shadow-sm md:hidden"
        style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
      >
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center rounded-full px-4 py-1"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          <span className="material-symbols-outlined">home</span>
          <span className="mt-1 font-semibold" style={{ fontSize: "12px" }}>
            Home
          </span>
        </Link>
        <Link
          href="/dashboard/analytics"
          className="flex flex-col items-center justify-center rounded-full px-4 py-1"
          style={{
            backgroundColor: "var(--color-secondary-container)",
            color: "var(--color-on-secondary-container)",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            monitoring
          </span>
          <span className="mt-1 font-semibold" style={{ fontSize: "12px" }}>
            Analisis
          </span>
        </Link>
        <Link
          href="/dashboard/history"
          className="flex flex-col items-center justify-center rounded-full px-4 py-1"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          <span className="material-symbols-outlined">history</span>
          <span className="mt-1 font-semibold" style={{ fontSize: "12px" }}>
            History
          </span>
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex flex-col items-center justify-center rounded-full px-4 py-1"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          <span className="material-symbols-outlined">person</span>
          <span className="mt-1 font-semibold" style={{ fontSize: "12px" }}>
            Profile
          </span>
        </Link>
      </nav>
    </div>
  );
}

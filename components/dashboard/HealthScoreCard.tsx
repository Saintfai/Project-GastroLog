interface HealthScoreCardProps {
  score: number;
  scoreLabel: string;
  sparkline: { score: number | null; isToday: boolean }[];
  mealCount: number;
  symptomCount: number;
}

export default function HealthScoreCard({
  score,
  scoreLabel,
  sparkline,
  mealCount,
  symptomCount,
}: HealthScoreCardProps) {
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

  return (
    <section className="clinical-card p-6 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <h2
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-on-surface-variant)",
            }}
          >
            Skor Hari Ini
          </h2>
          <div className="flex items-baseline gap-1">
            <span
              className="stat-number font-bold"
              style={{ fontSize: "56px", color: "var(--color-on-surface)" }}
            >
              {score > 0 ? score : "--"}
            </span>
            <span
              className="stat-number"
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--color-on-surface-variant)",
              }}
            >
              /10
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "9999px",
                backgroundColor: score > 0 ? "var(--color-primary)" : "var(--color-outline-variant)",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: score > 0 ? "var(--color-primary)" : "var(--color-on-surface-variant)",
              }}
            >
              {scoreLabel}
            </span>
          </div>
        </div>

        {/* 7-day sparkline */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--color-on-surface-variant)",
            }}
          >
            7 hari terakhir
          </span>
          <svg
            width={sparkW}
            height={sparkH}
            viewBox={`0 0 ${sparkW} ${sparkH}`}
            className="max-w-[200px] sm:max-w-[240px] w-full h-auto overflow-visible"
          >
            {hasSparkData ? (
              <>
                {sparkPath && (
                  <path
                    d={sparkPath}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
              <line
                x1={sparkPad}
                y1={sparkH / 2}
                x2={sparkW - sparkPad}
                y2={sparkH / 2}
                stroke="var(--color-outline-variant)"
                strokeWidth="1.5"
                strokeDasharray="3 4"
              />
            )}
          </svg>
        </div>
      </div>

      <div className="hairline" />

      <div
        className="flex items-center gap-5"
        style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}
      >
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--color-primary)" }}>
            restaurant
          </span>
          {mealCount} makan
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "18px",
              color: symptomCount > 0 ? "var(--color-error)" : "var(--color-primary)",
            }}
          >
            monitor_heart
          </span>
          {symptomCount} gejala
        </span>
        {score === 0 && <span className="ml-auto" style={{ fontSize: "12px" }}>Isi jurnal untuk melihat skor.</span>}
      </div>
    </section>
  );
}

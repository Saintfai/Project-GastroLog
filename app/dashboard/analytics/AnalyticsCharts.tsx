"use client";

import { useState, useTransition, useEffect } from "react";
import { getAnalyticsData } from "./actions";
import Link from "next/link";

interface AnalyticsChartsProps {
  initialData: Awaited<ReturnType<typeof getAnalyticsData>>;
}

const symptomLabels: Record<string, string> = {
  HEARTBURN: "Heartburn",
  REGURGITATION: "Regurgitasi",
  BLOATING: "Kembung",
  NAUSEA: "Mual",
  CHEST_PAIN: "Nyeri dada",
  OTHER: "Lainnya",
};

const stressLabels: Record<number, string> = {
  1: "Sangat Rendah",
  2: "Rendah",
  3: "Sedang",
  4: "Tinggi",
  5: "Sangat Tinggi",
};

export default function AnalyticsCharts({ initialData }: AnalyticsChartsProps) {
  const [data, setData] = useState(initialData);
  const [period, setPeriod] = useState(initialData.period);
  const [isPending, startTransition] = useTransition();

  // Sinkronisasi state lokal saat prop dari server component berubah (setelah revalidasi)
  useEffect(() => {
    setData(initialData);
    setPeriod(initialData.period);
  }, [initialData]);

  const handlePeriodChange = (newPeriod: number) => {
    if (newPeriod === period || isPending) return;
    setPeriod(newPeriod);
    startTransition(async () => {
      try {
        const newData = await getAnalyticsData(newPeriod);
        setData(newData);
      } catch (error) {
        console.error("Gagal memuat data analitik:", error);
      }
    });
  };

  const { trendData, symptomList, riskiestFoods, stressAnalysis, totalLogsCount } = data;

  // ── SVG Trend Chart Calculations ──
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // X coordinate helper
  const getX = (index: number) => {
    if (trendData.length <= 1) return paddingX + chartWidth / 2;
    return paddingX + (index / (trendData.length - 1)) * chartWidth;
  };

  // Y coordinate helper (Score range: 0-10, lower Y is higher score)
  const getY = (score: number) => {
    return paddingY + chartHeight - (score / 10) * chartHeight;
  };

  // Build SVG path
  let pathD = "";
  let isFirst = true;
  trendData.forEach((p, idx) => {
    if (p.score !== null) {
      const x = getX(idx);
      const y = getY(p.score);
      if (isFirst) {
        pathD += `M ${x} ${y}`;
        isFirst = false;
      } else {
        pathD += ` L ${x} ${y}`;
      }
    }
  });

  // Find max symptom count to scale the bars
  const maxSymptomCount = symptomList.length > 0 ? Math.max(...symptomList.map(s => s.count)) : 1;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Period Selector & Status ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>
            Visualisasi Data Kesehatan
          </h2>
          <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
            Menampilkan ringkasan catatan dari {period} hari terakhir
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isPending && (
            <span className="text-xs animate-pulse font-medium text-[var(--color-outline)]">
              Memuat...
            </span>
          )}
          <div 
            className="flex p-1 rounded-full" 
            style={{ backgroundColor: "var(--color-surface-container-high)" }}
          >
            {[7, 14, 30].map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                disabled={isPending}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  period === p
                    ? "bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] shadow-sm"
                    : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]"
                }`}
              >
                {p} Hari
              </button>
            ))}
          </div>
        </div>
      </div>

      {totalLogsCount === 0 ? (
        <div className="empty-state py-12">
          <span className="material-symbols-outlined mb-2 text-4xl" style={{ color: "var(--color-outline)" }}>
            monitoring
          </span>
          <h3 className="font-semibold text-base mb-1">Data Jurnal Kosong</h3>
          <p className="text-xs max-w-sm mb-4">
            Kamu belum memiliki catatan kesehatan dalam rentang waktu {period} hari terakhir.
          </p>
          <Link
            href="/dashboard/journal"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[var(--color-primary)] text-[var(--color-on-primary)] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm">edit_document</span>
            Catat Jurnal Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* ── 1. Trend Card ── */}
          <div className="analytics-card md:col-span-2">
            <div className="mb-4">
              <h3 className="font-semibold text-base flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xl" style={{ color: "var(--color-primary)" }}>show_chart</span>
                Tren Nilai Kesehatan Harian
              </h3>
              <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
                Fluktuasi skor kesehatan harianmu (skala 1-10)
              </p>
            </div>

            {/* SVG Chart Wrapper */}
            <div className="w-full overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              <div className="min-w-[600px] h-[220px]">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                  {/* Grid Lines & Labels */}
                  {[0, 2.5, 5, 7.5, 10].map((scoreValue) => {
                    const y = getY(scoreValue);
                    return (
                      <g key={scoreValue}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={svgWidth - paddingX}
                          y2={y}
                          stroke="var(--color-outline-variant)"
                          strokeWidth="0.8"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={paddingX - 10}
                          y={y + 4}
                          fontSize="10"
                          textAnchor="end"
                          className="fill-[var(--color-on-surface-variant)] font-medium"
                        >
                          {scoreValue}
                        </text>
                      </g>
                    );
                  })}

                  {/* SVG Line / Path */}
                  {pathD && (
                    <>
                      {/* Glow shadow line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-15"
                      />
                      {/* Main line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}

                  {/* Interactivity Dots & Labels */}
                  {trendData.map((p, idx) => {
                    const x = getX(idx);
                    // Render date labels on the X axis
                    const isLabelVisible =
                      period === 7 ||
                      (period === 14 && idx % 2 === 0) ||
                      (period === 30 && idx % 4 === 0) ||
                      idx === trendData.length - 1;

                    return (
                      <g key={idx}>
                        {isLabelVisible && (
                          <text
                            x={x}
                            y={svgHeight - 10}
                            fontSize="9"
                            textAnchor="middle"
                            className="fill-[var(--color-on-surface-variant)] font-semibold"
                          >
                            {p.dateLabel}
                          </text>
                        )}

                        {p.score !== null && (
                          <g className="group cursor-pointer">
                            {/* Larger hidden overlay for easier hover */}
                            <circle
                              cx={x}
                              cy={getY(p.score)}
                              r="12"
                              className="fill-transparent stroke-none"
                            />
                            {/* Visible point */}
                            <circle
                              cx={x}
                              cy={getY(p.score)}
                              r="5"
                              className="fill-[var(--color-primary)] stroke-[var(--color-surface-container)] stroke-2 group-hover:r-[7px] transition-all duration-150"
                            />
                            {/* Hover tooltip box */}
                            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                              <rect
                                x={x - 45}
                                y={getY(p.score) - 38}
                                width="90"
                                height="28"
                                rx="8"
                                fill="var(--color-on-surface)"
                                className="shadow-md"
                              />
                              <text
                                x={x}
                                y={getY(p.score) - 20}
                                fill="var(--color-surface)"
                                fontSize="11"
                                fontWeight="bold"
                                textAnchor="middle"
                              >
                                {p.dateLabel}: {p.score}/10
                              </text>
                            </g>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* ── 2. Symptom Distribution Card ── */}
          <div className="analytics-card">
            <div className="mb-4">
              <h3 className="font-semibold text-base flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xl" style={{ color: "var(--color-error)" }}>bar_chart</span>
                Distribusi Gejala
              </h3>
              <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
                Frekuensi kemunculan gejala dan rata-rata keparahannya
              </p>
            </div>

            {symptomList.length > 0 ? (
              <div className="flex flex-col gap-4">
                {symptomList.map((symptom, idx) => {
                  const percentage = (symptom.count / maxSymptomCount) * 100;
                  const label = symptomLabels[symptom.type] || symptom.type;

                  // Determine color based on average severity
                  let severityColor = "var(--color-primary)";
                  if (symptom.avgSeverity >= 7) severityColor = "var(--color-error)";
                  else if (symptom.avgSeverity >= 4) severityColor = "var(--color-warning)";

                  return (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-semibold">{label}</span>
                        <span className="text-[var(--color-on-surface-variant)]">
                          {symptom.count} kali <span className="mx-1">•</span> Rerata Keparahan: <strong style={{ color: severityColor }}>{symptom.avgSeverity}/10</strong>
                        </span>
                      </div>
                      <div className="chart-bar-bg">
                        <div
                          className="chart-bar-fill"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: severityColor,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 border border-dashed border-[var(--color-outline-variant)] rounded-2xl">
                <span className="material-symbols-outlined text-3xl mb-1 text-[var(--color-outline)]">check_circle</span>
                <p className="text-xs font-semibold text-[var(--color-primary)]">Tidak Ada Gejala</p>
                <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">Luar biasa! Tidak ada gejala yang tercatat.</p>
              </div>
            )}
          </div>

          {/* ── 3. Stress Pattern Card ── */}
          <div className="analytics-card">
            <div className="mb-4">
              <h3 className="font-semibold text-base flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xl" style={{ color: "var(--color-primary)" }}>psychology</span>
                Pola Stres & Kesehatan
              </h3>
              <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
                Bagaimana tingkat stres memengaruhi skor kesehatan harianmu
              </p>
            </div>

            <div className="flex items-end justify-between gap-2 h-44 px-2 pt-4">
              {stressAnalysis.map((item) => {
                const heightPercentage = item.logCount > 0 ? (item.avgScore / 10) * 100 : 0;
                
                // Color mapping for stress bars
                let barColor = "var(--color-primary)"; // sage green for low stress
                if (item.stressLevel >= 4) barColor = "var(--color-error)"; // reddish for high stress
                else if (item.stressLevel === 3) barColor = "var(--color-secondary)";

                return (
                  <div key={item.stressLevel} className="flex flex-col items-center gap-2 flex-1 group relative">
                    {/* Stress level vertical bar */}
                    <div className="stress-bar-container w-full">
                      <div className="stress-bar-track w-6 sm:w-8 hover:opacity-90 cursor-pointer">
                        <div
                          className="stress-bar-fill w-full"
                          style={{
                            height: `${heightPercentage}%`,
                            backgroundColor: barColor,
                          }}
                        />
                      </div>
                    </div>
                    {/* Stress Level X-Label */}
                    <div className="text-center">
                      <span className="text-xs font-bold">{item.stressLevel}</span>
                    </div>

                    {/* CSS Custom Tooltip Box on Hover */}
                    <div className="absolute bottom-full left-50% transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[var(--color-on-surface)] text-[var(--color-surface)] p-2 rounded-xl text-[10px] w-36 pointer-events-none shadow-md z-30">
                      <p className="font-bold border-b border-[rgba(255,255,255,0.15)] pb-0.5 mb-1">
                        Stres: {stressLabels[item.stressLevel]}
                      </p>
                      {item.logCount > 0 ? (
                        <>
                          <p>Rerata Skor: <strong>{item.avgScore}/10</strong></p>
                          <p>Rerata Gejala: <strong>{item.avgSymptomCount} per hari</strong></p>
                          <p className="text-[9px] opacity-75 mt-0.5">Berdasarkan {item.logCount} catatan</p>
                        </>
                      ) : (
                        <p className="opacity-75">Belum ada data</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stress level legend */}
            <div className="mt-4 flex justify-between items-center text-[10px] font-semibold text-[var(--color-on-surface-variant)] px-2">
              <span>← Relaks (1)</span>
              <span>Stres Tinggi (5) →</span>
            </div>
          </div>

          {/* ── 4. Food Triggers Correlation Card ── */}
          <div className="analytics-card md:col-span-2">
            <div className="mb-4">
              <h3 className="font-semibold text-base flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xl" style={{ color: "var(--color-error)" }}>warning</span>
                Korelasi Makanan & Gejala Parah
              </h3>
              <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
                Makanan yang sering dikonsumsi pada hari dengan keparahan gejala parah (severity ≥ 5)
              </p>
            </div>

            {riskiestFoods.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {riskiestFoods.map((food, idx) => (
                  <div
                    key={idx}
                    className="stat-mini-card flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm truncate" style={{ color: "var(--color-on-surface)" }}>
                        {food.name}
                      </h4>
                      <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                        Tercatat {food.count} kali saat gejala parah
                      </p>
                    </div>
                    <span
                      className={`risk-badge shrink-0 ${
                        food.gerdRiskLevel === "LOW"
                          ? "risk-badge-low"
                          : food.gerdRiskLevel === "MEDIUM"
                          ? "risk-badge-medium"
                          : "risk-badge-high"
                      }`}
                    >
                      {food.gerdRiskLevel === "LOW"
                        ? "Aman"
                        : food.gerdRiskLevel === "MEDIUM"
                        ? "Sedang"
                        : "Berisiko"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 border border-dashed border-[var(--color-outline-variant)] rounded-2xl">
                <span className="material-symbols-outlined text-3xl mb-1 text-[var(--color-primary)]">sentiment_satisfied</span>
                <p className="text-xs font-semibold text-[var(--color-primary)]">Belum Terdeteksi Korelasi</p>
                <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">
                  Belum ada makanan yang berkorelasi dengan gejala parah (severity ≥ 5).
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

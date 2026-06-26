import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAnalyticsData } from "./actions";
import AnalyticsCharts from "./AnalyticsCharts";
import { DesktopNavLinks } from "../DashboardNav";
import ThemeToggle from "../../ThemeToggle";

const symptomLabels: Record<string, string> = {
  HEARTBURN: "Heartburn",
  REGURGITATION: "Regurgitasi",
  BLOATING: "Kembung",
  NAUSEA: "Mual",
  CHEST_PAIN: "Nyeri dada",
  OTHER: "Lainnya",
  "Tidak ada": "Tidak ada",
};

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

  // Load data awal untuk rentang waktu default (7 hari)
  const initialData = await getAnalyticsData(7, user.id);
  const { summary } = initialData;

  const translatedSymptom = symptomLabels[summary.mostFrequentSymptom] || summary.mostFrequentSymptom;

  return (
    <div
      className="min-h-screen antialiased pb-28"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-on-surface)",
      }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40 flex h-[72px] items-center"
        style={{
          backgroundColor: "var(--color-header-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-outline-variant)",
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
        <div className="ml-2 flex-1 flex justify-between items-center">
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 600, lineHeight: "32px" }}>
              Analitik
            </h1>
            <p style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
              Ringkasan statistik & tren kesehatan
            </p>
          </div>
          {/* Desktop Navigation Links */}
          <div className="flex items-center gap-2">
            <DesktopNavLinks />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main
        className="mx-auto flex max-w-4xl flex-col gap-6"
        style={{
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
          paddingTop: "var(--spacing-lg)",
        }}
      >
        {/* ── Summary Cards Grid ── */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {/* Card 1: Rata-rata Skor */}
          <div className="analytics-card flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold" style={{ color: "var(--color-on-surface-variant)" }}>
                Rerata Skor
              </span>
              <span className="material-symbols-outlined text-[var(--color-primary)]" style={{ fontSize: "20px" }}>
                favorite
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold mt-1" style={{ color: "var(--color-primary)" }}>
                {summary.avgHealthScore > 0 ? `${summary.avgHealthScore}` : "--"}
                <span className="text-xs font-semibold text-[var(--color-on-surface-variant)] ml-0.5">/10</span>
              </p>
              <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">
                Kondisi lambung
              </p>
            </div>
          </div>

          {/* Card 2: Hari Aktif */}
          <div className="analytics-card flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold" style={{ color: "var(--color-on-surface-variant)" }}>
                Hari Aktif
              </span>
              <span className="material-symbols-outlined text-[var(--color-primary)]" style={{ fontSize: "20px" }}>
                calendar_today
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold mt-1" style={{ color: "var(--color-on-surface)" }}>
                {summary.activeDays}
                <span className="text-xs font-semibold text-[var(--color-on-surface-variant)] ml-0.5">Hari</span>
              </p>
              <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">
                Catatan terkumpul
              </p>
            </div>
          </div>

          {/* Card 3: Gejala Terbanyak */}
          <div className="analytics-card flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold" style={{ color: "var(--color-on-surface-variant)" }}>
                Gejala Utama
              </span>
              <span className="material-symbols-outlined text-[var(--color-error)]" style={{ fontSize: "20px" }}>
                sick
              </span>
            </div>
            <div>
              <p className="text-base font-bold mt-1 truncate" style={{ color: "var(--color-on-surface)" }}>
                {translatedSymptom}
              </p>
              <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">
                Paling sering muncul
              </p>
            </div>
          </div>

          {/* Card 4: Makanan Berisiko */}
          <div className="analytics-card flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold" style={{ color: "var(--color-on-surface-variant)" }}>
                Pemicu Utama
              </span>
              <span className="material-symbols-outlined text-red-500" style={{ fontSize: "20px" }}>
                warning
              </span>
            </div>
            <div>
              <p className="text-base font-bold mt-1 truncate" style={{ color: "var(--color-on-surface)" }}>
                {summary.riskiestFood}
              </p>
              <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">
                Saat gejala parah
              </p>
            </div>
          </div>
        </section>

        {/* ── Charts Visualization Component ── */}
        <AnalyticsCharts initialData={initialData} />
      </main>
    </div>
  );
}

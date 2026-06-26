import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { DesktopNavLinks } from "../DashboardNav";
import ThemeToggle from "../../ThemeToggle";

const symptomLabels: Record<string, string> = {
  HEARTBURN: "Heartburn",
  REGURGITATION: "Regurgitasi",
  BLOATING: "Kembung",
  NAUSEA: "Mual",
  CHEST_PAIN: "Nyeri dada",
  OTHER: "Lainnya",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function HistoryPage() {
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

  const logs = await prisma.dailyLog.findMany({
    where: { userId: user.id },
    include: {
      meals: {
        include: { foodItem: true },
        orderBy: { mealTime: "asc" },
      },
      symptoms: {
        orderBy: { onsetTime: "asc" },
      },
      activities: true,
    },
    orderBy: { logDate: "desc" },
    take: 30,
  });

  return (
    <div
      className="min-h-screen antialiased pb-28"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-on-surface)",
      }}
    >
      <header
        className="sticky top-0 z-40 flex h-[72px] items-center justify-between"
        style={{
          backgroundColor: "var(--color-header-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-outline-variant)",
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
        }}
      >
        <div className="flex items-center">
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
            <h1 style={{ fontSize: "22px", fontWeight: 700, lineHeight: "28px", letterSpacing: "-0.02em" }}>
              Riwayat
            </h1>
            <p style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
              30 catatan terbaru
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DesktopNavLinks />
          <ThemeToggle />
        </div>
      </header>

      <main
        className="mx-auto flex max-w-3xl flex-col gap-4"
        style={{
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
          paddingTop: "var(--spacing-lg)",
        }}
      >
        {logs.length > 0 ? (
          logs.map((log) => {
            const averageSymptom =
              log.symptoms.length > 0
                ? Math.round(
                    log.symptoms.reduce((sum, item) => sum + item.severity, 0) /
                      log.symptoms.length
                  )
                : null;

            return (
              <article key={log.id} className="clinical-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.01em" }}>
                      {formatDate(log.logDate)}
                    </h2>
                    <p
                      className="mt-1"
                      style={{
                        fontSize: "13px",
                        color: "var(--color-on-surface-variant)",
                      }}
                    >
                      {log.meals.length} makanan · {log.symptoms.length} gejala
                    </p>
                  </div>
                  <div className="flex min-w-16 flex-col items-center">
                    <span
                      className="stat-number"
                      style={{
                        fontSize: "32px",
                        fontWeight: 700,
                        color: "var(--color-primary)",
                      }}
                    >
                      {log.overallScore}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--color-on-surface-variant)",
                      }}
                    >
                      skor
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <section
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: "var(--color-surface-container-low)" }}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        restaurant
                      </span>
                      <h3 style={{ fontSize: "14px", fontWeight: 600 }}>Makanan</h3>
                    </div>
                    {log.meals.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {log.meals.slice(0, 3).map((meal) => (
                          <div key={meal.id} className="flex items-center justify-between gap-3">
                            <span style={{ fontSize: "14px" }}>{meal.foodName}</span>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "var(--color-on-surface-variant)",
                              }}
                            >
                              {formatTime(meal.mealTime)}
                            </span>
                          </div>
                        ))}
                        {log.meals.length > 3 && (
                          <p
                            style={{
                              fontSize: "12px",
                              color: "var(--color-on-surface-variant)",
                            }}
                          >
                            +{log.meals.length - 3} makanan lainnya
                          </p>
                        )}
                      </div>
                    ) : (
                      <p style={{ fontSize: "14px", color: "var(--color-on-surface-variant)" }}>
                        Belum ada makanan.
                      </p>
                    )}
                  </section>

                  <section
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: "var(--color-surface-container-low)" }}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        sick
                      </span>
                      <h3 style={{ fontSize: "14px", fontWeight: 600 }}>Gejala</h3>
                    </div>
                    {log.symptoms.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {log.symptoms.slice(0, 3).map((symptom) => (
                          <div key={symptom.id} className="flex items-center justify-between gap-3">
                            <span style={{ fontSize: "14px" }}>
                              {symptomLabels[symptom.symptomType] ?? symptom.symptomType}
                            </span>
                            <span
                              className="rounded-full px-2 py-1"
                              style={{
                                backgroundColor: "var(--color-error-container)",
                                color: "var(--color-on-error-container)",
                                fontSize: "12px",
                                fontWeight: 600,
                              }}
                            >
                              {symptom.severity}/10
                            </span>
                          </div>
                        ))}
                        {averageSymptom !== null && (
                          <p
                            style={{
                              fontSize: "12px",
                              color: "var(--color-on-surface-variant)",
                            }}
                          >
                            Rata-rata keparahan: {averageSymptom}/10
                          </p>
                        )}
                      </div>
                    ) : (
                      <p style={{ fontSize: "14px", color: "var(--color-on-surface-variant)" }}>
                        Tidak ada gejala dicatat.
                      </p>
                    )}
                  </section>
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty-state">
            <span className="material-symbols-outlined mb-2" style={{ fontSize: "34px" }}>
              history
            </span>
            <p>Belum ada riwayat jurnal.</p>
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
        )}
      </main>
    </div>
  );
}

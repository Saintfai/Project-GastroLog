import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { DesktopNavLinks } from "../DashboardNav";
import ThemeToggle from "../../ThemeToggle";

const severityLabels: Record<string, string> = {
  MILD: "Ringan",
  MODERATE: "Sedang",
  SEVERE: "Berat",
};

const genderLabels: Record<string, string> = {
  MALE: "Laki-laki",
  FEMALE: "Perempuan",
  OTHER: "Lainnya",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [user, latestLog] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        _count: {
          select: {
            dailyLogs: true,
            notifications: true,
          },
        },
      },
    }),
    prisma.dailyLog.findFirst({
      where: { userId },
      orderBy: { logDate: "desc" },
      select: { logDate: true, overallScore: true },
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

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
              Profil
            </h1>
            <p style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
              Akun dan ringkasan penggunaan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DesktopNavLinks />
          <ThemeToggle />
        </div>
      </header>

      <main
        className="mx-auto flex max-w-2xl flex-col gap-5"
        style={{
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
          paddingTop: "var(--spacing-lg)",
        }}
      >
        <section className="clinical-card p-6">
          <div className="flex items-center gap-4">
            {user.image ? (
              <img
                src={user.image}
                alt={`Foto profil ${user.name ?? "pengguna"}`}
                className="h-16 w-16 rounded-full object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--color-surface-variant)" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: "var(--color-outline)", fontSize: "32px" }}
                >
                  person
                </span>
              </div>
            )}

            <div className="min-w-0">
              <h2
                className="truncate"
                style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-on-surface)", letterSpacing: "-0.01em" }}
              >
                {user.name ?? "Pengguna GastroLog"}
              </h2>
              <p
                className="truncate"
                style={{ fontSize: "14px", color: "var(--color-on-surface-variant)" }}
              >
                {user.email}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <StatBox label="Total jurnal" value={user._count.dailyLogs} />
          <StatBox label="Reminder aktif" value={user._count.notifications} />
          <StatBox label="Skor terakhir" value={latestLog ? latestLog.overallScore : "--"} />
        </section>

        <section className="clinical-card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Data GERD</h2>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-3 py-1"
                style={{
                  backgroundColor: "var(--color-secondary-container)",
                  color: "var(--color-on-secondary-container)",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Profil dasar
              </span>
              {user.profile && (
                <Link
                  href="/dashboard/profile/edit"
                  className="flex items-center gap-0.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors active:scale-95 hover:opacity-90"
                  style={{
                    backgroundColor: "var(--color-primary-container)",
                    color: "var(--color-on-primary-container)",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>edit</span>
                  Edit
                </Link>
              )}
            </div>
          </div>

          {user.profile ? (
            <div className="grid gap-3">
              <ProfileRow label="Usia" value={user.profile.age ? `${user.profile.age} tahun` : "Belum diisi"} />
              <ProfileRow
                label="Gender"
                value={
                  user.profile.gender
                    ? genderLabels[user.profile.gender] ?? user.profile.gender
                    : "Belum diisi"
                }
              />
              <ProfileRow
                label="Keparahan GERD"
                value={
                  user.profile.gerdSeverity
                    ? severityLabels[user.profile.gerdSeverity] ?? user.profile.gerdSeverity
                    : "Belum diisi"
                }
              />
              <ProfileRow
                label="Durasi GERD"
                value={
                  user.profile.gerdDurationMonths
                    ? `${user.profile.gerdDurationMonths} bulan`
                    : "Belum diisi"
                }
              />
              <ProfileRow
                label="Obat"
                value={
                  user.profile.medications.length > 0
                    ? user.profile.medications.join(", ")
                    : "Belum diisi"
                }
              />
              <ProfileRow
                label="Pantangan"
                value={
                  user.profile.foodRestrictions.length > 0
                    ? user.profile.foodRestrictions.join(", ")
                    : "Belum diisi"
                }
              />
            </div>
          ) : (
            <div className="empty-state">
              <span className="material-symbols-outlined mb-2" style={{ fontSize: "34px" }}>
                clinical_notes
              </span>
              <p>Profil GERD belum dibuat.</p>
              <Link
                href="/dashboard/profile/edit"
                className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 active:scale-95 transition-all hover:opacity-90"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-on-primary)",
                  fontSize: "13px",
                  fontWeight: 600,
                  boxShadow: "0 2px 10px rgba(86, 99, 66, 0.15)",
                }}
              >
                Buat Profil
              </Link>
            </div>
          )}
        </section>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{
              backgroundColor: "var(--color-error-container)",
              color: "var(--color-on-error-container)",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              logout
            </span>
            Keluar
          </button>
        </form>
      </main>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: "var(--color-surface-bright)",
        border: "1px solid var(--color-outline-variant)",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--color-on-surface-variant)",
        }}
      >
        {label}
      </span>
      <p className="stat-number mt-1.5" style={{ fontSize: "32px", fontWeight: 700, color: "var(--color-on-surface)" }}>
        {value}
      </p>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-start justify-between gap-4 rounded-2xl px-4 py-3"
      style={{ backgroundColor: "var(--color-surface-container-low)" }}
    >
      <span style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
        {label}
      </span>
      <span className="text-right" style={{ fontSize: "14px", fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

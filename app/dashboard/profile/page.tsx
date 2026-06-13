import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

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

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      profile: true,
      _count: {
        select: {
          dailyLogs: true,
          notifications: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const latestLog = await prisma.dailyLog.findFirst({
    where: { userId: user.id },
    orderBy: { logDate: "desc" },
    select: { logDate: true, overallScore: true },
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
            Profil
          </h1>
          <p style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
            Akun dan ringkasan penggunaan
          </p>
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
        <section
          className="rounded-3xl p-6"
          style={{
            backgroundColor: "var(--color-surface-container)",
            boxShadow: "var(--shadow-card)",
          }}
        >
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
                style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-primary)" }}
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
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
          >
            <span style={{ fontSize: "12px", color: "var(--color-on-surface-variant)" }}>
              Total jurnal
            </span>
            <p className="mt-1" style={{ fontSize: "28px", fontWeight: 700 }}>
              {user._count.dailyLogs}
            </p>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
          >
            <span style={{ fontSize: "12px", color: "var(--color-on-surface-variant)" }}>
              Reminder aktif
            </span>
            <p className="mt-1" style={{ fontSize: "28px", fontWeight: 700 }}>
              {user._count.notifications}
            </p>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
          >
            <span style={{ fontSize: "12px", color: "var(--color-on-surface-variant)" }}>
              Skor terakhir
            </span>
            <p className="mt-1" style={{ fontSize: "28px", fontWeight: 700 }}>
              {latestLog ? latestLog.overallScore : "--"}
            </p>
          </div>
        </section>

        <section
          className="rounded-3xl p-5"
          style={{
            backgroundColor: "var(--color-surface-container)",
            boxShadow: "var(--shadow-card)",
          }}
        >
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
          style={{
            backgroundColor: "var(--color-secondary-container)",
            color: "var(--color-on-secondary-container)",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            person
          </span>
          <span className="mt-1 font-semibold" style={{ fontSize: "12px" }}>
            Profile
          </span>
        </Link>
      </nav>
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

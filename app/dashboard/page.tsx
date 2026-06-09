import Link from "next/link";

export default function DashboardPage() {
  return (
    <div 
      className="min-h-screen antialiased pb-28 md:pb-0"
      style={{ 
        backgroundColor: "var(--color-background)", 
        color: "var(--color-on-surface)"
      }}
    >
      {/* ── TopAppBar (Mobile & Web) ── */}
      <header className="w-full top-0 flex justify-between items-center py-4 sticky z-40"
        style={{ 
          backgroundColor: "var(--color-background)",
          paddingLeft: "var(--spacing-lg)", 
          paddingRight: "var(--spacing-lg)" 
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--color-surface-variant)" }}
          >
            <span className="material-symbols-outlined" style={{ color: "var(--color-outline)" }}>person</span>
          </div>
          <div>
            <h1 className="font-bold" style={{ fontSize: "26px", lineHeight: "32px", letterSpacing: "-0.02em", color: "var(--color-primary)" }}>
              GastroLog
            </h1>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-on-surface-variant)" }}>
              Halo, Pengguna
            </p>
          </div>
        </div>
        <button className="flex items-center justify-center rounded-full transition-colors"
          style={{ width: "var(--touch-target-min)", height: "var(--touch-target-min)" }}
        >
          <span className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>notifications</span>
        </button>
      </header>

      {/* ── Main Content Canvas ── */}
      <main className="max-w-4xl mx-auto flex flex-col gap-8 mt-4"
        style={{ 
          paddingLeft: "var(--spacing-lg)", 
          paddingRight: "var(--spacing-lg)" 
        }}
      >
        {/* Health Score Card */}
        <section className="rounded-3xl p-6 flex flex-col gap-2 relative overflow-hidden"
          style={{ 
            backgroundColor: "var(--color-surface-container)", 
            boxShadow: "var(--shadow-card)" 
          }}
        >
          {/* Decorative background element */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none"
            style={{ backgroundColor: "var(--color-primary-container)" }}
          ></div>
          <h2 style={{ fontSize: "16px", color: "var(--color-on-surface-variant)" }}>Skor Kesehatan Hari Ini</h2>
          <div className="flex items-baseline gap-2">
            <span className="font-bold" style={{ fontSize: "32px", color: "var(--color-primary)" }}>--</span>
            <span style={{ fontSize: "16px", color: "var(--color-on-surface-variant)" }}>/10</span>
          </div>
          <p className="mt-2" style={{ fontSize: "12px", color: "var(--color-on-surface-variant)" }}>
            Belum ada data hari ini. Mulai catat jurnalmu.
          </p>
        </section>

        {/* Trend Chart Card Placeholder */}
        <section className="rounded-3xl p-6 flex flex-col gap-4"
          style={{ 
            backgroundColor: "var(--color-surface-container)", 
            boxShadow: "var(--shadow-card)" 
          }}
        >
          <div className="flex justify-between items-center">
            <h2 className="font-medium" style={{ fontSize: "16px", color: "var(--color-on-surface-variant)" }}>Tren Gejala 7 Hari Terakhir</h2>
            <span className="material-symbols-outlined" style={{ color: "var(--color-outline)" }}>trending_down</span>
          </div>
          <div className="h-32 w-full flex items-center justify-center rounded-lg"
            style={{ border: "1px dashed var(--color-outline-variant)" }}
          >
            <span style={{ fontSize: "14px", color: "var(--color-outline)" }}>Grafik Tren (Placeholder)</span>
          </div>
        </section>

        {/* Top Triggers Section Placeholder */}
        <section className="flex flex-col gap-3">
          <h2 className="font-medium" style={{ fontSize: "16px", color: "var(--color-on-surface-variant)" }}>Pemicu Teratas</h2>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <div className="flex items-center justify-center h-12 w-full rounded-full"
              style={{ border: "1px dashed var(--color-outline-variant)", color: "var(--color-outline)" }}
            >
              <span style={{ fontSize: "14px" }}>Belum ada data pemicu</span>
            </div>
          </div>
        </section>
      </main>

      {/* ── FAB (Catat Jurnal) ── */}
      <div className="fixed bottom-24 left-0 w-full flex justify-center z-40 md:bottom-8">
        <button className="flex items-center gap-2 px-6 py-4 rounded-full active:scale-95 transition-all duration-200 hover:opacity-90"
          style={{ 
            backgroundColor: "var(--color-primary)", 
            color: "var(--color-on-primary)",
            boxShadow: "var(--shadow-card-hover)" 
          }}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>edit_document</span>
          <span className="font-medium" style={{ fontSize: "14px" }}>Catat Jurnal</span>
        </button>
      </div>

      {/* ── BottomNavBar (Mobile Only) ── */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 shadow-sm rounded-t-xl md:hidden"
        style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
      >
        {/* Active: Home */}
        <Link href="/dashboard" className="flex flex-col items-center justify-center rounded-full px-4 py-1 transition-transform duration-150 active:scale-95"
          style={{ backgroundColor: "var(--color-secondary-container)", color: "var(--color-on-secondary-container)" }}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="mt-1 font-semibold" style={{ fontSize: "12px" }}>Home</span>
        </Link>
        {/* Inactive: History */}
        <Link href="#" className="flex flex-col items-center justify-center px-4 py-1 rounded-full transition-colors"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          <span className="material-symbols-outlined">history</span>
          <span className="mt-1 font-semibold" style={{ fontSize: "12px" }}>History</span>
        </Link>
        {/* Inactive: Profile */}
        <Link href="#" className="flex flex-col items-center justify-center px-4 py-1 rounded-full transition-colors"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          <span className="material-symbols-outlined">person</span>
          <span className="mt-1 font-semibold" style={{ fontSize: "12px" }}>Profile</span>
        </Link>
      </nav>
    </div>
  );
}
import React from "react";

export default function DashboardLoading() {
  return (
    <div
      className="min-h-screen antialiased pb-28 md:pb-0"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-on-surface)",
      }}
    >
      {/* ── TopAppBar Skeleton ── */}
      <header
        className="w-full top-0 flex justify-between items-center py-4 sticky z-40"
        style={{
          backgroundColor: "var(--color-background)",
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
        }}
      >
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-[var(--color-surface-variant)] animate-pulse" />
          <div className="flex flex-col gap-1.5">
            <div className="h-5 w-24 rounded bg-[var(--color-surface-variant)] animate-pulse" />
            <div className="h-3 w-16 rounded bg-[var(--color-surface-variant)] animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2 mr-4">
            <div className="h-8 w-20 rounded-full bg-[var(--color-surface-variant)] animate-pulse" />
            <div className="h-8 w-20 rounded-full bg-[var(--color-surface-variant)] animate-pulse" />
            <div className="h-8 w-20 rounded-full bg-[var(--color-surface-variant)] animate-pulse" />
            <div className="h-8 w-20 rounded-full bg-[var(--color-surface-variant)] animate-pulse" />
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--color-surface-variant)] animate-pulse" />
        </div>
      </header>

      {/* ── Main Content Canvas ── */}
      <main
        className="max-w-4xl mx-auto flex flex-col gap-8 mt-4"
        style={{
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
        }}
      >
        {/* ── 1. Health Score Card Skeleton ── */}
        <section
          className="rounded-3xl p-6 flex flex-col gap-3 relative overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface-container)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="h-4 w-40 rounded bg-[var(--color-surface-variant)] animate-pulse" />
          <div className="flex items-end gap-3 my-2">
            <div className="h-10 w-16 rounded bg-[var(--color-surface-variant)] animate-pulse" />
            <div className="h-6 w-24 rounded bg-[var(--color-surface-variant)] animate-pulse" />
          </div>
          <div className="h-2 w-full rounded bg-[var(--color-surface-variant)] overflow-hidden">
            <div className="h-full bg-[var(--color-outline-variant)] animate-pulse" style={{ width: "40%" }} />
          </div>
        </section>

        {/* ── 2. Aktivitas Hari Ini (Timeline) Skeleton ── */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="h-5 w-36 rounded bg-[var(--color-surface-variant)] animate-pulse" />
            <div className="h-4 w-16 rounded bg-[var(--color-surface-variant)] animate-pulse" />
          </div>

          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface-variant)] animate-pulse shrink-0" />
                <div
                  className="flex-1 rounded-2xl p-4 flex flex-col gap-2"
                  style={{ backgroundColor: "var(--color-surface-container)" }}
                >
                  <div className="flex justify-between items-start">
                    <div className="h-4 w-28 rounded bg-[var(--color-surface-variant)] animate-pulse" />
                    <div className="h-3 w-10 rounded bg-[var(--color-surface-variant)] animate-pulse" />
                  </div>
                  <div className="h-3 w-40 rounded bg-[var(--color-surface-variant)] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Pemicu Teratas Section Skeleton ── */}
        <section className="flex flex-col gap-3">
          <div className="h-4 w-36 rounded bg-[var(--color-surface-variant)] animate-pulse" />
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="px-4 h-12 rounded-full bg-[var(--color-surface-container)] flex items-center gap-2 border border-[var(--color-outline-variant)] animate-pulse shrink-0 w-32"
              />
            ))}
          </div>
        </section>
      </main>

      {/* ── BottomNavBar (Mobile Only) ── */}
      <nav
        className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 shadow-sm rounded-t-xl md:hidden"
        style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
      >
        <div className="flex flex-col items-center justify-center px-3 py-1 rounded-full w-12 h-10 bg-[var(--color-surface-variant)] animate-pulse" />
        <div className="flex flex-col items-center justify-center px-3 py-1 rounded-full w-12 h-10 bg-[var(--color-surface-variant)] animate-pulse" />
        <div className="flex flex-col items-center justify-center px-3 py-1 rounded-full w-12 h-10 bg-[var(--color-surface-variant)] animate-pulse" />
        <div className="flex flex-col items-center justify-center px-3 py-1 rounded-full w-12 h-10 bg-[var(--color-surface-variant)] animate-pulse" />
      </nav>
    </div>
  );
}

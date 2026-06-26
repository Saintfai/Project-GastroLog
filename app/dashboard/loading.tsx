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
          backgroundColor: "var(--color-header-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
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
        <section className="clinical-card p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="h-3 w-24 rounded bg-[var(--color-surface-variant)] animate-pulse" />
              <div className="h-14 w-24 rounded bg-[var(--color-surface-variant)] animate-pulse" />
              <div className="h-4 w-20 rounded bg-[var(--color-surface-variant)] animate-pulse" />
            </div>
            <div className="h-14 w-40 rounded-xl bg-[var(--color-surface-variant)] animate-pulse" />
          </div>
          <div className="hairline" />
          <div className="h-4 w-48 rounded bg-[var(--color-surface-variant)] animate-pulse" />
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
                  className="flex-1 rounded-lg p-4 flex flex-col gap-2 border"
                  style={{ backgroundColor: "var(--color-surface-bright)", borderColor: "var(--color-outline-variant)" }}
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
          <div className="h-3 w-36 rounded bg-[var(--color-surface-variant)] animate-pulse" />
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="px-4 h-11 rounded-full bg-[var(--color-surface-bright)] flex items-center gap-2 border border-[var(--color-outline-variant)] animate-pulse shrink-0 w-32"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

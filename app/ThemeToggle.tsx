"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Tombol toggle tema terang/gelap.
 * Tema disimpan di localStorage ("theme") dan diterapkan sebagai class `dark`
 * pada <html>. Nilai awal sudah di-set oleh skrip inline di layout (anti-flash),
 * komponen ini hanya menyinkronkan state React-nya setelah mount.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* localStorage tidak tersedia — abaikan */
    }
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      title={isDark ? "Mode terang" : "Mode gelap"}
      className={`flex items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-container-high)] active:scale-95 ${className}`}
      style={{ width: "var(--touch-target-min)", height: "var(--touch-target-min)" }}
    >
      {/* Sebelum mount, render placeholder netral agar tidak mismatch hydrate */}
      <span
        className="material-symbols-outlined"
        style={{
          color: "var(--color-on-surface-variant)",
          fontSize: "22px",
          opacity: mounted ? 1 : 0,
          transition: "opacity 150ms ease",
        }}
      >
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}

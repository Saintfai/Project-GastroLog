"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "home", exact: true },
  { href: "/dashboard/history", label: "Riwayat", icon: "history", exact: false },
  { href: "/dashboard/analytics", label: "Analitik", icon: "monitoring", exact: false },
  { href: "/dashboard/profile", label: "Profil", icon: "person", exact: false },
] as const;

function useIsActive() {
  const pathname = usePathname();
  return (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);
}

/** Rute "fokus" (form layar penuh dengan CTA fixed sendiri) tanpa bottom nav/FAB. */
const FOCUSED_ROUTES = ["/dashboard/journal", "/dashboard/profile/edit"];
function useIsFocusedRoute() {
  const pathname = usePathname();
  return FOCUSED_ROUTES.some((r) => pathname.startsWith(r));
}

/** Bottom navigation (mobile) — clean clinical: hairline top, ramping. */
export function BottomNav() {
  const isActive = useIsActive();
  const focused = useIsFocusedRoute();
  if (focused) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around px-2 pb-3 pt-2 md:hidden"
      style={{
        backgroundColor: "var(--color-header-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid var(--color-outline-variant)",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-transform active:scale-95"
            style={{ color: active ? "var(--color-primary)" : "var(--color-on-surface-variant)" }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "24px",
                fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {item.icon}
            </span>
            <span style={{ fontSize: "11px", fontWeight: active ? 700 : 500 }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Floating action button — "Catat Jurnal". Disembunyikan di rute fokus. */
export function JournalFab() {
  const focused = useIsFocusedRoute();
  if (focused) return null;

  return (
    <div className="fixed bottom-24 left-0 z-40 flex w-full justify-center md:bottom-8">
      <Link
        href="/dashboard/journal"
        className="flex items-center gap-2 rounded-full px-6 py-4 transition-all duration-200 hover:opacity-90 active:scale-95"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-on-primary)",
          boxShadow: "var(--shadow-card-hover)",
        }}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          edit_document
        </span>
        <span className="font-semibold" style={{ fontSize: "14px" }}>
          Catat Jurnal
        </span>
      </Link>
    </div>
  );
}

/** Tautan navigasi desktop (header) dengan indikator aktif. */
export function DesktopNavLinks() {
  const isActive = useIsActive();

  return (
    <div className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full px-4 py-2 text-sm font-semibold transition-all"
            style={
              active
                ? {
                    backgroundColor: "var(--color-primary-container)",
                    color: "var(--color-on-primary-container)",
                  }
                : { color: "var(--color-on-surface-variant)" }
            }
          >
            {item.label === "Home" ? "Beranda" : item.label}
          </Link>
        );
      })}
    </div>
  );
}

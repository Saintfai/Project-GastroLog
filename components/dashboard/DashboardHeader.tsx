import Link from "next/link";
import { DesktopNavLinks } from "@/app/dashboard/DashboardNav";
import ThemeToggle from "@/app/ThemeToggle";

interface DashboardHeaderProps {
  name?: string | null;
  image?: string | null;
}

export default function DashboardHeader({ name, image }: DashboardHeaderProps) {
  const firstName = name?.split(" ")[0] || "Pengguna";

  return (
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
      <Link
        href="/dashboard/profile"
        className="flex items-center gap-3 group px-3 py-1.5 rounded-2xl hover:bg-[var(--color-surface-container-low)] active:scale-[0.98] transition-all"
      >
        {image ? (
          <img
            src={image}
            alt={`Foto profil ${name}`}
            className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:ring-2 group-hover:ring-[var(--color-primary-container)] transition-all"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:bg-[var(--color-primary-container)] group-hover:text-[var(--color-on-primary-container)]"
            style={{ backgroundColor: "var(--color-surface-variant)" }}
          >
            <span className="material-symbols-outlined" style={{ color: "var(--color-outline)" }}>
              person
            </span>
          </div>
        )}
        <div>
          <h1
            className="font-bold flex items-center gap-0.5"
            style={{
              fontSize: "22px",
              lineHeight: "28px",
              letterSpacing: "-0.03em",
              color: "var(--color-on-surface)",
            }}
          >
            GastroLog
            <span
              className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-4px] group-hover:translate-x-0"
              style={{ fontSize: "18px" }}
            >
              chevron_right
            </span>
          </h1>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-on-surface-variant)" }}>
            Halo, {firstName}
          </p>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <div className="mr-2">
          <DesktopNavLinks />
        </div>
        <ThemeToggle />
        <button
          className="flex items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-container-high)]"
          style={{ width: "var(--touch-target-min)", height: "var(--touch-target-min)" }}
        >
          <span className="material-symbols-outlined" style={{ color: "var(--color-on-surface-variant)" }}>
            notifications
          </span>
        </button>
      </div>
    </header>
  );
}

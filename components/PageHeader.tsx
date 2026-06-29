import Link from "next/link";
import { DesktopNavLinks } from "@/app/dashboard/DashboardNav";
import ThemeToggle from "@/app/ThemeToggle";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref: string;
  showDesktopNav?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  backHref,
  showDesktopNav = true,
}: PageHeaderProps) {
  return (
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
      <div className="flex items-center min-w-0">
        <Link
          href={backHref}
          className="flex items-center justify-center rounded-full transition-opacity hover:opacity-80 active:scale-95 shrink-0"
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
        <div className="ml-2 min-w-0">
          <h1 className="truncate" style={{ fontSize: "22px", fontWeight: 700, lineHeight: "28px", letterSpacing: "-0.02em" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="truncate" style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {showDesktopNav && <DesktopNavLinks />}
        <ThemeToggle />
      </div>
    </header>
  );
}

import { BottomNav, JournalFab } from "./DashboardNav";

/**
 * Layout bersama untuk seluruh area dashboard.
 * Menyediakan navigasi bawah (mobile) + FAB sekali saja, sehingga tiap
 * halaman tidak perlu menduplikasi markup navigasi.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <JournalFab />
      <BottomNav />
    </>
  );
}

import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Mendapatkan userId dari session. Jika tidak ada session, redirect ke halaman login.
 */
export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

/**
 * Mendapatkan session yang valid. Jika tidak ada session, redirect ke halaman login.
 */
export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session;
}

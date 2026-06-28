import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Tambahkan `id` ke session.user agar bisa diakses di server components &
   * server actions tanpa query DB tambahan (diisi dari JWT lewat callback di auth.ts).
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

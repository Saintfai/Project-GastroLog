import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt", // Menggunakan JSON Web Token untuk performa Edge yang lebih cepat
  },
  callbacks: {
    // Simpan id user ke dalam token saat login, agar tersedia di setiap request
    // tanpa perlu query DB. token.sub sebenarnya sudah berisi id, tapi kita set
    // eksplisit untuk kejelasan.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Ekspos id ke session.user.id. Fallback ke token.sub agar sesi yang sudah
    // terlanjur terbit (sebelum perubahan ini) tetap mendapatkan id.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string | undefined) ?? token.sub ?? "";
      }
      return session;
    },
  },
})
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Menggunakan font Inter yang jauh lebih stabil
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PolaLambung",
  description: "Jurnal Cerdas untuk Penderita GERD / Asam Lambung",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
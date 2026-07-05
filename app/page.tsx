import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export const metadata = {
  title: "GastroLog — Smart Reflux Journal untuk GERD & Asam Lambung",
  description: "Aplikasi catatan jurnal harian cerdas bagi pejuang asam lambung untuk memantau makanan, gejala, dan mendeteksi pemicu GERD secara ilmiah.",
};

export default async function Home() {
  const session = await auth();

  // Jika pengguna sudah login, langsung alihkan ke dashboard
  if (session?.user?.email) {
    redirect("/dashboard");
  }

  return (
    <div
      className="min-h-screen antialiased flex flex-col"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-on-surface)",
      }}
    >
      {/* ── Header / Navbar ────────────────────────────────────────── */}
      <header
        className="fixed top-0 w-full z-50 flex items-center justify-between h-[76px] transition-all"
        style={{
          backgroundColor: "var(--color-header-bg)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--color-outline-variant)",
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
        }}
      >
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ backgroundColor: "var(--color-primary-container)" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 12C10 12 8 14 8 18C8 24 12 28 18 28C24 28 28 24 28 18C28 14 26 12 24 12C22 12 21 10 18 10C15 10 14 12 12 12C11 12 10 12 10 12Z"
                  fill="var(--color-primary)"
                />
                <circle cx="18" cy="18" r="4" fill="var(--color-on-primary)" />
                <path
                  d="M22 8C22 8 18 10 18 14"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--color-on-surface)" }}
            >
              Gastro<span style={{ color: "var(--color-primary)" }}>Log</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Fitur Utama
            </a>
            <a
              href="#demo"
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Cara Kerja
            </a>
            <a
              href="#faq"
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              FAQ
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle className="p-2" />
            <Link
              id="nav-login-btn"
              href="/login"
              className="flex items-center justify-center font-semibold text-sm rounded-full transition-all hover:opacity-90 active:scale-95 px-5 py-2.5"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-on-primary)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              Mulai Jurnal
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <main className="flex-grow pt-24">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden py-16 md:py-24">
          {/* Background Blobs */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full opacity-35 dark:opacity-20"
              style={{
                background: "radial-gradient(circle, var(--color-primary-container) 0%, transparent 70%)",
                filter: "blur(80px)",
              }}
            />
            <div
              className="absolute top-1/3 -right-24 w-[450px] h-[450px] rounded-full opacity-30 dark:opacity-15"
              style={{
                background: "radial-gradient(circle, var(--color-inverse-primary) 0%, transparent 70%)",
                filter: "blur(70px)",
              }}
            />
          </div>

          {/* Floating Leaves */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <svg
              className="absolute top-[12%] left-[10%] w-8 h-8 opacity-20 animate-float-leaf"
              style={{ animationDelay: "0s" }}
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M20 4C20 4 8 10 8 22C8 30 14 36 20 36C26 36 32 30 32 22C32 10 20 4 20 4Z"
                fill="var(--color-primary)"
              />
            </svg>
            <svg
              className="absolute top-[25%] right-[15%] w-6 h-6 opacity-25 animate-float-leaf"
              style={{ animationDelay: "1.5s" }}
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M20 4C20 4 8 10 8 22C8 30 14 36 20 36C26 36 32 30 32 22C32 10 20 4 20 4Z"
                fill="var(--color-primary-container)"
              />
            </svg>
          </div>

          <div className="max-w-4xl mx-auto text-center px-6 relative z-10 animate-fade-in-up">
            {/* Tagline */}
            <div
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-6"
              style={{
                backgroundColor: "var(--color-accent-soft)",
                border: "1px solid var(--color-outline-variant)",
              }}
            >
              <span className="material-symbols-outlined text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                local_hospital
              </span>
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-primary)" }}
              >
                Smart Reflux Journal
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto"
              style={{
                fontFamily: "var(--font-sans)",
                lineHeight: "1.15",
                color: "var(--color-on-surface)",
              }}
            >
              Track your food,{" "}
              <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-inverse-primary)] bg-clip-text text-transparent">
                boost your mood
              </span>
            </h1>

            {/* Sub-headline */}
            <p
              className="text-base md:text-lg mb-10 max-w-2xl mx-auto"
              style={{
                lineHeight: "1.6",
                color: "var(--color-on-surface-variant)",
              }}
            >
              GastroLog membantu pejuang GERD mencatat makanan harian, memantau gejala asam lambung, dan mengidentifikasi makanan pemicu (*trigger food*) secara ilmiah, ramah, dan bebas kecemasan.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                id="hero-cta-primary"
                href="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold text-base rounded-full transition-all hover:opacity-90 active:scale-95 px-8 py-4"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-on-primary)",
                  boxShadow: "var(--shadow-card-hover)",
                }}
              >
                <span className="material-symbols-outlined">edit_document</span>
                Mulai Jurnal Harian
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold text-base rounded-full transition-all hover:bg-[var(--color-surface-container-high)] active:scale-95 px-8 py-4"
                style={{
                  backgroundColor: "var(--color-surface-container-low)",
                  color: "var(--color-on-surface)",
                  border: "1px solid var(--color-outline-variant)",
                }}
              >
                Pelajari Fitur
              </a>
            </div>
          </div>
        </section>

        {/* ── Features Section ── */}
        <section id="features" className="py-20" style={{ backgroundColor: "var(--color-surface-container-low)" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2
                className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
                style={{ color: "var(--color-on-surface)" }}
              >
                Didesain Khusus untuk Perawatan Lambung
              </h2>
              <p
                className="text-sm md:text-base max-w-xl mx-auto"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Bukan sekadar pencatatan kalori biasa, GastroLog dirancang khusus dengan metodologi klinis untuk penderita GERD, asam lambung, dan gastritis.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1 */}
              <article
                className="clinical-card p-6 flex flex-col gap-4 rounded-3xl"
                style={{
                  backgroundColor: "var(--color-surface-container-lowest)",
                  border: "1px solid var(--color-outline-variant)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-accent-soft)", color: "var(--color-primary)" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>edit_note</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-on-surface)" }}>
                    Catatan Jurnal Praktis
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
                    Catat makanan, porsi, gejala, dan stres Anda dalam kurang dari 2 menit saja setiap harinya.
                  </p>
                </div>
              </article>

              {/* Card 2 */}
              <article
                className="clinical-card p-6 flex flex-col gap-4 rounded-3xl"
                style={{
                  backgroundColor: "var(--color-surface-container-lowest)",
                  border: "1px solid var(--color-outline-variant)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-accent-soft)", color: "var(--color-primary)" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>insights</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-on-surface)" }}>
                    Deteksi Pemicu Cerdas
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
                    Algoritme kami mengaitkan gejala refluks dengan makanan tertentu yang baru saja Anda konsumsi untuk melacak pemicunya.
                  </p>
                </div>
              </article>

              {/* Card 3 */}
              <article
                className="clinical-card p-6 flex flex-col gap-4 rounded-3xl"
                style={{
                  backgroundColor: "var(--color-surface-container-lowest)",
                  border: "1px solid var(--color-outline-variant)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-accent-soft)", color: "var(--color-primary)" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>restaurant</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-on-surface)" }}>
                    Katalog Risiko GERD
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
                    Database berisi ratusan makanan khas Indonesia dengan tingkat risiko asam lambung (Aman, Sedang, Berisiko).
                  </p>
                </div>
              </article>

              {/* Card 4 */}
              <article
                className="clinical-card p-6 flex flex-col gap-4 rounded-3xl"
                style={{
                  backgroundColor: "var(--color-surface-container-lowest)",
                  border: "1px solid var(--color-outline-variant)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-accent-soft)", color: "var(--color-primary)" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>bedtime</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-on-surface)" }}>
                    Log Gaya Hidup & Tidur
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
                    Pantau tingkat stres harian serta durasi dan posisi tidur Anda yang memengaruhi refluks lambung di malam hari.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ── Demo / Cara Kerja Section ── */}
        <section id="demo" className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              {/* Text Area */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full w-fit"
                  style={{ backgroundColor: "var(--color-accent-soft)" }}
                >
                  <span className="text-xs font-semibold tracking-wider" style={{ color: "var(--color-primary)" }}>
                    DEMO APLIKASI
                  </span>
                </div>
                <h2
                  className="text-3xl font-bold tracking-tight leading-tight"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  Melihat Pola Sehat dan Kambuh Anda secara Instan
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
                  GastroLog secara otomatis merangkum semua catatan harian Anda ke dalam skor kesehatan harian yang mudah dipahami.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[var(--color-primary)] mt-0.5">check_circle</span>
                    <span className="text-sm text-[var(--color-on-surface)] font-medium">
                      Menghitung Skor Harian secara Dinamis (1-10)
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[var(--color-primary)] mt-0.5">check_circle</span>
                    <span className="text-sm text-[var(--color-on-surface)] font-medium">
                      Deteksi Korelasi Makanan dan Reaksi Lambung
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[var(--color-primary)] mt-0.5">check_circle</span>
                    <span className="text-sm text-[var(--color-on-surface)] font-medium">
                      Identifikasi Otomatis Tren Tingkat Stres Harian
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Mockup Dashboard */}
              <div className="lg:col-span-7">
                <div
                  className="rounded-3xl p-6 md:p-8 flex flex-col gap-6"
                  style={{
                    backgroundColor: "var(--color-surface-container)",
                    border: "1px solid var(--color-outline-variant)",
                    boxShadow: "var(--shadow-card-hover)",
                  }}
                >
                  {/* Mock Health Score Header */}
                  <div className="flex items-center justify-between gap-4 p-5 rounded-2xl" style={{ backgroundColor: "var(--color-surface-container-lowest)" }}>
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-[var(--color-on-surface-variant)] uppercase">
                        Skor Harian Hari Ini
                      </span>
                      <p className="text-2xl font-bold mt-1 text-[var(--color-primary)]">
                        8<span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">/10</span>
                      </p>
                      <p className="text-xs font-semibold text-[var(--color-primary)] mt-0.5">
                        🟢 Sangat Baik (Ramah Lambung)
                      </p>
                    </div>
                    {/* Fake Sparkline */}
                    <div className="h-10 flex items-end gap-1.5">
                      <div className="w-2.5 h-6 bg-red-400 rounded-full" style={{ opacity: 0.8 }} />
                      <div className="w-2.5 h-4 bg-orange-400 rounded-full" style={{ opacity: 0.8 }} />
                      <div className="w-2.5 h-8 bg-green-500 rounded-full" style={{ opacity: 0.8 }} />
                      <div className="w-2.5 h-10 bg-green-500 rounded-full" style={{ opacity: 0.8 }} />
                    </div>
                  </div>

                  {/* Mock Daily Timeline */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                      Lini Masa Jurnal
                    </h4>

                    {/* Timeline Item 1 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs mt-1" style={{ backgroundColor: "var(--color-risk-low-bg)" }}>
                        ☀️
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-semibold">Oatmeal & Pisang Rebus</h5>
                          <span className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">08:00</span>
                        </div>
                        <p className="text-xs text-[var(--color-on-surface-variant)]">Sarapan · Porsi Sedang · 🟢 Aman untuk GERD</p>
                      </div>
                    </div>

                    {/* Timeline Divider */}
                    <div className="w-[1px] h-4 bg-[var(--color-outline-variant)] ml-3.5 -my-2" />

                    {/* Timeline Item 2 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs mt-1" style={{ backgroundColor: "var(--color-risk-high-bg)" }}>
                        🌶️
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-semibold">Ayam Geprek Sambal Korek</h5>
                          <span className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">12:30</span>
                        </div>
                        <p className="text-xs text-[var(--color-on-surface-variant)]">Makan Siang · Porsi Besar · 🔴 Risiko Tinggi</p>
                      </div>
                    </div>

                    {/* Timeline Divider */}
                    <div className="w-[1px] h-4 bg-[var(--color-outline-variant)] ml-3.5 -my-2" />

                    {/* Timeline Item 3 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs mt-1" style={{ backgroundColor: "var(--color-risk-high-bg)" }}>
                        🔥
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-semibold" style={{ color: "var(--color-error)" }}>Gejala: Heartburn & Mual</h5>
                          <span className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">14:00</span>
                        </div>
                        <p className="text-xs text-[var(--color-on-surface-variant)]">Keparahan: 6/10 · Durasi: 45 Menit</p>
                        <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/50">
                          ⚠️ Potensi Korelasi: Dipicu oleh Makan Siang (Ayam Geprek)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section id="faq" className="py-20" style={{ backgroundColor: "var(--color-surface-container-low)" }}>
          <div className="max-w-4xl mx-auto px-6">
            <h2
              className="text-3xl font-bold tracking-tight text-center mb-12"
              style={{ color: "var(--color-on-surface)" }}
            >
              Pertanyaan yang Sering Diajukan
            </h2>

            <div className="grid gap-6">
              <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--color-surface-container-lowest)" }}>
                <h3 className="text-base font-bold mb-2" style={{ color: "var(--color-primary)" }}>
                  Bagaimana GastroLog bisa tahu makanan pemicu saya?
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
                  GastroLog memetakan waktu makan Anda dengan kemunculan dan tingkat keparahan gejala yang diisi. Melalui analisis tren dalam beberapa hari, sistem akan mendeteksi makanan apa yang paling sering diikuti oleh timbulnya refluks asam lambung Anda.
                </p>
              </div>

              <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--color-surface-container-lowest)" }}>
                <h3 className="text-base font-bold mb-2" style={{ color: "var(--color-primary)" }}>
                  Apakah data medis harian saya aman di sini?
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
                  Sangat aman. Keamanan data Anda adalah prioritas utama kami. Kami menggunakan enkripsi SSL standar industri dan database privat. Data Anda tidak akan dibagikan kepada pihak ketiga mana pun.
                </p>
              </div>

              <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--color-surface-container-lowest)" }}>
                <h3 className="text-base font-bold mb-2" style={{ color: "var(--color-primary)" }}>
                  Apakah aplikasi ini 100% gratis digunakan?
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
                  Ya, fitur pencatatan harian dasar, database katalog risiko makanan lokal, serta dashboard grafik riwayat kesehatan harian gratis digunakan selamanya.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Call To Action / Join Section ── */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div
              className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
              style={{
                backgroundColor: "var(--color-surface-container-high)",
                border: "1px solid var(--color-outline-variant)",
                boxShadow: "var(--shadow-card-hover)",
              }}
            >
              {/* Blob decoration */}
              <div
                className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-20"
                style={{
                  background: "radial-gradient(circle, var(--color-primary-container) 0%, transparent 70%)",
                  filter: "blur-40px)",
                }}
              />

              <h2
                className="text-3xl md:text-4xl font-bold tracking-tight mb-4 relative z-10"
                style={{ color: "var(--color-on-surface)" }}
              >
                Siap Mengembalikan Kenyamanan Lambung Anda?
              </h2>
              <p
                className="text-sm md:text-base max-w-xl mx-auto mb-8 relative z-10"
                style={{ color: "var(--color-on-surface-variant)", lineHeight: "1.6" }}
              >
                Jangan biarkan asam lambung merenggut fokus harian Anda. Lacak pemicunya, kendalikan gejalanya, dan kembalilah menikmati makanan favorit Anda dengan tenang.
              </p>
              <div className="relative z-10 flex justify-center">
                <Link
                  id="bottom-cta-btn"
                  href="/login"
                  className="flex items-center justify-center gap-2 font-bold text-base rounded-full transition-all hover:opacity-90 active:scale-95 px-8 py-4"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-on-primary)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <span className="material-symbols-outlined">rocket_launch</span>
                  Mulai Jurnal Gratis Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer
        className="py-12 border-t mt-auto text-center"
        style={{
          backgroundColor: "var(--color-surface-container-lowest)",
          borderColor: "var(--color-outline-variant)",
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold" style={{ color: "var(--color-on-surface-variant)" }}>
            © {new Date().getFullYear()} GastroLog. Seluruh hak cipta dilindungi.
          </span>
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
            <span>Dibuat dengan 🌿 untuk pejuang asam lambung</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

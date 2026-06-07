import { signIn } from "@/auth";

export const metadata = {
  title: "Masuk — GastroLog",
  description: "Masuk ke GastroLog untuk mulai mencatat jurnal dan memantau pemicu asam lambungmu.",
};

export default function LoginPage() {
  return (
    <main
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* ── Decorative background blobs ─────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Top-left soft blob */}
        <div
          className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, #becca3 0%, #dae8be 50%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Bottom-right warm blob */}
        <div
          className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, #c9c6c1 0%, #e6e2dd 50%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        {/* Center accent */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] opacity-20"
          style={{
            background:
              "radial-gradient(ellipse, #a3b18a 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* ── Floating decorative leaves ───────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Leaf 1 */}
        <svg
          className="absolute top-[8%] left-[6%] w-10 h-10 opacity-25 animate-float-leaf"
          style={{ animationDelay: "0s" }}
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            d="M20 4C20 4 8 10 8 22C8 30 14 36 20 36C26 36 32 30 32 22C32 10 20 4 20 4Z"
            fill="#566342"
          />
          <path d="M20 4L20 36" stroke="#a3b18a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {/* Leaf 2 */}
        <svg
          className="absolute top-[20%] right-[8%] w-7 h-7 opacity-20 animate-float-leaf"
          style={{ animationDelay: "1.6s" }}
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            d="M20 4C20 4 8 10 8 22C8 30 14 36 20 36C26 36 32 30 32 22C32 10 20 4 20 4Z"
            fill="#a3b18a"
          />
          <path d="M20 4L20 36" stroke="#becca3" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {/* Leaf 3 */}
        <svg
          className="absolute bottom-[15%] left-[10%] w-6 h-6 opacity-15 animate-float-leaf"
          style={{ animationDelay: "3s" }}
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            d="M20 4C20 4 8 10 8 22C8 30 14 36 20 36C26 36 32 30 32 22C32 10 20 4 20 4Z"
            fill="#566342"
          />
        </svg>
        {/* Leaf 4 */}
        <svg
          className="absolute bottom-[25%] right-[12%] w-8 h-8 opacity-20 animate-float-leaf"
          style={{ animationDelay: "0.8s" }}
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            d="M20 4C20 4 8 10 8 22C8 30 14 36 20 36C26 36 32 30 32 22C32 10 20 4 20 4Z"
            fill="#becca3"
          />
        </svg>
      </div>

      {/* ── Main card ───────────────────────────────────── */}
      <div
        className="relative z-10 w-full mx-auto px-5"
        style={{ maxWidth: "440px" }}
      >
        <div
          className="rounded-3xl p-8 md:p-10"
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            boxShadow: "0px 8px 40px rgba(45, 49, 46, 0.08), 0px 2px 8px rgba(45, 49, 46, 0.04)",
            border: "1px solid var(--color-outline-variant)",
          }}
        >

          {/* ── Logo / Brand mark ─────────────────────── */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse-ring"
              style={{ backgroundColor: "var(--color-surface-container-low)" }}
            >
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-2xl opacity-50"
                style={{ border: "2px solid var(--color-primary-container)" }}
              />
              {/* Inner icon */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Stomach silhouette */}
                <path
                  d="M10 12C10 12 8 14 8 18C8 24 12 28 18 28C24 28 28 24 28 18C28 14 26 12 24 12C22 12 21 10 18 10C15 10 14 12 12 12C11 12 10 12 10 12Z"
                  fill="var(--color-primary-container)"
                />
                <path
                  d="M18 14C16 14 14 16 14 18C14 20 15.5 22 18 22C20.5 22 22 20 22 18C22 16 20 14 18 14Z"
                  fill="var(--color-primary)"
                />
                {/* Leaf accent */}
                <path
                  d="M22 8C22 8 18 10 18 14"
                  stroke="var(--color-primary)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M22 8C22 8 24 10 23 13"
                  stroke="var(--color-primary-container)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* ── Heading ───────────────────────────────── */}
          <div className="text-center mb-8 animate-fade-in-up-delay-1">
            <h1
              className="mb-2"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "26px",
                fontWeight: 600,
                lineHeight: "32px",
                letterSpacing: "-0.02em",
                color: "var(--color-on-surface)",
              }}
            >
              Selamat Datang di GastroLog
            </h1>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 400,
                lineHeight: "24px",
                color: "var(--color-on-surface-variant)",
              }}
            >
              Jurnal cerdas untuk memantau dan memahami kondisi asam lambungmu
            </p>
          </div>

          {/* ── Feature pills ─────────────────────────── */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in-up-delay-1">
            <span className="chip">
              <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L9.5 6H14L10.5 8.5L12 13L8 10.5L4 13L5.5 8.5L2 6H6.5L8 2Z" fill="var(--color-primary)" />
              </svg>
              Catat Gejala
            </span>
            <span className="chip">
              <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="var(--color-primary)" strokeWidth="1.5" />
                <path d="M8 5V8L10 10" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Lacak Pola
            </span>
            <span className="chip">
              <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M3 5H10M3 11H8" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Laporan Harian
            </span>
          </div>

          {/* ── Divider ──────────────────────────────── */}
          <div className="divider-with-text mb-6 animate-fade-in-up-delay-2">
            Masuk dengan akun
          </div>

          {/* ── Google Sign-In Form ───────────────────── */}
          <div className="animate-fade-in-up-delay-3">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
            >
              <button
                id="btn-google-signin"
                type="submit"
                className="btn-google"
              >
                {/* Google Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-5 h-5 flex-shrink-0"
                >
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.238-2.657-.389-3.917z" />
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571c.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.238-2.657-.389-3.917z" />
                </svg>
                Lanjutkan dengan Google
              </button>
            </form>

            {/* ── Privacy note ──────────────────────── */}
            <p
              className="text-center mt-5"
              style={{
                fontSize: "12px",
                lineHeight: "18px",
                color: "var(--color-on-surface-variant)",
              }}
            >
              Dengan masuk, kamu menyetujui{" "}
              <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>
                Kebijakan Privasi
              </span>{" "}
              dan{" "}
              <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>
                Syarat Layanan
              </span>{" "}
              GastroLog.
            </p>
          </div>
        </div>

        {/* ── Bottom tagline ───────────────────────────── */}
        <p
          className="text-center mt-6 animate-fade-in-up-delay-3"
          style={{
            fontSize: "13px",
            color: "var(--color-on-surface-variant)",
            opacity: 0.7,
          }}
        >
          Dibuat dengan 🌿 untuk pejuang asam lambung
        </p>
      </div>
    </main>
  );
}
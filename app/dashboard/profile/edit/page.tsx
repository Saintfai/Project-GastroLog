import { requireSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { saveProfile } from "../actions";
import { Gender, GerdSeverity } from "@prisma/client";
import PageHeader from "@/components/PageHeader";

export default async function EditProfilePage() {
  const session = await requireSession();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  if (!user) redirect("/login");

  const profile = user.profile;

  async function handleSubmit(formData: FormData) {
    "use server";
    
    const ageRaw = formData.get("age");
    const durationRaw = formData.get("gerdDurationMonths");

    const data = {
      age: ageRaw ? Number(ageRaw) : null,
      gender: (formData.get("gender") as Gender) || null,
      gerdSeverity: (formData.get("gerdSeverity") as GerdSeverity) || null,
      gerdDurationMonths: durationRaw ? Number(durationRaw) : null,
      medications: formData.get("medications")
        ?.toString()
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0) || [],
      foodRestrictions: formData.get("foodRestrictions")
        ?.toString()
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0) || [],
    };

    const result = await saveProfile(data);
    if (result.success) {
      redirect("/dashboard/profile");
    }
  }

  const headerTitle = profile ? "Edit Profil GERD" : "Lengkapi Profil GERD";

  return (
    <div
      className="min-h-screen antialiased pb-24"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-on-surface)",
      }}
    >
      <PageHeader
        title={headerTitle}
        backHref="/dashboard/profile"
      />

      {/* ── Main Content ── */}
      <main
        className="mx-auto flex flex-col gap-6"
        style={{
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
          paddingTop: "var(--spacing-lg)",
          maxWidth: "512px",
        }}
      >
        <div className="flex flex-col gap-1">
          <p style={{ fontSize: "14px", color: "var(--color-on-surface-variant)" }}>
            Informasi ini membantu menganalisis pemicu asam lambung dan memberikan rekomendasi kesehatan yang relevan.
          </p>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-6">
          {/* Card 1: Data Diri */}
          <section className="clinical-card p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-base flex items-center gap-2" style={{ color: "var(--color-primary)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>person</span>
              Data Diri
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold px-1" style={{ color: "var(--color-on-surface-variant)" }}>
                  Usia (Tahun)
                </label>
                <input
                  name="age"
                  type="number"
                  placeholder="Contoh: 25"
                  defaultValue={profile?.age ?? ""}
                  className="w-full h-12 px-4 rounded-xl bg-[var(--color-surface-container-low)] border border-transparent focus:outline-none focus:border-[var(--color-primary-container)] text-[var(--color-on-surface)] transition-all placeholder:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold px-1" style={{ color: "var(--color-on-surface-variant)" }}>
                  Jenis Kelamin
                </label>
                <select
                  name="gender"
                  defaultValue={profile?.gender ?? "MALE"}
                  className="w-full h-12 px-4 rounded-xl bg-[var(--color-surface-container-low)] border border-transparent focus:outline-none focus:border-[var(--color-primary-container)] text-[var(--color-on-surface)] transition-all cursor-pointer"
                >
                  <option value="MALE">Laki-laki</option>
                  <option value="FEMALE">Perempuan</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </div>
            </div>
          </section>

          {/* Card 2: Informasi Medis GERD */}
          <section className="clinical-card p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-base flex items-center gap-2" style={{ color: "var(--color-primary)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>clinical_notes</span>
              Kondisi GERD
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold px-1" style={{ color: "var(--color-on-surface-variant)" }}>
                  Tingkat Keparahan
                </label>
                <select
                  name="gerdSeverity"
                  defaultValue={profile?.gerdSeverity ?? "MODERATE"}
                  className="w-full h-12 px-4 rounded-xl bg-[var(--color-surface-container-low)] border border-transparent focus:outline-none focus:border-[var(--color-primary-container)] text-[var(--color-on-surface)] transition-all cursor-pointer"
                >
                  <option value="MILD">Ringan</option>
                  <option value="MODERATE">Sedang</option>
                  <option value="SEVERE">Berat</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold px-1" style={{ color: "var(--color-on-surface-variant)" }}>
                  Durasi (Bulan)
                </label>
                <input
                  name="gerdDurationMonths"
                  type="number"
                  placeholder="Contoh: 6"
                  defaultValue={profile?.gerdDurationMonths ?? ""}
                  className="w-full h-12 px-4 rounded-xl bg-[var(--color-surface-container-low)] border border-transparent focus:outline-none focus:border-[var(--color-primary-container)] text-[var(--color-on-surface)] transition-all placeholder:opacity-50"
                />
              </div>
            </div>
          </section>

          {/* Card 3: Obat & Pantangan */}
          <section className="clinical-card p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-base flex items-center gap-2" style={{ color: "var(--color-primary)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>medical_services</span>
              Obat & Pantangan
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold px-1" style={{ color: "var(--color-on-surface-variant)" }}>
                  Obat yang Sering Dikonsumsi
                </label>
                <input
                  name="medications"
                  type="text"
                  placeholder="Contoh: Antasida, Omeprazole (pisahkan koma)"
                  defaultValue={profile?.medications.join(", ") ?? ""}
                  className="w-full h-12 px-4 rounded-xl bg-[var(--color-surface-container-low)] border border-transparent focus:outline-none focus:border-[var(--color-primary-container)] text-[var(--color-on-surface)] transition-all placeholder:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold px-1" style={{ color: "var(--color-on-surface-variant)" }}>
                  Makanan/Minuman Pantangan
                </label>
                <input
                  name="foodRestrictions"
                  type="text"
                  placeholder="Contoh: Kopi, Pedas, Cokelat (pisahkan koma)"
                  defaultValue={profile?.foodRestrictions.join(", ") ?? ""}
                  className="w-full h-12 px-4 rounded-xl bg-[var(--color-surface-container-low)] border border-transparent focus:outline-none focus:border-[var(--color-primary-container)] text-[var(--color-on-surface)] transition-all placeholder:opacity-50"
                />
              </div>
            </div>
          </section>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center active:scale-[0.98] transition-all"
            style={{
              height: "56px",
              backgroundColor: "var(--color-primary)",
              color: "var(--color-on-primary)",
              borderRadius: "var(--radius-xl)",
              border: "none",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(86, 99, 66, 0.2)",
            }}
          >
            Simpan Profil
          </button>
        </form>
      </main>
    </div>
  );
}

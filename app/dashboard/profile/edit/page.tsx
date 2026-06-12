import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { createProfile } from "../actions";
import { Gender, GerdSeverity } from "@prisma/client";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  });

  if (user?.profile) redirect("/dashboard");

  async function handleSubmit(formData: FormData) {
    "use server";
    if (!user) return;

    const data = {
      age: Number(formData.get("age")),
      gender: formData.get("gender") as Gender,
      gerdSeverity: formData.get("gerdSeverity") as GerdSeverity,
      gerdDurationMonths: Number(formData.get("gerdDurationMonths")),
      medications: formData.get("medications")?.toString().split(",").map(s => s.trim()) || [],
      foodRestrictions: formData.get("foodRestrictions")?.toString().split(",").map(s => s.trim()) || [],
    };

    const result = await createProfile(user.id, data);
    if (result.success) redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Lengkapi Profil GERD Anda</h1>
      <form action={handleSubmit} className="flex flex-col gap-4">
        <input name="age" type="number" placeholder="Usia" className="input" />
        <select name="gender" className="input">
          <option value="MALE">Laki-laki</option>
          <option value="FEMALE">Perempuan</option>
          <option value="OTHER">Lainnya</option>
        </select>
        <select name="gerdSeverity" className="input">
          <option value="MILD">Ringan</option>
          <option value="MODERATE">Sedang</option>
          <option value="SEVERE">Berat</option>
        </select>
        <input name="gerdDurationMonths" type="number" placeholder="Durasi (bulan)" className="input" />
        <input name="medications" type="text" placeholder="Obat (pisahkan koma)" className="input" />
        <input name="foodRestrictions" type="text" placeholder="Pantangan (pisahkan koma)" className="input" />
        <button type="submit" className="btn-primary">Simpan Profil</button>
      </form>
    </div>
  );
}

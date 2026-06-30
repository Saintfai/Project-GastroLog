"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addCustomFood } from "./actions";
import type { FoodCategory, GerdRiskLevel } from "@prisma/client";

const CATEGORIES = [
  { value: "ALL", label: "Semua Kategori" },
  { value: "GRAIN", label: "Biji & Karbo" },
  { value: "PROTEIN", label: "Protein" },
  { value: "DAIRY", label: "Susu & Olahan" },
  { value: "VEGETABLE", label: "Sayuran" },
  { value: "FRUIT", label: "Buah" },
  { value: "BEVERAGE", label: "Minuman" },
  { value: "SNACK", label: "Camilan" },
  { value: "OTHER", label: "Lainnya" },
] as const;

const RISK_LEVELS = [
  { value: "ALL", label: "Semua Risiko" },
  { value: "LOW", label: "🟢 Aman" },
  { value: "MEDIUM", label: "🟡 Sedang" },
  { value: "HIGH", label: "🔴 Berisiko" },
] as const;

export default function FoodFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("query") || "";
  const currentCategory = searchParams.get("category") || "ALL";
  const currentRiskLevel = searchParams.get("riskLevel") || "ALL";

  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form State for Add Food Modal
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<FoodCategory>("SNACK");
  const [formRisk, setFormRisk] = useState<GerdRiskLevel>("MEDIUM");
  const [formError, setFormError] = useState<string | null>(null);

  // Debounced Search Update
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery !== currentQuery) {
        updateFilter("query", searchQuery);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, currentQuery]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/dashboard/foods?${params.toString()}`);
  };

  const handleCreateFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Nama makanan wajib diisi");
      return;
    }
    setFormError(null);

    startTransition(async () => {
      try {
        await addCustomFood({
          name: formName.trim(),
          category: formCategory,
          gerdRiskLevel: formRisk,
        });
        setIsModalOpen(false);
        setFormName("");
      } catch (err) {
        setFormError("Gagal menambahkan makanan. Silakan coba lagi.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar & Add Button */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <span
            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama makanan atau minuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="food-search-input w-full"
            style={{ height: "48px", borderRadius: "var(--radius-lg)" }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary shrink-0"
          style={{ width: "auto", minHeight: "48px", padding: "0 20px" }}
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Tambah Makanan</span>
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-col gap-2">
        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
          Kategori
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              className="chip-selectable shrink-0"
              data-selected={currentCategory === cat.value}
              onClick={() => updateFilter("category", cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Level Filters */}
      <div className="flex flex-col gap-2">
        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
          Tingkat Risiko GERD
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {RISK_LEVELS.map((risk) => (
            <button
              key={risk.value}
              type="button"
              className="chip-selectable shrink-0"
              data-selected={currentRiskLevel === risk.value}
              onClick={() => updateFilter("riskLevel", risk.value)}
            >
              {risk.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add Food Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="add-food-modal">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: "20px", fontWeight: 700 }}>Tambah Makanan Custom</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ color: "var(--color-on-surface-variant)", fontSize: "24px" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFood} className="flex flex-col gap-4">
              {formError && (
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{ backgroundColor: "var(--color-error-container)", color: "var(--color-on-error-container)" }}
                >
                  {formError}
                </div>
              )}

              <div>
                <label className="block mb-1 text-sm font-medium">Nama Makanan / Minuman</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pisang Bakar Keju"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="food-search-input w-full"
                  style={{ height: "48px", borderRadius: "var(--radius-lg)", paddingLeft: "16px" }}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Kategori</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as FoodCategory)}
                  className="food-search-input w-full"
                  style={{ height: "48px", borderRadius: "var(--radius-lg)", paddingLeft: "16px" }}
                >
                  {CATEGORIES.filter((c) => c.value !== "ALL").map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Risiko GERD</label>
                <select
                  value={formRisk}
                  onChange={(e) => setFormRisk(e.target.value as GerdRiskLevel)}
                  className="food-search-input w-full"
                  style={{ height: "48px", borderRadius: "var(--radius-lg)", paddingLeft: "16px" }}
                >
                  <option value="LOW">🟢 Aman (Ramah Lambung)</option>
                  <option value="MEDIUM">🟡 Sedang (Tergantung Porsi)</option>
                  <option value="HIGH">🔴 Berisiko (Pemicu Utama)</option>
                </select>
              </div>



              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg font-medium"
                  style={{ backgroundColor: "var(--color-surface-container)", color: "var(--color-on-surface)" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary"
                  style={{ width: "auto", minHeight: "44px" }}
                >
                  {isPending ? "Menyimpan..." : "Simpan Makanan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

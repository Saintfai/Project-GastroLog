"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import { searchFoodItems, createJournalEntry } from "./actions";
import type { FoodSearchResult } from "./actions";

// ─── Constants ────────────────────────────────────────────
const MEAL_TYPES = [
  { value: "BREAKFAST", label: "Sarapan", icon: "☀️" },
  { value: "LUNCH", label: "Makan Siang", icon: "🌤️" },
  { value: "DINNER", label: "Makan Malam", icon: "🌙" },
  { value: "SNACK", label: "Camilan", icon: "🍪" },
  { value: "DRINK", label: "Minuman", icon: "🥤" },
] as const;

const PORTION_SIZES = [
  { value: "SMALL", label: "Kecil" },
  { value: "MEDIUM", label: "Sedang" },
  { value: "LARGE", label: "Besar" },
] as const;

const SYMPTOM_TYPES = [
  { value: "HEARTBURN", label: "Heartburn", icon: "🔥" },
  { value: "REGURGITATION", label: "Regurgitasi", icon: "💧" },
  { value: "BLOATING", label: "Kembung", icon: "🎈" },
  { value: "NAUSEA", label: "Mual", icon: "🤢" },
  { value: "CHEST_PAIN", label: "Nyeri Dada", icon: "💔" },
  { value: "OTHER", label: "Lainnya", icon: "📋" },
] as const;

const STRESS_EMOJIS = [
  { value: 1, emoji: "😫", label: "Sangat Stres" },
  { value: 2, emoji: "🙁", label: "Stres" },
  { value: 3, emoji: "😐", label: "Biasa" },
  { value: 4, emoji: "🙂", label: "Baik" },
  { value: 5, emoji: "😄", label: "Sangat Baik" },
] as const;

type MealType = (typeof MEAL_TYPES)[number]["value"];
type PortionSize = (typeof PORTION_SIZES)[number]["value"];
type SymptomType = (typeof SYMPTOM_TYPES)[number]["value"];

// ─── Component ────────────────────────────────────────────
export default function JournalFormPage() {
  // Form state
  const [mealType, setMealType] = useState<MealType>("BREAKFAST");
  const [foodName, setFoodName] = useState("");
  const [foodItemId, setFoodItemId] = useState<string | null>(null);
  const [portionSize, setPortionSize] = useState<PortionSize>("MEDIUM");
  const [severity, setSeverity] = useState(5);
  const [symptomTypes, setSymptomTypes] = useState<SymptomType[]>([]);
  const [stressLevel, setStressLevel] = useState(3);
  const [notes, setNotes] = useState("");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Submit state
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // ─── Food Search with debounce ─────────────────────────
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchFoodItems(searchQuery);
        setSearchResults(results);
        setShowDropdown(results.length > 0);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ─── Close dropdown on click outside ───────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-search-container]")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // ─── Handlers ──────────────────────────────────────────
  const handleFoodSelect = useCallback((food: FoodSearchResult) => {
    setFoodName(food.name);
    setFoodItemId(food.id);
    setSearchQuery(food.name);
    setShowDropdown(false);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setFoodName(value);
    setFoodItemId(null); // Reset food item link when typing manually
  }, []);

  const toggleSymptom = useCallback((symptom: SymptomType) => {
    setSymptomTypes((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  }, []);

  const handleSubmit = useCallback(() => {
    if (!foodName.trim()) {
      setError("Masukkan nama makanan atau minuman.");
      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        await createJournalEntry({
          mealType,
          foodName: foodName.trim(),
          foodItemId,
          portionSize,
          severity,
          symptomTypes,
          stressLevel,
          notes: notes.trim(),
        });
      } catch {
        setError("Gagal menyimpan jurnal. Coba lagi.");
      }
    });
  }, [mealType, foodName, foodItemId, portionSize, severity, symptomTypes, stressLevel, notes]);

  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case "LOW": return "risk-badge risk-badge-low";
      case "MEDIUM": return "risk-badge risk-badge-medium";
      case "HIGH": return "risk-badge risk-badge-high";
      default: return "risk-badge";
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case "LOW": return "Aman";
      case "MEDIUM": return "Sedang";
      case "HIGH": return "Berisiko";
      default: return level;
    }
  };

  // ─── Auto-detect meal type based on time ───────────────
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) setMealType("BREAKFAST");
    else if (hour >= 10 && hour < 15) setMealType("LUNCH");
    else if (hour >= 15 && hour < 20) setMealType("DINNER");
    else setMealType("SNACK");
  }, []);

  return (
    <div
      className="min-h-screen antialiased pb-40"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-on-surface)",
      }}
    >
      {/* ── Fixed Header ── */}
      <header
        className="fixed top-0 w-full z-50 flex items-center h-[72px]"
        style={{
          backgroundColor: "var(--color-header-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-outline-variant)",
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
        }}
      >
        <Link
          href="/dashboard"
          className="flex items-center justify-start rounded-full transition-opacity hover:opacity-80 active:scale-95"
          style={{
            width: "var(--touch-target-min)",
            height: "var(--touch-target-min)",
            color: "var(--color-on-surface)",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
            arrow_back
          </span>
        </Link>
        <h1
          className="ml-2"
          style={{
            fontSize: "24px",
            fontWeight: 500,
            lineHeight: "32px",
            letterSpacing: "-0.01em",
            color: "var(--color-on-surface)",
          }}
        >
          Catat Jurnal
        </h1>
      </header>

      {/* ── Main Content ── */}
      <main
        className="mx-auto flex flex-col gap-10"
        style={{
          paddingTop: "96px",
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
          maxWidth: "512px",
        }}
      >
        {/* ─── Section 1: Meal Type ─────────────────────── */}
        <section className="flex flex-col gap-4 animate-fade-in-up">
          <label
            style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "28px",
              color: "var(--color-on-surface)",
            }}
          >
            Waktu makan
          </label>
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
          >
            {MEAL_TYPES.map((mt) => (
              <button
                key={mt.value}
                type="button"
                className="chip-selectable"
                data-selected={mealType === mt.value}
                onClick={() => setMealType(mt.value)}
              >
                <span className="mr-1.5">{mt.icon}</span>
                {mt.label}
              </button>
            ))}
          </div>
        </section>

        {/* ─── Section 2: Food Search ───────────────────── */}
        <section className="flex flex-col gap-4 animate-fade-in-up-delay-1 relative z-50">
          <label
            style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "28px",
              color: "var(--color-on-surface)",
            }}
          >
            Apa yang kamu makan?
          </label>
          <div className="relative" data-search-container>
            <span
              className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
              style={{
                color: showDropdown
                  ? "var(--color-primary)"
                  : "var(--color-on-surface-variant)",
              }}
            >
              search
            </span>
            <input
              id="food-search"
              type="text"
              className="food-search-input"
              placeholder="Cari makanan atau minuman..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              autoComplete="off"
            />
            {isSearching && (
              <span
                className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 animate-spin"
                style={{ color: "var(--color-outline)", fontSize: "20px" }}
              >
                progress_activity
              </span>
            )}

            {/* Dropdown Results */}
            {showDropdown && searchResults.length > 0 && (
              <div className="food-search-dropdown">
                {searchResults.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    className="food-search-item w-full text-left"
                    onClick={() => handleFoodSelect(food)}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "var(--color-on-surface)",
                        }}
                      >
                        {food.name}
                      </span>
                      {food.description && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--color-on-surface-variant)",
                            lineHeight: "16px",
                          }}
                        >
                          {food.description.length > 60
                            ? food.description.slice(0, 60) + "..."
                            : food.description}
                        </span>
                      )}
                    </div>
                    <span className={getRiskBadgeClass(food.gerdRiskLevel)}>
                      {getRiskLabel(food.gerdRiskLevel)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected food indicator */}
          {foodItemId && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                backgroundColor: "var(--color-accent-soft)",
                fontSize: "13px",
                color: "var(--color-primary)",
                fontWeight: 600,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                check_circle
              </span>
              Dipilih dari database makanan
            </div>
          )}
        </section>

        {/* ─── Section 3: Portion Size ──────────────────── */}
        <section className="flex flex-col gap-4 animate-fade-in-up-delay-1">
          <label
            style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "28px",
              color: "var(--color-on-surface)",
            }}
          >
            Porsi
          </label>
          <div className="flex gap-3">
            {PORTION_SIZES.map((ps) => (
              <button
                key={ps.value}
                type="button"
                className="portion-pill"
                data-selected={portionSize === ps.value}
                onClick={() => setPortionSize(ps.value)}
              >
                {ps.label}
              </button>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        {/* ─── Section 4: Symptom Types ─────────────────── */}
        <section className="flex flex-col gap-4 animate-fade-in-up-delay-2">
          <label
            style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "28px",
              color: "var(--color-on-surface)",
            }}
          >
            Gejala yang dirasakan
          </label>
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_TYPES.map((st) => (
              <button
                key={st.value}
                type="button"
                className="chip-selectable"
                data-selected={symptomTypes.includes(st.value)}
                onClick={() => toggleSymptom(st.value)}
              >
                <span className="mr-1.5">{st.icon}</span>
                {st.label}
              </button>
            ))}
          </div>
          {symptomTypes.length === 0 && (
            <p style={{ fontSize: "13px", color: "var(--color-outline)" }}>
              Tidak ada gejala? Bagus! Lewati saja bagian ini.
            </p>
          )}
        </section>

        {/* ─── Section 5: Severity Slider ───────────────── */}
        <section className="flex flex-col gap-6 animate-fade-in-up-delay-2">
          <div className="flex items-center justify-between">
            <label
              style={{
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: "28px",
                color: "var(--color-on-surface)",
              }}
            >
              Tingkat keparahan gejala
            </label>
            <span
              className="flex items-center justify-center"
              style={{
                fontSize: "24px",
                fontWeight: 600,
                lineHeight: "32px",
                color: "var(--color-primary)",
                backgroundColor: "var(--color-accent-soft)",
                padding: "4px 12px",
                borderRadius: "var(--radius-default)",
                minWidth: "48px",
                textAlign: "center",
              }}
            >
              {severity}
            </span>
          </div>
          <div className="px-2">
            <div className="relative w-full flex items-center" style={{ height: "var(--touch-target-min)" }}>
              <input
                id="severity-slider"
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="severity-slider"
              />
            </div>
            <div
              className="flex justify-between mt-1"
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--color-on-surface-variant)",
              }}
            >
              <span>Ringan</span>
              <span>Parah</span>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ─── Section 6: Stress Level ──────────────────── */}
        <section className="flex flex-col gap-4 animate-fade-in-up-delay-3">
          <label
            style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "28px",
              color: "var(--color-on-surface)",
            }}
          >
            Tingkat stres
          </label>
          <div
            className="flex justify-between items-center p-3 rounded-2xl"
            style={{
              backgroundColor: "var(--color-surface-container-low)",
              boxShadow: "0 4px 20px rgba(45, 49, 46, 0.03)",
            }}
          >
            {STRESS_EMOJIS.map((se) => (
              <button
                key={se.value}
                type="button"
                className="btn-emoji"
                data-selected={stressLevel === se.value}
                onClick={() => setStressLevel(se.value)}
                title={se.label}
              >
                {se.emoji}
              </button>
            ))}
          </div>
          <p
            className="text-center"
            style={{
              fontSize: "13px",
              color: "var(--color-on-surface-variant)",
              fontWeight: 500,
            }}
          >
            {STRESS_EMOJIS.find((e) => e.value === stressLevel)?.label}
          </p>
        </section>

        <div className="section-divider" />

        {/* ─── Section 7: Notes ─────────────────────────── */}
        <section className="flex flex-col gap-4 animate-fade-in-up-delay-3">
          <label
            style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "28px",
              color: "var(--color-on-surface)",
            }}
          >
            Catatan tambahan
          </label>
          <textarea
            id="journal-notes"
            className="journal-textarea"
            placeholder="Tulis catatan tambahan di sini... (opsional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </section>
      </main>

      {/* ── Fixed Bottom Save Button ── */}
      <div
        className="fixed bottom-0 left-0 w-full z-40 flex justify-center"
        style={{
          background:
            "linear-gradient(to top, var(--color-background) 60%, transparent 100%)",
          paddingBottom: "32px",
          paddingTop: "48px",
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
        }}
      >
        {error && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg animate-fade-in-up"
            style={{
              backgroundColor: "var(--color-error-container)",
              color: "var(--color-on-error-container)",
              fontSize: "13px",
              fontWeight: 500,
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        <button
          id="btn-save-journal"
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full flex justify-center items-center transition-all active:scale-[0.98]"
          style={{
            maxWidth: "512px",
            height: "56px",
            backgroundColor: isPending
              ? "var(--color-surface-dim)"
              : "var(--color-primary)",
            color: isPending
              ? "var(--color-outline)"
              : "var(--color-on-primary)",
            borderRadius: "var(--radius-xl)",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "0.01em",
            cursor: isPending ? "not-allowed" : "pointer",
            boxShadow: "0 4px 20px rgba(86, 99, 66, 0.2)",
          }}
        >
          {isPending ? (
            <>
              <span
                className="material-symbols-outlined animate-spin mr-2"
                style={{ fontSize: "20px" }}
              >
                progress_activity
              </span>
              Menyimpan...
            </>
          ) : (
            "Simpan"
          )}
        </button>
      </div>
    </div>
  );
}

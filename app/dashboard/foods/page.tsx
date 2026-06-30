import { requireUserId } from "@/lib/auth-utils";
import PageHeader from "@/components/PageHeader";
import { getFoodItems, getFoodStats } from "@/lib/queries/food";
import FoodFilters from "./FoodFilters";

const CATEGORY_LABELS: Record<string, string> = {
  GRAIN: "Biji & Karbo",
  PROTEIN: "Protein",
  DAIRY: "Susu & Olahan",
  VEGETABLE: "Sayuran",
  FRUIT: "Buah",
  BEVERAGE: "Minuman",
  SNACK: "Camilan",
  OTHER: "Lainnya",
};

interface PageProps {
  searchParams?: {
    query?: string;
    category?: string;
    riskLevel?: string;
  };
}

export default async function FoodDatabasePage({ searchParams }: PageProps) {
  await requireUserId();

  const query = searchParams?.query || "";
  const category = searchParams?.category || "ALL";
  const riskLevel = searchParams?.riskLevel || "ALL";

  const [foods, stats] = await Promise.all([
    getFoodItems({ query, category, riskLevel }),
    getFoodStats(),
  ]);

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
      case "LOW": return "🟢 Aman";
      case "MEDIUM": return "🟡 Sedang";
      case "HIGH": return "🔴 Berisiko";
      default: return level;
    }
  };

  return (
    <div
      className="min-h-screen antialiased pb-28 md:pb-12"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-on-surface)",
      }}
    >
      <PageHeader
        title="Katalog Makanan"
        subtitle="Daftar makanan & minuman beserta tingkat risiko GERD"
        backHref="/dashboard"
      />

      <main
        className="mx-auto flex max-w-4xl flex-col gap-6"
        style={{
          paddingLeft: "var(--spacing-lg)",
          paddingRight: "var(--spacing-lg)",
          paddingTop: "var(--spacing-lg)",
        }}
      >
        {/* Summary Stats */}
        <div className="flex flex-wrap gap-3">
          <div className="stat-chip">
            <span>📦 Total:</span>
            <span style={{ color: "var(--color-primary)" }}>{stats.total}</span>
          </div>
          <div className="stat-chip">
            <span>🟢 Aman:</span>
            <span>{stats.low}</span>
          </div>
          <div className="stat-chip">
            <span>🟡 Sedang:</span>
            <span>{stats.medium}</span>
          </div>
          <div className="stat-chip">
            <span>🔴 Berisiko:</span>
            <span>{stats.high}</span>
          </div>
        </div>

        {/* Filters & Add Button */}
        <FoodFilters />

        {/* Food Items Grid */}
        {foods.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {foods.map((food) => (
              <article key={food.id} className="food-card">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.01em" }}>
                      {food.name}
                    </h2>
                    <span className={getRiskBadgeClass(food.gerdRiskLevel)}>
                      {getRiskLabel(food.gerdRiskLevel)}
                    </span>
                  </div>

                  {food.description ? (
                    <p
                      className="mb-4"
                      style={{
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "var(--color-on-surface-variant)",
                      }}
                    >
                      {food.description}
                    </p>
                  ) : (
                    <p
                      className="mb-4 italic"
                      style={{
                        fontSize: "13px",
                        color: "var(--color-outline)",
                      }}
                    >
                      Tidak ada deskripsi khusus.
                    </p>
                  )}
                </div>

                <div
                  className="flex items-center justify-between pt-3 border-t text-xs font-semibold"
                  style={{
                    borderColor: "var(--color-outline-variant)",
                    color: "var(--color-on-surface-variant)",
                  }}
                >
                  <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md">
                    📁 {CATEGORY_LABELS[food.category] || food.category}
                  </span>
                  {!food.isVerified && (
                    <span
                      className="px-2 py-0.5 rounded text-[11px]"
                      style={{
                        backgroundColor: "var(--color-secondary-container)",
                        color: "var(--color-on-secondary-container)",
                      }}
                    >
                      ✨ Custom
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="material-symbols-outlined mb-2" style={{ fontSize: "36px" }}>
              no_meals
            </span>
            <p style={{ fontSize: "16px", fontWeight: 600 }}>Makanan tidak ditemukan</p>
            <p style={{ fontSize: "14px", marginTop: "4px" }}>
              Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

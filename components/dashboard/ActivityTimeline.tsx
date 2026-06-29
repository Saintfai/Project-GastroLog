import Link from "next/link";
import DeleteEntryButton from "@/app/dashboard/DeleteEntryButton";
import type { TimelineItem } from "@/lib/utils/score";

interface ActivityTimelineProps {
  timeline: TimelineItem[];
}

export default function ActivityTimeline({ timeline }: ActivityTimelineProps) {
  // Helper for formatting time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-on-surface-variant)",
          }}
        >
          Aktivitas Hari Ini
        </h2>
        <Link
          href="/dashboard/history"
          style={{ fontSize: "13px", color: "var(--color-primary)", fontWeight: 600 }}
        >
          Lihat Semua
        </Link>
      </div>

      <div className="flex flex-col gap-4 relative">
        {timeline.length > 0 ? (
          timeline.map((item) => (
            <div key={item.id} className="relative timeline-item flex gap-4">
              {/* Timeline Connector Line */}
              <div className="timeline-connector" />

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10"
                style={{
                  backgroundColor:
                    item.type === "meal" ? "var(--color-secondary-container)" : "var(--color-error-container)",
                  color:
                    item.type === "meal"
                      ? "var(--color-on-secondary-container)"
                      : "var(--color-on-error-container)",
                  border: "2px solid var(--color-background)",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  {item.type === "meal" ? "restaurant" : "sick"}
                </span>
              </div>

              {/* Card Content */}
              <div className="log-card flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 style={{ fontSize: "16px", fontWeight: 500, color: "var(--color-on-surface)" }}>
                    {item.type === "meal" ? item.data.foodName : item.data.symptomType}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--color-on-surface-variant)",
                        fontWeight: 500,
                      }}
                    >
                      {formatTime(item.time)}
                    </span>
                    <DeleteEntryButton
                      id={item.id}
                      type={item.type}
                      label={item.type === "meal" ? item.data.foodName : item.data.symptomType}
                    />
                  </div>
                </div>

                {item.type === "meal" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
                      Porsi: {item.data.portionSize}
                    </span>
                    {item.data.foodItem && (
                      <span
                        className={`risk-badge ${
                          item.data.foodItem.gerdRiskLevel === "LOW"
                            ? "risk-badge-low"
                            : item.data.foodItem.gerdRiskLevel === "MEDIUM"
                            ? "risk-badge-medium"
                            : "risk-badge-high"
                        }`}
                      >
                        {item.data.foodItem.gerdRiskLevel === "LOW"
                          ? "Aman"
                          : item.data.foodItem.gerdRiskLevel === "MEDIUM"
                          ? "Sedang"
                          : "Berisiko"}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
                      Keparahan:
                    </span>
                    <div
                      className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--color-surface-variant)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.data.severity / 10) * 100}%`,
                          backgroundColor:
                            item.data.severity >= 7
                              ? "var(--color-error)"
                              : item.data.severity >= 4
                              ? "var(--color-warning)"
                              : "var(--color-primary)",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>{item.data.severity}/10</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <span className="material-symbols-outlined mb-2" style={{ fontSize: "32px", opacity: 0.5 }}>
              assignment
            </span>
            <p>Belum ada aktivitas hari ini.</p>
            <p style={{ fontSize: "13px", marginTop: "4px" }}>Catat makanan atau gejalamu sekarang.</p>
          </div>
        )}
      </div>
    </section>
  );
}

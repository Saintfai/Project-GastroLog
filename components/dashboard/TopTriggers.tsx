import React from "react";

interface TopTriggersProps {
  topTriggers: { foodName: string; count: number }[];
}

export default function TopTriggers({ topTriggers }: TopTriggersProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-on-surface-variant)",
          }}
        >
          Pemicu Teratas · 7 Hari
        </h2>
        <span className="material-symbols-outlined" style={{ color: "var(--color-outline)", fontSize: "16px" }}>
          info
        </span>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {topTriggers.length > 0 ? (
          topTriggers.map((trigger, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 h-11 rounded-full shrink-0"
              style={{
                backgroundColor: "var(--color-surface-bright)",
                border: "1px solid var(--color-outline-variant)",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-on-surface)" }}>
                {trigger.foodName}
              </span>
              <span
                className="flex items-center justify-center rounded-full stat-number"
                style={{
                  backgroundColor: "var(--color-accent-soft)",
                  color: "var(--color-primary)",
                  minWidth: "20px",
                  height: "20px",
                  padding: "0 6px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {trigger.count}
              </span>
            </div>
          ))
        ) : (
          <div
            className="flex items-center justify-center h-11 w-full rounded-full"
            style={{
              border: "1px dashed var(--color-outline-variant)",
              color: "var(--color-outline)",
            }}
          >
            <span style={{ fontSize: "14px" }}>Belum ada data pemicu yang terdeteksi</span>
          </div>
        )}
      </div>
    </section>
  );
}

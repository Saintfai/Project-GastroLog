"use client";

import { useState, useTransition } from "react";
import { deleteMealLog, deleteSymptomLog } from "./journal/actions";

type Props = {
  id: string;
  type: "meal" | "symptom";
  /** Nama item untuk ditampilkan di dialog konfirmasi (mis. nama makanan / gejala). */
  label: string;
};

export default function DeleteEntryButton({ id, type, label }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const action = type === "meal" ? deleteMealLog : deleteSymptomLog;
      const result = await action(id);
      if (result?.success) {
        setConfirming(false);
      } else {
        setError(result?.error ?? "Gagal menghapus. Coba lagi.");
      }
    });
  };

  return (
    <>
      {/* Tombol hapus (ikon) */}
      <button
        type="button"
        aria-label={`Hapus ${label}`}
        onClick={() => setConfirming(true)}
        className="flex items-center justify-center rounded-full transition-colors hover:bg-[var(--color-error-container)] active:scale-95"
        style={{ width: "36px", height: "36px", color: "var(--color-outline)" }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
          delete
        </span>
      </button>

      {/* Dialog konfirmasi */}
      {confirming && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
          style={{ backgroundColor: "var(--color-scrim)", backdropFilter: "blur(2px)" }}
          onClick={() => !isPending && setConfirming(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6 m-4 animate-fade-in-up"
            style={{
              backgroundColor: "var(--color-surface-container-high)",
              boxShadow: "var(--shadow-card-hover)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--color-error-container)",
                color: "var(--color-on-error-container)",
              }}
            >
              <span className="material-symbols-outlined">delete</span>
            </div>

            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--color-on-surface)" }}>
              Hapus catatan ini?
            </h3>
            <p
              className="mt-1"
              style={{ fontSize: "14px", color: "var(--color-on-surface-variant)" }}
            >
              {type === "meal" ? "Makanan" : "Gejala"} &quot;{label}&quot; akan dihapus permanen.
              Skor harian akan dihitung ulang.
            </p>

            {error && (
              <p
                className="mt-3 rounded-lg px-3 py-2"
                style={{
                  backgroundColor: "var(--color-error-container)",
                  color: "var(--color-on-error-container)",
                  fontSize: "13px",
                }}
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={isPending}
                className="flex-1 rounded-full py-3 transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{
                  backgroundColor: "var(--color-surface-container-lowest)",
                  color: "var(--color-on-surface)",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{
                  backgroundColor: "var(--color-error)",
                  color: "var(--color-on-error, #ffffff)",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {isPending ? (
                  <>
                    <span
                      className="material-symbols-outlined animate-spin"
                      style={{ fontSize: "18px" }}
                    >
                      progress_activity
                    </span>
                    Menghapus...
                  </>
                ) : (
                  "Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

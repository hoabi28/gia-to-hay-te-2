"use client";

import { useCompareIds } from "@/lib/useCompare";
import { toggleCompare, MAX_COMPARE } from "@/lib/compareStore";

export function AddToCompareButton({ id }: { id: string }) {
  const ids = useCompareIds();
  const inCompare = ids.includes(id);
  const full = ids.length >= MAX_COMPARE && !inCompare;

  return (
    <button
      type="button"
      disabled={full}
      onClick={() => toggleCompare(id)}
      className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
        inCompare
          ? "border-brand-700 bg-brand-50 text-brand-700"
          : "border-slate-300 text-slate-700 hover:bg-slate-50"
      } ${full ? "cursor-not-allowed opacity-50" : ""}`}
      title={full ? "Đã chọn đủ 2 máy để so sánh" : undefined}
    >
      {inCompare ? "Đã thêm để so sánh" : "Thêm để so sánh"}
    </button>
  );
}

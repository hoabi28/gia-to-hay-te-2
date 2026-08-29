"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCompareIds } from "@/lib/useCompare";
import { removeFromCompare } from "@/lib/compareStore";
import type { Laptop } from "@/types/laptop";

export function CompareBar() {
  const ids = useCompareIds();
  const [laptops, setLaptops] = useState<Laptop[]>([]);

  useEffect(() => {
    // ids rỗng thì component render null bên dưới nên không cần fetch/clear state ở đây.
    if (ids.length === 0) return;

    let cancelled = false;
    fetch(`/api/laptops?ids=${ids.join(",")}`)
      .then((res) => res.json())
      .then((data: Laptop[]) => {
        if (!cancelled) setLaptops(data);
      })
      .catch(() => {
        if (!cancelled) setLaptops([]);
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  if (ids.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <span className="text-sm font-medium text-slate-600">
          So sánh ({ids.length}/2):
        </span>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {laptops.map((l) => (
            <span
              key={l.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 py-1 pl-3 pr-1.5 text-xs font-medium text-slate-700"
            >
              {l.name}
              <button
                type="button"
                onClick={() => removeFromCompare(l.id)}
                aria-label={`Bỏ ${l.name} khỏi so sánh`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <Link
          href={
            ids.length === 2
              ? `/so-sanh?a=${ids[0]}&b=${ids[1]}`
              : `/so-sanh?a=${ids[0]}`
          }
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
            ids.length === 2
              ? "bg-brand-700 hover:bg-brand-800"
              : "cursor-not-allowed bg-slate-300"
          }`}
          aria-disabled={ids.length !== 2}
          onClick={(e) => {
            if (ids.length !== 2) e.preventDefault();
          }}
        >
          {ids.length === 2 ? "Xem so sánh" : "Chọn thêm 1 máy"}
        </Link>
      </div>
    </div>
  );
}

"use client";

import { CATEGORY_LABEL, type Laptop } from "@/types/laptop";
import { getBestCurrentPrice } from "@/lib/price";
import { formatVND } from "@/lib/format";

export function LaptopPicker({
  label,
  laptops,
  value,
  excludeId,
  onChange,
}: {
  label: string;
  laptops: Laptop[];
  value: string | undefined;
  excludeId?: string;
  onChange: (id: string) => void;
}) {
  const categories = Array.from(new Set(laptops.map((l) => l.category)));

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-500 focus:outline-none"
      >
        <option value="" disabled>
          Chọn một laptop…
        </option>
        {categories.map((cat) => (
          <optgroup key={cat} label={CATEGORY_LABEL[cat]}>
            {laptops
              .filter((l) => l.category === cat && l.id !== excludeId)
              .map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} — {formatVND(getBestCurrentPrice(l))}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

"use client";

import type { Facets } from "@/lib/facets";
import type { LaptopFilters, ScreenBucket } from "@/lib/filterLaptops";
import { USE_CASE_LABEL, type UseCase } from "@/types/laptop";

const SCREEN_BUCKETS: { key: ScreenBucket; label: string }[] = [
  { key: "13-14", label: "13 – 14 inch" },
  { key: "15-16", label: "15 – 16 inch" },
  { key: "16+", label: "Trên 16 inch" },
];

const USE_CASES: UseCase[] = ["lap-trinh", "van-phong", "thiet-ke", "gaming", "dung-video"];

const VALUE_SCORE_OPTIONS = [
  { label: "Tất cả", value: 0 },
  { label: "70 điểm trở lên", value: 70 },
  { label: "80 điểm trở lên", value: 80 },
  { label: "90 điểm trở lên", value: 90 },
];

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group border-b border-slate-100 py-3.5 last:border-b-0" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-800">
        {title}
        <svg
          className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="mt-3 flex flex-col gap-2">{children}</div>
    </details>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 shrink-0 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
      />
      <span className="line-clamp-1">{label}</span>
    </label>
  );
}

function toggle<T>(list: T[] | undefined, value: T): T[] {
  const arr = list ?? [];
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function FilterPanel({
  facets,
  filters,
  onChange,
  onReset,
}: {
  facets: Facets;
  filters: LaptopFilters;
  onChange: (patch: Partial<LaptopFilters>) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-sm font-bold text-slate-900">Bộ lọc</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-brand-700 hover:underline"
        >
          Xoá tất cả
        </button>
      </div>

      <Section title="Khoảng giá (triệu đồng)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Từ"
            value={filters.minPrice ? filters.minPrice / 1_000_000 : ""}
            onChange={(e) =>
              onChange({ minPrice: e.target.value ? Number(e.target.value) * 1_000_000 : undefined })
            }
            className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
          />
          <span className="text-slate-400">–</span>
          <input
            type="number"
            min={0}
            placeholder="Đến"
            value={filters.maxPrice ? filters.maxPrice / 1_000_000 : ""}
            onChange={(e) =>
              onChange({ maxPrice: e.target.value ? Number(e.target.value) * 1_000_000 : undefined })
            }
            className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
      </Section>

      <Section title="Hãng">
        {facets.brands.map((b) => (
          <Checkbox
            key={b}
            label={b}
            checked={!!filters.brands?.includes(b)}
            onChange={() => onChange({ brands: toggle(filters.brands, b) })}
          />
        ))}
      </Section>

      <Section title="CPU" defaultOpen={false}>
        {facets.cpuFamilies.map((c) => (
          <Checkbox
            key={c}
            label={c}
            checked={!!filters.cpuFamilies?.includes(c)}
            onChange={() => onChange({ cpuFamilies: toggle(filters.cpuFamilies, c) })}
          />
        ))}
      </Section>

      <Section title="RAM">
        {facets.rams.map((r) => (
          <Checkbox
            key={r}
            label={`${r}GB`}
            checked={!!filters.rams?.includes(r)}
            onChange={() => onChange({ rams: toggle(filters.rams, r) })}
          />
        ))}
      </Section>

      <Section title="Card đồ hoạ" defaultOpen={false}>
        {facets.gpus.map((g) => (
          <Checkbox
            key={g.key}
            label={g.label}
            checked={!!filters.gpuKeys?.includes(g.key)}
            onChange={() => onChange({ gpuKeys: toggle(filters.gpuKeys, g.key) })}
          />
        ))}
      </Section>

      <Section title="Kích thước màn hình" defaultOpen={false}>
        {SCREEN_BUCKETS.map((s) => (
          <Checkbox
            key={s.key}
            label={s.label}
            checked={!!filters.screenBuckets?.includes(s.key)}
            onChange={() => onChange({ screenBuckets: toggle(filters.screenBuckets, s.key) })}
          />
        ))}
      </Section>

      <Section title="Mục đích sử dụng">
        {USE_CASES.map((uc) => (
          <Checkbox
            key={uc}
            label={USE_CASE_LABEL[uc]}
            checked={!!filters.useCases?.includes(uc)}
            onChange={() => onChange({ useCases: toggle(filters.useCases, uc) })}
          />
        ))}
      </Section>

      <Section title="Điểm đáng tiền">
        <select
          value={filters.minValueScore ?? 0}
          onChange={(e) => onChange({ minValueScore: Number(e.target.value) || undefined })}
          className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
        >
          {VALUE_SCORE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Section>

      <Section title="Giá">
        <Checkbox
          label='Chỉ hiển thị sản phẩm đang có "Giá tốt"'
          checked={!!filters.goodPriceOnly}
          onChange={(v) => onChange({ goodPriceOnly: v || undefined })}
        />
      </Section>
    </div>
  );
}

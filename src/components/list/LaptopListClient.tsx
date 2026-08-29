"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { filterLaptops, type LaptopFilters } from "@/lib/filterLaptops";
import { buildFacets } from "@/lib/facets";
import { parseFiltersFromSearchParams, serializeFiltersToSearchParams } from "@/lib/urlFilters";
import { calculateValueScore } from "@/lib/scoring";
import { getBestCurrentPrice } from "@/lib/price";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterPanel } from "@/components/list/FilterPanel";
import { EmptyState } from "@/components/ui/States";
import type { Laptop } from "@/types/laptop";

type SortKey = "value-desc" | "price-asc" | "price-desc";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "value-desc", label: "Đáng tiền nhất" },
  { key: "price-asc", label: "Giá thấp đến cao" },
  { key: "price-desc", label: "Giá cao đến thấp" },
];

function sortLaptops(list: Laptop[], sort: SortKey): Laptop[] {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => getBestCurrentPrice(a) - getBestCurrentPrice(b));
    case "price-desc":
      return copy.sort((a, b) => getBestCurrentPrice(b) - getBestCurrentPrice(a));
    case "value-desc":
    default:
      return copy.sort((a, b) => calculateValueScore(b).total - calculateValueScore(a).total);
  }
}

export function LaptopListClient({ laptops: allLaptops }: { laptops: Laptop[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filters = useMemo(
    () => parseFiltersFromSearchParams(searchParams),
    [searchParams]
  );
  const sort = (searchParams.get("sort") as SortKey) || "value-desc";
  const facets = useMemo(() => buildFacets(allLaptops), [allLaptops]);
  const results = useMemo(
    () => sortLaptops(filterLaptops(allLaptops, filters), sort),
    [allLaptops, filters, sort]
  );

  function updateFilters(patch: Partial<LaptopFilters>) {
    const next = { ...filters, ...patch };
    const params = serializeFiltersToSearchParams(next);
    if (sort !== "value-desc") params.set("sort", sort);
    router.replace(`/laptop?${params.toString()}`, { scroll: false });
  }

  function updateSort(nextSort: SortKey) {
    const params = serializeFiltersToSearchParams(filters);
    if (nextSort !== "value-desc") params.set("sort", nextSort);
    router.replace(`/laptop?${params.toString()}`, { scroll: false });
  }

  function resetFilters() {
    router.replace("/laptop", { scroll: false });
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Tìm laptop</h1>
        {filters.q && (
          <p className="mt-1 text-sm text-slate-500">
            Kết quả cho “{filters.q}”
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-4">
            <FilterPanel
              facets={facets}
              filters={filters}
              onChange={updateFilters}
              onReset={resetFilters}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 lg:hidden"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
              </svg>
              Bộ lọc
            </button>
            <span className="hidden text-sm text-slate-500 sm:block">
              {results.length} kết quả
            </span>
            <select
              value={sort}
              onChange={(e) => updateSort(e.target.value as SortKey)}
              className="ml-auto rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {results.length === 0 ? (
            <EmptyState
              action={
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
                >
                  Xoá bộ lọc
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((l) => (
                <ProductCard key={l.id} laptop={l} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Đóng bộ lọc"
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Bộ lọc</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
                aria-label="Đóng"
              >
                ×
              </button>
            </div>
            <FilterPanel
              facets={facets}
              filters={filters}
              onChange={updateFilters}
              onReset={resetFilters}
            />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="mt-4 w-full rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Xem {results.length} kết quả
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

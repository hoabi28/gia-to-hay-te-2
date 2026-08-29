import type { Brand, UseCase } from "@/types/laptop";
import type { LaptopFilters, ScreenBucket } from "@/lib/filterLaptops";

function parseList<T extends string>(v: string | null): T[] | undefined {
  if (!v) return undefined;
  const arr = v.split(",").filter(Boolean) as T[];
  return arr.length ? arr : undefined;
}

function parseNumList(v: string | null): number[] | undefined {
  if (!v) return undefined;
  const arr = v
    .split(",")
    .map(Number)
    .filter((n) => !Number.isNaN(n));
  return arr.length ? arr : undefined;
}

export function parseFiltersFromSearchParams(params: URLSearchParams): LaptopFilters {
  return {
    q: params.get("q") ?? undefined,
    minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : undefined,
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
    brands: parseList<Brand>(params.get("brands")),
    cpuFamilies: parseList<string>(params.get("cpu")),
    rams: parseNumList(params.get("rams")),
    gpuKeys: parseList<string>(params.get("gpu")),
    screenBuckets: parseList<ScreenBucket>(params.get("screen")),
    useCases: params.get("useCase")
      ? (params.get("useCase")!.split(",") as UseCase[])
      : undefined,
    minValueScore: params.get("minScore") ? Number(params.get("minScore")) : undefined,
    goodPriceOnly: params.get("goodPriceOnly") === "1",
  };
}

export function serializeFiltersToSearchParams(filters: LaptopFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.brands?.length) params.set("brands", filters.brands.join(","));
  if (filters.cpuFamilies?.length) params.set("cpu", filters.cpuFamilies.join(","));
  if (filters.rams?.length) params.set("rams", filters.rams.join(","));
  if (filters.gpuKeys?.length) params.set("gpu", filters.gpuKeys.join(","));
  if (filters.screenBuckets?.length) params.set("screen", filters.screenBuckets.join(","));
  if (filters.useCases?.length) params.set("useCase", filters.useCases.join(","));
  if (filters.minValueScore) params.set("minScore", String(filters.minValueScore));
  if (filters.goodPriceOnly) params.set("goodPriceOnly", "1");
  return params;
}

import type { Brand, Laptop, UseCase } from "@/types/laptop";
import { getBestCurrentPrice, isGoodPrice } from "@/lib/price";
import { calculateValueScore } from "@/lib/scoring";

export type ScreenBucket = "13-14" | "15-16" | "16+";

export interface LaptopFilters {
  q?: string;
  minPrice?: number;
  maxPrice?: number; // 0 hoặc undefined = không giới hạn trên
  brands?: Brand[];
  cpuFamilies?: string[];
  rams?: number[];
  /** "tich-hop" hoặc tên GPU rời cụ thể, vd "NVIDIA RTX 4060 8GB" */
  gpuKeys?: string[];
  screenBuckets?: ScreenBucket[];
  useCases?: UseCase[];
  minValueScore?: number;
  goodPriceOnly?: boolean;
}

export function getScreenBucket(size: number): ScreenBucket {
  if (size < 15) return "13-14";
  if (size <= 16 && size >= 15) return "15-16";
  return "16+";
}

export function gpuKeyOf(laptop: Laptop): string {
  return laptop.specs.gpuType === "tich-hop" ? "tich-hop" : laptop.specs.gpu;
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function matchesQuery(laptop: Laptop, q: string): boolean {
  const haystack = normalize(
    [laptop.name, laptop.brand, laptop.series, laptop.specs.cpuFamily, ...laptop.tags].join(" ")
  );
  return normalize(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function filterLaptops(laptops: Laptop[], filters: LaptopFilters): Laptop[] {
  return laptops.filter((l) => {
    if (filters.q && filters.q.trim() && !matchesQuery(l, filters.q)) return false;

    const price = getBestCurrentPrice(l);
    if (filters.minPrice && price < filters.minPrice) return false;
    if (filters.maxPrice && filters.maxPrice > 0 && price > filters.maxPrice) return false;

    if (filters.brands?.length && !filters.brands.includes(l.brand)) return false;

    if (filters.cpuFamilies?.length && !filters.cpuFamilies.includes(l.specs.cpuFamily))
      return false;

    if (filters.rams?.length && !filters.rams.includes(l.specs.ram)) return false;

    if (filters.gpuKeys?.length && !filters.gpuKeys.includes(gpuKeyOf(l))) return false;

    if (
      filters.screenBuckets?.length &&
      !filters.screenBuckets.includes(getScreenBucket(l.specs.screenSize))
    )
      return false;

    if (filters.useCases?.length && !filters.useCases.some((uc) => l.useCases.includes(uc)))
      return false;

    if (filters.minValueScore && calculateValueScore(l).total < filters.minValueScore)
      return false;

    if (filters.goodPriceOnly && !isGoodPrice(l)) return false;

    return true;
  });
}

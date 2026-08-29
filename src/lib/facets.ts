import type { Brand, Laptop } from "@/types/laptop";
import { gpuKeyOf } from "@/lib/filterLaptops";

export interface Facets {
  brands: Brand[];
  cpuFamilies: string[];
  rams: number[];
  gpus: { key: string; label: string }[];
}

export function buildFacets(laptops: Laptop[]): Facets {
  const brands = Array.from(new Set(laptops.map((l) => l.brand))).sort();
  const cpuFamilies = Array.from(new Set(laptops.map((l) => l.specs.cpuFamily))).sort();
  const rams = Array.from(new Set(laptops.map((l) => l.specs.ram))).sort((a, b) => a - b);

  const gpuMap = new Map<string, string>();
  for (const l of laptops) {
    const key = gpuKeyOf(l);
    gpuMap.set(key, key === "tich-hop" ? "Card đồ hoạ tích hợp" : key);
  }
  const gpus = Array.from(gpuMap, ([key, label]) => ({ key, label })).sort((a, b) =>
    a.key === "tich-hop" ? -1 : b.key === "tich-hop" ? 1 : a.label.localeCompare(b.label)
  );

  return { brands, cpuFamilies, rams, gpus };
}

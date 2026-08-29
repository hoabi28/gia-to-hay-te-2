import type { Laptop } from "@/types/laptop";
import { getBestCurrentPrice } from "@/lib/price";
import { calculateValueScore } from "@/lib/scoring";
import { USE_CASE_LABEL, type UseCase } from "@/types/laptop";

const USE_CASES: UseCase[] = ["lap-trinh", "thiet-ke", "gaming", "dung-video", "van-phong"];

const CRITERIA_REASON: { key: "screen" | "battery" | "durability" | "warranty"; label: string }[] = [
  { key: "screen", label: "màn hình đẹp hơn" },
  { key: "battery", label: "pin tốt hơn" },
  { key: "durability", label: "độ bền / tản nhiệt tốt hơn" },
  { key: "warranty", label: "bảo hành tốt hơn" },
];

const MIN_DIFF = 5;

export interface ComparisonConclusion {
  reasonsA: string[];
  reasonsB: string[];
  betterValueLaptop: Laptop;
  worseValueLaptop: Laptop;
  valueGap: number;
  pricierLaptop: Laptop;
  cheaperLaptop: Laptop;
  priceDiff: number;
  priceDiffPercent: number;
  priceGapWorthIt: boolean;
}

export function generateComparisonConclusion(a: Laptop, b: Laptop): ComparisonConclusion {
  const reasonsA: string[] = [];
  const reasonsB: string[] = [];

  for (const uc of USE_CASES) {
    const diff = a.performance[uc] - b.performance[uc];
    if (Math.abs(diff) >= MIN_DIFF) {
      const label = `hiệu năng ${USE_CASE_LABEL[uc].toLowerCase()} tốt hơn`;
      if (diff > 0) reasonsA.push(label);
      else reasonsB.push(label);
    }
  }

  for (const c of CRITERIA_REASON) {
    const diff = a.criteria[c.key] - b.criteria[c.key];
    if (Math.abs(diff) >= MIN_DIFF) {
      if (diff > 0) reasonsA.push(c.label);
      else reasonsB.push(c.label);
    }
  }

  const priceA = getBestCurrentPrice(a);
  const priceB = getBestCurrentPrice(b);
  if (priceA < priceB) reasonsA.push("giá hiện tại rẻ hơn");
  if (priceB < priceA) reasonsB.push("giá hiện tại rẻ hơn");

  const valueA = calculateValueScore(a).total;
  const valueB = calculateValueScore(b).total;
  const betterValueLaptop = valueA >= valueB ? a : b;
  const worseValueLaptop = valueA >= valueB ? b : a;
  const valueGap = Math.abs(valueA - valueB);

  const pricierLaptop = priceA >= priceB ? a : b;
  const cheaperLaptop = priceA >= priceB ? b : a;
  const priceDiff = Math.abs(priceA - priceB);
  const priceDiffPercent = priceDiff / Math.min(priceA, priceB);

  const pricierValue = pricierLaptop.id === a.id ? valueA : valueB;
  const cheaperValue = cheaperLaptop.id === a.id ? valueA : valueB;
  const priceGapWorthIt = priceDiff === 0 || pricierValue >= cheaperValue;

  return {
    reasonsA,
    reasonsB,
    betterValueLaptop,
    worseValueLaptop,
    valueGap,
    pricierLaptop,
    cheaperLaptop,
    priceDiff,
    priceDiffPercent,
    priceGapWorthIt,
  };
}

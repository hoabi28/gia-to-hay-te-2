"use client";

import Link from "next/link";
import type { Laptop } from "@/types/laptop";
import { getBestCurrentPrice, getAvg30d, isGoodPrice } from "@/lib/price";
import { calculateValueScore } from "@/lib/scoring";
import { formatVND } from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";
import { ValueScoreBadge } from "@/components/ui/ValueScoreBadge";
import { Tag, GoodPriceTag } from "@/components/ui/Tag";
import { useCompareIds } from "@/lib/useCompare";
import { toggleCompare, MAX_COMPARE } from "@/lib/compareStore";

export function ProductCard({ laptop }: { laptop: Laptop }) {
  const price = getBestCurrentPrice(laptop);
  const avg30d = getAvg30d(laptop);
  const goodPrice = isGoodPrice(laptop);
  const { total: valueScore } = calculateValueScore(laptop);
  const compareIds = useCompareIds();
  const inCompare = compareIds.includes(laptop.id);
  const compareFull = compareIds.length >= MAX_COMPARE && !inCompare;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
      <Link href={`/laptop/${laptop.id}`} className="block">
        <ProductImage
          category={laptop.category}
          imageUrl={laptop.image}
          alt={laptop.name}
          className="aspect-[4/3] w-full"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/laptop/${laptop.id}`} className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-brand-700">
              {laptop.name}
            </h3>
          </Link>
          <ValueScoreBadge score={valueScore} size="sm" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {laptop.tags.slice(0, 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <div className="mt-auto space-y-0.5 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-900">{formatVND(price)}</span>
            {goodPrice && <GoodPriceTag compact />}
          </div>
          <div className="text-xs text-slate-400">
            TB 30 ngày: <span className="line-through">{formatVND(avg30d)}</span>
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <Link
            href={`/laptop/${laptop.id}`}
            className="flex-1 rounded-lg bg-brand-700 px-3 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Xem chi tiết
          </Link>
          <button
            type="button"
            disabled={compareFull}
            onClick={() => toggleCompare(laptop.id)}
            title={compareFull ? "Đã chọn đủ 2 máy để so sánh" : undefined}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
              inCompare
                ? "border-brand-700 bg-brand-50 text-brand-700"
                : "border-slate-300 text-slate-600 hover:bg-slate-50"
            } ${compareFull ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {inCompare ? "Đã chọn" : "So sánh"}
          </button>
        </div>
      </div>
    </div>
  );
}

import type { Laptop } from "@/types/laptop";
import { getMin90d, getAvg30d, getBestCurrentPrice, getPriceRating } from "@/lib/price";
import { formatVND } from "@/lib/format";
import { PRICE_RATING_LABEL } from "@/types/laptop";

const RATING_STYLE: Record<string, string> = {
  "gia-tot": "bg-good-50 text-good-700 ring-good-600/20",
  "binh-thuong": "bg-slate-100 text-slate-600 ring-slate-400/20",
  "nen-cho": "bg-warn-50 text-warn-700 ring-warn-600/20",
};

export function PriceIndicators({ laptop }: { laptop: Laptop }) {
  const min90 = getMin90d(laptop);
  const avg30 = getAvg30d(laptop);
  const current = getBestCurrentPrice(laptop);
  const rating = getPriceRating(laptop);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-xs text-slate-500">Giá thấp nhất 90 ngày</p>
        <p className="mt-1 text-base font-bold text-slate-900">{formatVND(min90)}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-xs text-slate-500">Giá trung bình 30 ngày</p>
        <p className="mt-1 text-base font-bold text-slate-900">{formatVND(avg30)}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-xs text-slate-500">Giá hiện tại</p>
        <p className="mt-1 text-base font-bold text-brand-700">{formatVND(current)}</p>
      </div>
      <div
        className={`flex flex-col justify-center rounded-xl p-3 ring-1 ${RATING_STYLE[rating]}`}
      >
        <p className="text-xs opacity-80">Đánh giá giá hiện tại</p>
        <p className="mt-1 text-base font-bold">{PRICE_RATING_LABEL[rating]}</p>
      </div>
    </div>
  );
}

"use client";

import type { StoreOffer } from "@/types/laptop";
import { formatVND } from "@/lib/format";

export function StoreList({ stores }: { stores: StoreOffer[] }) {
  const sorted = [...stores].sort((a, b) => {
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
    return a.price - b.price;
  });
  const lowestPrice = Math.min(...stores.filter((s) => s.inStock).map((s) => s.price));

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((s) => (
        <div
          key={s.store}
          className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
            s.inStock ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-70"
          }`}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">{s.store}</span>
              {s.inStock && s.price === lowestPrice && (
                <span className="rounded-full bg-good-50 px-2 py-0.5 text-[11px] font-semibold text-good-700 ring-1 ring-good-600/20">
                  Rẻ nhất
                </span>
              )}
              {!s.inStock && (
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                  Hết hàng
                </span>
              )}
            </div>
            <dl className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <div>
                <dt className="inline">Giao hàng: </dt>
                <dd className="inline font-medium text-slate-600">
                  {s.shippingFee === 0 ? "Miễn phí" : formatVND(s.shippingFee)}
                </dd>
              </div>
              <div>
                <dt className="inline">Bảo hành: </dt>
                <dd className="inline font-medium text-slate-600">{s.warrantyMonths} tháng</dd>
              </div>
              {s.gift && (
                <div>
                  <dt className="inline">Quà tặng: </dt>
                  <dd className="inline font-medium text-slate-600">{s.gift}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="text-lg font-bold text-slate-900">{formatVND(s.price)}</span>
            <a
              href={s.inStock ? s.url : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!s.inStock}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
                s.inStock
                  ? "bg-brand-700 hover:bg-brand-800"
                  : "cursor-not-allowed bg-slate-300"
              }`}
              onClick={(e) => {
                if (!s.inStock) e.preventDefault();
              }}
            >
              Đến cửa hàng
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

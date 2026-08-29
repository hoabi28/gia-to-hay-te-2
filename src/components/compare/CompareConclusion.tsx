import type { Laptop } from "@/types/laptop";
import { generateComparisonConclusion } from "@/lib/compareLaptops";
import { formatVND } from "@/lib/format";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function CompareConclusion({ a, b }: { a: Laptop; b: Laptop }) {
  const c = generateComparisonConclusion(a, b);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-900">Chọn {a.name} nếu bạn ưu tiên…</h3>
          {c.reasonsA.length > 0 ? (
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              {c.reasonsA.map((r, i) => (
                <li key={i} className="flex gap-1.5">
                  <span className="text-brand-600">•</span>
                  {capitalize(r)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              Không có điểm khác biệt đáng kể so với {b.name} ở các tiêu chí chính.
            </p>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-900">Chọn {b.name} nếu bạn ưu tiên…</h3>
          {c.reasonsB.length > 0 ? (
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              {c.reasonsB.map((r, i) => (
                <li key={i} className="flex gap-1.5">
                  <span className="text-brand-600">•</span>
                  {capitalize(r)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              Không có điểm khác biệt đáng kể so với {a.name} ở các tiêu chí chính.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
        <h3 className="text-sm font-bold text-brand-800">
          Máy nào đáng mua hơn với ngân sách hiện tại?
        </h3>
        <p className="mt-2 text-sm text-slate-700">
          <strong>{c.betterValueLaptop.name}</strong> có điểm đáng tiền cao hơn
          {c.valueGap > 0 ? ` ${c.valueGap} điểm` : " (hai máy gần như bằng điểm)"} so với{" "}
          {c.worseValueLaptop.name}, tức đang cân bằng tốt hơn giữa hiệu năng, chất lượng và
          giá tại mức ngân sách hiện tại.
        </p>
      </div>

      <div className="rounded-xl border border-good-100 bg-good-50 p-4">
        <h3 className="text-sm font-bold text-good-700">Khoản chênh lệch giá có xứng đáng không?</h3>
        {c.priceDiff === 0 ? (
          <p className="mt-2 text-sm text-slate-700">
            Hai máy đang có giá tốt nhất bằng nhau, nên chỉ cần chọn theo nhu cầu sử dụng ở
            trên, không cần cân nhắc thêm về giá.
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate-700">
            {c.pricierLaptop.name} đắt hơn {c.cheaperLaptop.name} khoảng{" "}
            <strong>{formatVND(c.priceDiff)}</strong> ({Math.round(c.priceDiffPercent * 100)}%).{" "}
            {c.priceGapWorthIt ? (
              <>
                Xét điểm đáng tiền, khoản chênh lệch này{" "}
                <strong className="text-good-700">xứng đáng</strong> — {c.pricierLaptop.name}{" "}
                vẫn đang cân bằng giá/hiệu năng tốt hơn hoặc tương đương.
              </>
            ) : (
              <>
                Xét điểm đáng tiền, khoản chênh lệch này{" "}
                <strong className="text-warn-700">chưa thực sự xứng đáng</strong> — trừ khi bạn
                cần cụ thể những ưu điểm riêng của {c.pricierLaptop.name} ở trên, {c.cheaperLaptop.name}{" "}
                đang là lựa chọn hợp lý hơn về giá trị.
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

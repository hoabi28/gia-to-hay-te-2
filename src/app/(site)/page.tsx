import Link from "next/link";
import { getAllLaptops } from "@/lib/laptopRepo";
import { calculateValueScore, DEFAULT_WEIGHTS } from "@/lib/scoring";
import { isGoodPrice, getBestCurrentPrice, getAvg30d } from "@/lib/price";
import { SearchBar } from "@/components/ui/SearchBar";
import { ProductCard } from "@/components/product/ProductCard";
import { USE_CASE_LABEL, type UseCase } from "@/types/laptop";

// Trang tĩnh mặc định bị Vercel cache dai dẳng ở tầng CDN kể cả sau khi deploy lại —
// buộc render động để luôn khớp dữ liệu DB hiện tại.
export const dynamic = "force-dynamic";

const QUICK_NEEDS: UseCase[] = [
  "lap-trinh",
  "van-phong",
  "thiet-ke",
  "gaming",
  "dung-video",
];

const BUDGETS = [
  { label: "Dưới 15 triệu", min: 0, max: 15_000_000 },
  { label: "15–20 triệu", min: 15_000_000, max: 20_000_000 },
  { label: "20–30 triệu", min: 20_000_000, max: 30_000_000 },
  { label: "Trên 30 triệu", min: 30_000_000, max: 0 },
];

const SCORE_ROWS = [
  { key: "performance", label: "Hiệu năng theo nhu cầu", weight: DEFAULT_WEIGHTS.performance },
  { key: "screen", label: "Chất lượng màn hình", weight: DEFAULT_WEIGHTS.screen },
  { key: "battery", label: "Pin", weight: DEFAULT_WEIGHTS.battery },
  { key: "durability", label: "Độ bền / tản nhiệt", weight: DEFAULT_WEIGHTS.durability },
  { key: "warranty", label: "Bảo hành", weight: DEFAULT_WEIGHTS.warranty },
  { key: "price", label: "Giá hiện tại so với TB 30 ngày & đối thủ", weight: DEFAULT_WEIGHTS.price },
];

export default async function Home() {
  const laptops = await getAllLaptops();

  const topPicks = [...laptops]
    .sort((a, b) => calculateValueScore(b).total - calculateValueScore(a).total)
    .slice(0, 6);

  const goodPriceNow = laptops
    .filter(isGoodPrice)
    .sort((a, b) => {
      const discA = (getAvg30d(a) - getBestCurrentPrice(a)) / getAvg30d(a);
      const discB = (getAvg30d(b) - getBestCurrentPrice(b)) / getAvg30d(b);
      return discB - discA;
    })
    .slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6 sm:py-20">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Chọn đúng laptop, đúng nhu cầu, đúng giá
          </h1>
          <p className="max-w-xl text-sm text-slate-600 sm:text-base">
            Không cần đọc hàng chục bảng thông số hay bài review. Lọc theo ngân sách và
            mục đích sử dụng, xem điểm đáng tiền minh bạch, so sánh giá tại nhiều cửa hàng
            chỉ trong một trang.
          </p>

          <SearchBar size="lg" className="max-w-xl" />

          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {QUICK_NEEDS.map((uc) => (
              <Link
                key={uc}
                href={`/laptop?useCase=${uc}`}
                className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-brand-600 hover:text-brand-700"
              >
                {USE_CASE_LABEL[uc]}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {BUDGETS.map((b) => (
              <Link
                key={b.label}
                href={`/laptop?minPrice=${b.min}&maxPrice=${b.max}`}
                className="rounded-full bg-slate-900/5 px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-900/10"
              >
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Laptop đáng mua hôm nay */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Laptop đáng mua hôm nay</h2>
            <p className="mt-1 text-sm text-slate-500">
              Xếp hạng theo điểm đáng tiền — cân bằng giữa hiệu năng, chất lượng và giá.
            </p>
          </div>
          <Link
            href="/laptop"
            className="hidden shrink-0 text-sm font-semibold text-brand-700 hover:underline sm:block"
          >
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topPicks.map((l) => (
            <ProductCard key={l.id} laptop={l} />
          ))}
        </div>
      </section>

      {/* Đang có giá tốt */}
      <section className="border-t border-slate-200 bg-good-50/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Đang có giá tốt</h2>
              <p className="mt-1 text-sm text-slate-500">
                Giá hiện tại thấp hơn ít nhất 8% so với giá trung bình 30 ngày gần nhất.
              </p>
            </div>
            <Link
              href="/laptop?goodPriceOnly=1"
              className="hidden shrink-0 text-sm font-semibold text-brand-700 hover:underline sm:block"
            >
              Xem tất cả →
            </Link>
          </div>
          {goodPriceNow.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {goodPriceNow.map((l) => (
                <ProductCard key={l.id} laptop={l} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Hiện chưa có máy nào đang giảm giá sâu. Quay lại sau nhé.
            </p>
          )}
        </div>
      </section>

      {/* Giải thích điểm đáng tiền */}
      <section className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="text-xl font-bold text-slate-900">
          Điểm đáng tiền được tính như thế nào?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Mỗi laptop được chấm điểm trên thang 100 dựa trên 6 tiêu chí, mỗi tiêu chí có
          trọng số khác nhau. Công thức minh bạch, không có yếu tố tài trợ hay quảng cáo
          ảnh hưởng tới kết quả.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {SCORE_ROWS.map((row, i) => (
            <div
              key={row.key}
              className={`flex items-center justify-between gap-4 px-5 py-3.5 text-sm ${
                i !== SCORE_ROWS.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <span className="text-slate-700">{row.label}</span>
              <span className="shrink-0 font-semibold text-brand-700">
                {Math.round(row.weight * 100)}%
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Xem chi tiết cách tính và điểm từng tiêu chí ngay trên trang chi tiết của mỗi laptop.
        </p>
      </section>
    </div>
  );
}

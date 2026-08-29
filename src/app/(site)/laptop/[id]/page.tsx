import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllLaptops, getLaptopById, getSimilarLaptops } from "@/lib/laptopRepo";
import { calculateValueScore } from "@/lib/scoring";
import { getBestCurrentPrice, isGoodPrice } from "@/lib/price";
import { formatVND } from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";
import { ValueScoreBadge } from "@/components/ui/ValueScoreBadge";
import { Tag, GoodPriceTag } from "@/components/ui/Tag";
import { VerdictBox } from "@/components/detail/VerdictBox";
import { StoreList } from "@/components/detail/StoreList";
import { PriceHistoryChart } from "@/components/detail/PriceHistoryChart";
import { PriceIndicators } from "@/components/detail/PriceIndicators";
import { SpecTable } from "@/components/detail/SpecTable";
import { ScoreBreakdown } from "@/components/detail/ScoreBreakdown";
import { ReviewsSection } from "@/components/detail/ReviewsSection";
import { SimilarProducts } from "@/components/detail/SimilarProducts";
import { AddToCompareButton } from "@/components/detail/AddToCompareButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildProductJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Dữ liệu có thể đổi bất kỳ lúc nào qua trang admin — không prerender toàn bộ lúc build,
// dùng ISR (revalidate định kỳ) làm lưới an toàn, kết hợp revalidatePath() từ admin để
// trang cập nhật ngay sau khi lưu.
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const laptop = await getLaptopById(id);
  if (!laptop) return { title: "Không tìm thấy sản phẩm" };

  const title = `${laptop.name} — Giá tốt nhất, đánh giá & điểm đáng tiền`;
  const description = `${laptop.bestFor}. Giá tốt nhất hiện tại: ${formatVND(
    getBestCurrentPrice(laptop)
  )}. So sánh giá tại ${laptop.stores.length} cửa hàng, xem lịch sử giá 90 ngày và điểm đáng tiền minh bạch.`;
  const path = `/laptop/${laptop.id}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
    twitter: { title, description },
  };
}

export default async function LaptopDetailPage({ params }: PageProps) {
  const { id } = await params;
  const laptop = await getLaptopById(id);
  if (!laptop) notFound();

  const price = getBestCurrentPrice(laptop);
  const goodPrice = isGoodPrice(laptop);
  const { total: valueScore } = calculateValueScore(laptop);
  const allLaptops = await getAllLaptops();
  const similar = getSimilarLaptops(laptop, allLaptops, 4);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <JsonLd data={buildProductJsonLd(laptop)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Tìm laptop", path: "/laptop" },
          { name: laptop.name, path: `/laptop/${laptop.id}` },
        ])}
      />
      <nav className="mb-4 text-xs text-slate-400">
        <Link href="/" className="hover:text-brand-700">
          Trang chủ
        </Link>{" "}
        /{" "}
        <Link href="/laptop" className="hover:text-brand-700">
          Tìm laptop
        </Link>{" "}
        / <span className="text-slate-500">{laptop.name}</span>
      </nav>

      {/* Header */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[280px_1fr]">
        <ProductImage category={laptop.category} className="aspect-[4/3] w-full rounded-2xl" />

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">
                {laptop.brand} · {laptop.series}
              </p>
              <h1 className="text-2xl font-bold text-slate-900">{laptop.name}</h1>
            </div>
            <ValueScoreBadge score={valueScore} size="lg" />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {laptop.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>

          <p className="text-sm text-slate-600">
            {laptop.specs.cpu} · {laptop.specs.ram}GB RAM · {laptop.specs.gpu} ·{" "}
            {laptop.specs.screenSize}&quot; {laptop.specs.screenPanel}
          </p>

          <div className="mt-1 flex items-center gap-3">
            <span className="text-2xl font-extrabold text-slate-900">{formatVND(price)}</span>
            {goodPrice && <GoodPriceTag />}
          </div>

          <div className="mt-1 flex flex-wrap gap-2">
            <a
              href="#cua-hang"
              className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
            >
              Xem giá tại cửa hàng
            </a>
            <AddToCompareButton id={laptop.id} />
          </div>
        </div>
      </div>

      {/* Verdict */}
      <section className="mt-8">
        <VerdictBox laptop={laptop} />
      </section>

      {/* Ưu điểm / Nhược điểm */}
      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900">Ưu điểm</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {laptop.pros.map((p, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="text-good-600">+</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900">Nhược điểm</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {laptop.cons.map((c, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="text-red-500">−</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cửa hàng */}
      <section id="cua-hang" className="mt-8 scroll-mt-20">
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          Giá tại {laptop.stores.length} cửa hàng
        </h2>
        <StoreList stores={laptop.stores} />
      </section>

      {/* Lịch sử giá */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Lịch sử giá 90 ngày</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <PriceHistoryChart history={laptop.priceHistory} />
        </div>
        <div className="mt-4">
          <PriceIndicators laptop={laptop} />
        </div>
      </section>

      {/* Thông số kỹ thuật */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Thông số kỹ thuật</h2>
        <SpecTable laptop={laptop} />
      </section>

      {/* Điểm đáng tiền */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Điểm đáng tiền chi tiết</h2>
        <ScoreBreakdown laptop={laptop} />
      </section>

      {/* Nhận xét cộng đồng */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Nhận xét cộng đồng</h2>
        <ReviewsSection reviews={laptop.reviews} />
      </section>

      {/* Sản phẩm thay thế */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Sản phẩm thay thế cùng tầm giá</h2>
        <SimilarProducts laptops={similar} />
      </section>
    </div>
  );
}

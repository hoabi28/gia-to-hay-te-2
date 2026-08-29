import type { Laptop } from "@/types/laptop";
import { getBestCurrentPrice } from "@/lib/price";
import { SITE_URL } from "@/lib/site";

/** Product + Offer structured data cho trang chi tiết — giúp Google hiển thị giá/đánh giá ngay trên kết quả tìm kiếm. */
export function buildProductJsonLd(laptop: Laptop): Record<string, unknown> {
  const url = `${SITE_URL}/laptop/${laptop.id}`;
  const avgRating =
    laptop.reviews.reduce((sum, r) => sum + r.rating, 0) / (laptop.reviews.length || 1);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: laptop.name,
    brand: { "@type": "Brand", name: laptop.brand },
    description: laptop.bestFor,
    url,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "VND",
      lowPrice: getBestCurrentPrice(laptop),
      highPrice: Math.max(...laptop.stores.map((s) => s.price)),
      offerCount: laptop.stores.length,
      offers: laptop.stores.map((s) => ({
        "@type": "Offer",
        seller: { "@type": "Organization", name: s.store },
        price: s.price,
        priceCurrency: "VND",
        availability: s.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url,
      })),
    },
    ...(laptop.reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Math.round(avgRating * 10) / 10,
        reviewCount: laptop.reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

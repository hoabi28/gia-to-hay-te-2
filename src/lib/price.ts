import type { Laptop, PriceRating, StoreOffer } from "@/types/laptop";

/** Giá tốt nhất hiện tại = giá thấp nhất trong các cửa hàng còn hàng. */
export function getBestCurrentPrice(laptop: Laptop): number {
  const inStock = laptop.stores.filter((s) => s.inStock);
  const pool = inStock.length > 0 ? inStock : laptop.stores;
  return Math.min(...pool.map((s) => s.price));
}

export function getBestStoreOffer(laptop: Laptop): StoreOffer {
  const inStock = laptop.stores.filter((s) => s.inStock);
  const pool = inStock.length > 0 ? inStock : laptop.stores;
  return pool.reduce((best, cur) => (cur.price < best.price ? cur : best));
}

function last(laptop: Laptop, days: number) {
  return laptop.priceHistory.slice(-days);
}

export function getAvg30d(laptop: Laptop): number {
  const points = last(laptop, 30);
  const sum = points.reduce((acc, p) => acc + p.price, 0);
  return Math.round(sum / points.length);
}

export function getMin90d(laptop: Laptop): number {
  return Math.min(...laptop.priceHistory.map((p) => p.price));
}

export function getMax90d(laptop: Laptop): number {
  return Math.max(...laptop.priceHistory.map((p) => p.price));
}

/** Tỉ lệ giá hiện tại rẻ hơn giá TB 30 ngày. Dương = đang rẻ hơn. */
export function getDiscountVsAvg30d(laptop: Laptop): number {
  const avg = getAvg30d(laptop);
  const current = getBestCurrentPrice(laptop);
  return (avg - current) / avg;
}

/** Nhãn "Giá tốt": hiện tại thấp hơn trung bình 30 ngày ít nhất 8%. */
export function isGoodPrice(laptop: Laptop): boolean {
  return getDiscountVsAvg30d(laptop) >= 0.08;
}

export function getPriceRating(laptop: Laptop): PriceRating {
  const current = getBestCurrentPrice(laptop);
  const min90 = getMin90d(laptop);
  const avg30 = getAvg30d(laptop);

  if (current <= min90 * 1.03) return "gia-tot";
  if (current <= avg30) return "binh-thuong";
  return "nen-cho";
}

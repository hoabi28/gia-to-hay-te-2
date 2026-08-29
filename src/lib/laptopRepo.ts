import { db } from "@/lib/db";
import type {
  Laptop,
  LaptopSpecs,
  PerformanceScores,
  ScoreCriteria,
  Brand,
  LaptopCategory,
  UseCase,
  StoreName,
  ReviewAspect,
} from "@/types/laptop";
import type {
  Laptop as LaptopRow,
  StoreOffer as StoreOfferRow,
  PriceSnapshot as PriceSnapshotRow,
  CommunityReview as CommunityReviewRow,
} from "@/generated/prisma/client";

type LaptopWithRelations = LaptopRow & {
  stores: StoreOfferRow[];
  priceSnapshots: PriceSnapshotRow[];
  reviews: CommunityReviewRow[];
};

const includeRelations = {
  stores: true,
  priceSnapshots: true,
  reviews: true,
} as const;

function toLaptop(row: LaptopWithRelations): Laptop {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand as Brand,
    series: row.series,
    category: row.category as LaptopCategory,
    useCases: row.useCases as UseCase[],
    image: row.image,
    releaseYear: row.releaseYear,
    specs: row.specs as unknown as LaptopSpecs,
    performance: row.performance as unknown as PerformanceScores,
    criteria: row.criteria as unknown as ScoreCriteria,
    warrantyMonths: row.warrantyMonths,
    pros: row.pros,
    cons: row.cons,
    buyIf: row.buyIf,
    avoidIf: row.avoidIf,
    bestFor: row.bestFor,
    tags: row.tags,
    priceHistory: [...row.priceSnapshots]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((p) => ({ date: p.date.toISOString().slice(0, 10), price: p.price })),
    stores: row.stores.map((s) => ({
      store: s.store as StoreName,
      price: s.price,
      shippingFee: s.shippingFee,
      gift: s.gift,
      warrantyMonths: s.warrantyMonths,
      inStock: s.inStock,
      url: s.url,
    })),
    reviews: row.reviews.map((r) => ({
      id: r.id,
      aspect: r.aspect as ReviewAspect,
      author: r.author,
      date: r.date.toISOString().slice(0, 10),
      rating: r.rating,
      content: r.content,
      helpfulCount: r.helpfulCount,
      usageDurationMonths: r.usageDurationMonths,
    })),
  };
}

export async function getAllLaptops(): Promise<Laptop[]> {
  const rows = await db.laptop.findMany({
    include: includeRelations,
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toLaptop);
}

export async function getLaptopById(id: string): Promise<Laptop | null> {
  const row = await db.laptop.findUnique({ where: { id }, include: includeRelations });
  return row ? toLaptop(row) : null;
}

/** Laptop khác cùng tầm giá, ưu tiên cùng nhóm (category). Hàm thuần, nhận sẵn danh sách
 * đầy đủ để không phải query lại DB cho từng lần gọi. */
export function getSimilarLaptops(laptop: Laptop, allLaptops: Laptop[], limit = 4): Laptop[] {
  const bestPrice = (l: Laptop) =>
    Math.min(...l.stores.filter((s) => s.inStock).map((s) => s.price));
  const targetPrice = bestPrice(laptop);

  return allLaptops
    .filter((l) => l.id !== laptop.id)
    .map((l) => ({
      laptop: l,
      priceDiff: Math.abs(bestPrice(l) - targetPrice),
      sameCategory: l.category === laptop.category,
    }))
    .sort((a, b) => {
      if (a.sameCategory !== b.sameCategory) return a.sameCategory ? -1 : 1;
      return a.priceDiff - b.priceDiff;
    })
    .slice(0, limit)
    .map((x) => x.laptop);
}

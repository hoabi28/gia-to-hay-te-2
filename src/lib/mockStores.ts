import type { StoreOffer, StoreName } from "@/types/laptop";

const STORE_POOL: { name: StoreName; slug: string }[] = [
  { name: "Thế Giới Di Động", slug: "thegioididong" },
  { name: "FPT Shop", slug: "fptshop" },
  { name: "CellphoneS", slug: "cellphones" },
  { name: "Phong Vũ", slug: "phongvu" },
  { name: "Nguyễn Kim", slug: "nguyenkim" },
  { name: "Hoàng Hà Mobile", slug: "hoanghamobile" },
  { name: "Anphatpc", slug: "anphatpc" },
];

const GIFTS = [
  "Balo laptop + chuột không dây",
  "Túi chống sốc cao cấp",
  "Voucher phụ kiện 500.000đ",
  "Gói vệ sinh bảo dưỡng 1 năm",
  null,
  null,
];

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

interface BuildStoresOptions {
  seed: string;
  bestPrice: number;
  warrantyMonths: number;
  storeCount?: 3 | 4 | 5;
}

/** Sinh 3-5 cửa hàng mẫu quanh mức "giá tốt nhất" của sản phẩm. */
export function buildStoreOffers({
  seed,
  bestPrice,
  warrantyMonths,
  storeCount = 4,
}: BuildStoresOptions): StoreOffer[] {
  const rand = mulberry32(hashSeed(seed + ":stores"));
  const shuffled = [...STORE_POOL].sort(() => rand() - 0.5);
  const chosen = shuffled.slice(0, storeCount);

  return chosen.map((store, idx) => {
    // Cửa hàng đầu tiên giữ đúng "giá tốt nhất", các cửa còn lại nhỉnh hơn một chút
    const markup = idx === 0 ? 0 : 0.004 + rand() * 0.028;
    const price = Math.round((bestPrice * (1 + markup)) / 10_000) * 10_000;
    const shippingFee = rand() < 0.7 ? 0 : [20_000, 30_000, 50_000][Math.floor(rand() * 3)];
    const gift = GIFTS[Math.floor(rand() * GIFTS.length)];
    const extraWarranty = rand() < 0.2 ? 1 : 0;
    // Cửa hàng có giá tốt nhất luôn còn hàng để nhất quán với lịch sử giá.
    const inStock = idx === 0 ? true : rand() > 0.12;

    return {
      store: store.name,
      price,
      shippingFee,
      gift,
      warrantyMonths: warrantyMonths + extraWarranty,
      inStock,
      url: `https://www.${store.slug}.vn/san-pham/${seed}`,
    };
  });
}

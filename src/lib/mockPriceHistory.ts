import type { PricePoint } from "@/types/laptop";

/** Ngày "hôm nay" cố định để dữ liệu mẫu luôn nhất quán giữa server và client. */
export const MOCK_TODAY = new Date("2026-08-27T00:00:00Z");

// PRNG tất định (mulberry32) — cùng seed luôn ra cùng một dãy số.
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

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

interface GenerateOptions {
  /** id sản phẩm, dùng làm seed để mỗi máy có một đường giá riêng biệt */
  seed: string;
  /** giá niêm yết tham chiếu, đường giá dao động quanh mức này */
  listPrice: number;
  /** số ngày lịch sử cần tạo */
  days?: number;
  /** biên độ giảm giá sâu nhất có thể xảy ra (vd 0.14 = giảm tối đa 14%) */
  maxDipRatio?: number;
}

/**
 * Sinh lịch sử giá 90 ngày dạng "đi ngang + thỉnh thoảng có đợt sale".
 * Tất định theo seed nên không gây lệch dữ liệu giữa lần render server và client.
 */
export function generatePriceHistory({
  seed,
  listPrice,
  days = 90,
  maxDipRatio = 0.13,
}: GenerateOptions): PricePoint[] {
  const rand = mulberry32(hashSeed(seed));
  const points: PricePoint[] = [];

  // Mức giá "sàn" dao động chậm quanh listPrice (xu hướng giảm nhẹ theo thời gian
  // như thực tế thị trường laptop), cộng thêm các đợt giảm giá ngắn hạn.
  let baseline = listPrice;
  const drift = -listPrice * (0.02 + rand() * 0.03); // giảm 2-5% trong 90 ngày
  let saleDaysLeft = 0;
  let saleDepth = 0;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(MOCK_TODAY);
    date.setUTCDate(date.getUTCDate() - i);

    const progress = (days - 1 - i) / (days - 1);
    baseline = listPrice + drift * progress;

    if (saleDaysLeft <= 0 && rand() < 0.045) {
      saleDaysLeft = 3 + Math.floor(rand() * 6);
      saleDepth = maxDipRatio * (0.4 + rand() * 0.6);
    }

    let price = baseline;
    if (saleDaysLeft > 0) {
      price = baseline * (1 - saleDepth);
      saleDaysLeft--;
    }

    // nhiễu nhỏ hàng ngày để không bị đi ngang tuyệt đối
    price += (rand() - 0.5) * listPrice * 0.006;

    // làm tròn về bội số 10.000đ cho giống giá niêm yết thực tế
    price = Math.round(price / 10_000) * 10_000;

    points.push({ date: toISODate(date), price });
  }

  applyCurrentFlashSale(points, seed, listPrice);

  return points;
}

/**
 * Khoảng 1/3 sản phẩm sẽ đang có một đợt "flash sale" ngắn ngày tính đến hôm nay,
 * đảm bảo giá hiện tại thấp hơn giá TB 30 ngày ít nhất ~10% (vượt ngưỡng "Giá tốt" 8%).
 * Tách seed riêng (":flash") để không ảnh hưởng tới dãy ngẫu nhiên đã dùng ở trên.
 */
function applyCurrentFlashSale(points: PricePoint[], seed: string, listPrice: number): void {
  const rand = mulberry32(hashSeed(seed + ":flash"));
  if (rand() >= 0.35) return; // ~35% số sản phẩm đang có giá tốt tại thời điểm "hôm nay"

  const saleDays = 5 + Math.floor(rand() * 4); // 5-8 ngày gần nhất
  const depth = 0.12 + rand() * 0.06; // giảm 12-18% so với giá nền

  for (let k = 0; k < saleDays && k < points.length; k++) {
    const idx = points.length - 1 - k;
    let price = listPrice * (1 - depth);
    price += (rand() - 0.5) * listPrice * 0.004;
    points[idx] = { ...points[idx], price: Math.round(price / 10_000) * 10_000 };
  }
}

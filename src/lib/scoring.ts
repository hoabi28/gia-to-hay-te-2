import type {
  Laptop,
  ScoreWeights,
  ScoreBreakdownItem,
  ValueScoreResult,
  UseCase,
} from "@/types/laptop";
import { getDiscountVsAvg30d } from "@/lib/price";

/**
 * Trọng số mặc định cho "Điểm đáng tiền" (thang 100).
 * Có thể truyền weights khác vào calculateValueScore để thử nghiệm.
 */
export const DEFAULT_WEIGHTS: ScoreWeights = {
  performance: 0.35,
  screen: 0.15,
  battery: 0.1,
  durability: 0.1,
  warranty: 0.1,
  price: 0.2,
};

const CRITERIA_LABEL: Record<keyof ScoreWeights, string> = {
  performance: "Hiệu năng theo nhu cầu",
  screen: "Chất lượng màn hình",
  battery: "Pin",
  durability: "Độ bền / tản nhiệt",
  warranty: "Bảo hành",
  price: "Giá hiện tại so với giá trung bình",
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

/** Hiệu năng tổng quát = trung bình điểm hiệu năng của 5 nhóm nhu cầu. */
export function getOverallPerformance(laptop: Laptop): number {
  const values = Object.values(laptop.performance);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function getPerformanceForUseCase(
  laptop: Laptop,
  useCase: UseCase
): number {
  return laptop.performance[useCase];
}

/**
 * Điểm giá (0-100): so sánh giá tốt nhất hiện tại với giá trung bình 30 ngày.
 * 0% chênh lệch -> 60 điểm (trung tính). Rẻ hơn trung bình thì điểm tăng,
 * đắt hơn thì điểm giảm. Đây là bản đơn giản hoá cho dữ liệu mẫu — bản đầy đủ
 * sẽ cộng thêm so sánh với các đối thủ cùng phân khúc khi có dữ liệu giá theo thời gian thực.
 */
export function getPriceScore(laptop: Laptop): number {
  const discount = getDiscountVsAvg30d(laptop); // vd 0.08 = rẻ hơn 8%
  return clamp(60 + discount * 400);
}

export function calculateValueScore(
  laptop: Laptop,
  weights: ScoreWeights = DEFAULT_WEIGHTS
): ValueScoreResult {
  const rawScores: Record<keyof ScoreWeights, number> = {
    performance: getOverallPerformance(laptop),
    screen: laptop.criteria.screen,
    battery: laptop.criteria.battery,
    durability: laptop.criteria.durability,
    warranty: laptop.criteria.warranty,
    price: getPriceScore(laptop),
  };

  const breakdown: ScoreBreakdownItem[] = (
    Object.keys(weights) as (keyof ScoreWeights)[]
  ).map((key) => {
    const rawScore = clamp(rawScores[key]);
    const weight = weights[key];
    return {
      key,
      label: CRITERIA_LABEL[key],
      rawScore,
      weight,
      weightedScore: rawScore * weight,
    };
  });

  const total = breakdown.reduce((acc, b) => acc + b.weightedScore, 0);

  return { total: Math.round(total), breakdown };
}

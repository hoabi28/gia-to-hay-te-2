/**
 * Kiểu dữ liệu trung tâm cho toàn bộ ứng dụng "Giá Tốt Hay Tệ".
 * Khi thay dữ liệu mock bằng API thật, chỉ cần đảm bảo response khớp các type này.
 */

export type Brand =
  | "Asus"
  | "Acer"
  | "Lenovo"
  | "Dell"
  | "HP"
  | "MSI"
  | "Apple";

export type LaptopCategory =
  | "van-phong"
  | "sinh-vien"
  | "lap-trinh"
  | "gaming"
  | "thiet-ke"
  | "macbook";

export type UseCase =
  | "lap-trinh"
  | "van-phong"
  | "thiet-ke"
  | "gaming"
  | "dung-video";

export const USE_CASE_LABEL: Record<UseCase, string> = {
  "lap-trinh": "Học lập trình",
  "van-phong": "Văn phòng",
  "thiet-ke": "Photoshop / thiết kế",
  gaming: "Chơi game",
  "dung-video": "Dựng video",
};

export const CATEGORY_LABEL: Record<LaptopCategory, string> = {
  "van-phong": "Laptop văn phòng",
  "sinh-vien": "Laptop sinh viên",
  "lap-trinh": "Laptop lập trình",
  gaming: "Laptop gaming",
  "thiet-ke": "Laptop thiết kế / dựng video",
  macbook: "MacBook",
};

export interface LaptopSpecs {
  cpu: string;
  cpuFamily: string; // vd: "Intel Core i5", "AMD Ryzen 7", "Apple M2" — dùng để lọc
  ram: number; // GB
  ramType: string; // vd: "DDR4", "LPDDR5"
  storage: string; // vd: "512GB SSD NVMe"
  gpu: string;
  gpuType: "tich-hop" | "roi"; // tích hợp / card rời
  screenSize: number; // inch
  screenResolution: string;
  screenPanel: string; // vd: "IPS", "OLED"
  refreshRate: number; // Hz
  battery: number; // Wh
  batteryLifeHours: number; // giờ sử dụng thực tế ước tính
  weightKg: number;
  ports: string[];
  os: string;
}

export interface PerformanceScores {
  "lap-trinh": number;
  "van-phong": number;
  "thiet-ke": number;
  gaming: number;
  "dung-video": number;
}

export interface PricePoint {
  date: string; // ISO yyyy-mm-dd
  price: number; // VND
}

export type StoreName =
  | "Thế Giới Di Động"
  | "FPT Shop"
  | "CellphoneS"
  | "Phong Vũ"
  | "Nguyễn Kim"
  | "Hoàng Hà Mobile"
  | "Anphatpc";

export interface StoreOffer {
  store: StoreName;
  price: number; // VND
  shippingFee: number; // VND, 0 = miễn phí
  gift: string | null;
  warrantyMonths: number;
  inStock: boolean;
  url: string; // link minh hoạ, không phải link thật
}

export type ReviewAspect =
  | "nhiet-do"
  | "do-on-quat"
  | "pin-thuc-te"
  | "man-hinh"
  | "hoan-thien"
  | "loi-thuong-gap"
  | "bao-hanh";

export const REVIEW_ASPECT_LABEL: Record<ReviewAspect, string> = {
  "nhiet-do": "Nhiệt độ / nóng máy",
  "do-on-quat": "Độ ồn quạt",
  "pin-thuc-te": "Pin thực tế",
  "man-hinh": "Màn hình",
  "hoan-thien": "Chất lượng hoàn thiện",
  "loi-thuong-gap": "Lỗi thường gặp",
  "bao-hanh": "Bảo hành",
};

export interface CommunityReview {
  id: string;
  aspect: ReviewAspect;
  author: string;
  date: string; // ISO
  rating: number; // 1-5
  content: string;
  helpfulCount: number;
  usageDurationMonths: number; // đã dùng máy bao lâu
}

export interface ScoreCriteria {
  screen: number; // 0-100
  battery: number; // 0-100
  durability: number; // 0-100, độ bền / tản nhiệt
  warranty: number; // 0-100
}

export interface Laptop {
  id: string;
  name: string;
  brand: Brand;
  series: string;
  category: LaptopCategory;
  useCases: UseCase[];
  image: string; // placeholder path/gradient key
  releaseYear: number;
  specs: LaptopSpecs;
  performance: PerformanceScores;
  criteria: ScoreCriteria;
  warrantyMonths: number;
  pros: string[];
  cons: string[];
  buyIf: string[];
  avoidIf: string[];
  bestFor: string;
  tags: string[];
  priceHistory: PricePoint[]; // 90 ngày gần nhất, tăng dần theo ngày
  stores: StoreOffer[];
  reviews: CommunityReview[];
}

export interface ScoreWeights {
  performance: number;
  screen: number;
  battery: number;
  durability: number;
  warranty: number;
  price: number;
}

export interface ScoreBreakdownItem {
  key: keyof ScoreWeights;
  label: string;
  rawScore: number; // 0-100
  weight: number; // 0-1
  weightedScore: number; // rawScore * weight
}

export interface ValueScoreResult {
  total: number; // 0-100, làm tròn
  breakdown: ScoreBreakdownItem[];
}

export type PriceRating = "gia-tot" | "binh-thuong" | "nen-cho";

export const PRICE_RATING_LABEL: Record<PriceRating, string> = {
  "gia-tot": "Giá tốt",
  "binh-thuong": "Giá bình thường",
  "nen-cho": "Nên chờ giảm giá",
};

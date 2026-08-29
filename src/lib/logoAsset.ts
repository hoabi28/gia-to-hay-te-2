import fs from "fs";
import path from "path";

let cached: string | null = null;

/** Đọc logo gốc độ phân giải cao (assets/logo-master.png, KHÔNG nằm trong public/ vì
 * chỉ cần lúc build, không cần xuất ra site thật) và trả về dạng data URI, dùng cho các
 * route sinh ảnh động qua next/og (icon.tsx, opengraph-image.tsx). */
export function getLogoDataUri(): string {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "assets", "logo-master.png");
  const buffer = fs.readFileSync(filePath);
  cached = `data:image/png;base64,${buffer.toString("base64")}`;
  return cached;
}

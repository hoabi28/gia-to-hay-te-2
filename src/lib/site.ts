/**
 * Cấu hình chung của site, dùng cho metadata/SEO (sitemap, robots, OpenGraph…).
 * Đặt biến môi trường NEXT_PUBLIC_SITE_URL khi deploy để trỏ đúng domain thật,
 * vd trong Vercel: NEXT_PUBLIC_SITE_URL=https://giatothayte.com
 */
export const SITE_NAME = "Giá Tốt Hay Tệ";
export const SITE_DESCRIPTION =
  "Công cụ so sánh laptop dành cho người Việt: tìm laptop theo ngân sách và nhu cầu, xem giá tốt nhất, lịch sử giá 90 ngày, điểm đáng tiền minh bạch và so sánh trực quan giữa hai máy.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

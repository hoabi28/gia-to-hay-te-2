import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-small.png" alt={SITE_NAME} className="h-7 w-7" />
              <span className="text-sm font-bold text-slate-900">{SITE_NAME}</span>
            </div>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-500">
              Công cụ hỗ trợ so sánh và chọn laptop theo nhu cầu, ngân sách thực tế.
              Giá và cửa hàng được cập nhật thủ công định kỳ từ các nhà bán lẻ tại Việt
              Nam, có thể chênh lệch so với giá thực tế tại thời điểm bạn xem — vui lòng
              kiểm tra lại tại trang bán trước khi quyết định mua. Điểm đáng tiền và các
              chỉ số hiệu năng là đánh giá tổng hợp mang tính tham khảo.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-brand-700">
              Trang chủ
            </Link>
            <Link href="/laptop" className="hover:text-brand-700">
              Tìm laptop
            </Link>
            <Link href="/so-sanh" className="hover:text-brand-700">
              So sánh
            </Link>
          </nav>
        </div>
        <p className="mt-6 border-t border-slate-100 pt-4 text-[11px] text-slate-400">
          © {new Date().getFullYear()} {SITE_NAME}. Đây là công cụ so sánh giá độc lập,
          không bán hàng trực tiếp và không hỗ trợ đặt hàng hay thanh toán trên trang —
          mọi giao dịch mua thực hiện tại website của cửa hàng liên kết.
        </p>
      </div>
    </footer>
  );
}

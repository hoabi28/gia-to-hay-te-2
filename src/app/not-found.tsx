import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <span className="text-5xl font-extrabold text-brand-700">404</span>
      <h1 className="text-lg font-bold text-slate-900">Không tìm thấy trang hoặc sản phẩm</h1>
      <p className="text-sm text-slate-500">
        Trang bạn tìm không tồn tại hoặc laptop này đã bị gỡ khỏi danh sách.
      </p>
      <Link
        href="/laptop"
        className="mt-2 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
      >
        Xem danh sách laptop
      </Link>
    </div>
  );
}

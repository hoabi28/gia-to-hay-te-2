import Link from "next/link";
import type { Metadata } from "next";
import { logoutAction } from "@/app/admin/login/actions";

export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s | Quản trị" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-700 text-xs font-bold text-white">
              GT
            </span>
            <span className="text-sm font-bold text-slate-900">Quản trị</span>
          </Link>
          <nav className="flex gap-4 text-sm text-slate-500">
            <Link href="/admin" className="hover:text-brand-700">
              Danh sách laptop
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/" className="text-sm text-slate-500 hover:text-brand-700" target="_blank">
              Xem site công khai ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}

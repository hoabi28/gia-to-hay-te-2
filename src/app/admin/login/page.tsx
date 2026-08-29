import type { Metadata } from "next";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-sm font-bold text-white">
            GT
          </span>
          <span className="text-base font-bold text-slate-900">Quản trị</span>
        </div>

        <form action={loginAction} className="flex flex-col gap-3">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-slate-500">
              Mật khẩu quản trị
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoFocus
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              Sai mật khẩu, vui lòng thử lại.
            </p>
          )}

          <button
            type="submit"
            className="mt-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

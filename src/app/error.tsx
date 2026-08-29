"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <span className="text-4xl">⚠️</span>
      <h1 className="text-lg font-bold text-slate-900">Đã có lỗi xảy ra</h1>
      <p className="text-sm text-slate-500">
        Rất tiếc, trang này gặp sự cố khi tải dữ liệu. Bạn có thể thử lại.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
      >
        Thử lại
      </button>
    </div>
  );
}

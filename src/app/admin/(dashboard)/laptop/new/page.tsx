import type { Metadata } from "next";
import { LaptopForm } from "@/components/admin/LaptopForm";
import { createLaptopAction } from "../actions";

export const metadata: Metadata = { title: "Thêm laptop mới" };

const ERROR_MESSAGES: Record<string, string> = {
  "missing-name": "Vui lòng nhập tên máy.",
  "duplicate-id": "Slug/ID này đã được dùng cho laptop khác, hãy đổi tên khác.",
  "no-store": "Cần ít nhất 1 cửa hàng để lưu được giá.",
};

export default async function AdminNewLaptopPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="mb-5 text-xl font-bold text-slate-900">Thêm laptop mới</h1>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {ERROR_MESSAGES[error] ?? "Có lỗi xảy ra, vui lòng thử lại."}
        </p>
      )}

      <LaptopForm mode="create" action={createLaptopAction} />
    </div>
  );
}

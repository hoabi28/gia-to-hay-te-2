import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLaptopById } from "@/lib/laptopRepo";
import { LaptopForm } from "@/components/admin/LaptopForm";
import { DeleteLaptopButton } from "@/components/admin/DeleteLaptopButton";
import { updateLaptopAction, deleteLaptopAction } from "../actions";

export const metadata: Metadata = { title: "Sửa laptop" };

const ERROR_MESSAGES: Record<string, string> = {
  "no-store": "Cần ít nhất 1 cửa hàng để lưu được giá — chưa lưu thay đổi.",
  "image-too-large": "Ảnh vượt quá 5MB, vui lòng chọn ảnh nhỏ hơn — chưa lưu thay đổi.",
  "image-invalid-type": "File chọn không phải ảnh hợp lệ — chưa lưu thay đổi.",
};

export default async function AdminEditLaptopPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const { saved, error } = await searchParams;
  const laptop = await getLaptopById(id);
  if (!laptop) notFound();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Sửa: {laptop.name}</h1>
          <p className="mt-1 text-xs text-slate-400">ID: {laptop.id}</p>
        </div>
        <DeleteLaptopButton laptopName={laptop.name} action={deleteLaptopAction.bind(null, laptop.id)} />
      </div>

      {saved && (
        <p className="mb-4 rounded-lg bg-good-50 px-3 py-2 text-sm text-good-700">
          Đã lưu thay đổi.
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {ERROR_MESSAGES[error] ?? "Có lỗi xảy ra, vui lòng thử lại."}
        </p>
      )}

      <LaptopForm mode="edit" laptop={laptop} action={updateLaptopAction.bind(null, laptop.id)} />
    </div>
  );
}

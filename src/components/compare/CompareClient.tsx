"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Laptop } from "@/types/laptop";
import { LaptopPicker } from "@/components/compare/LaptopPicker";
import { CompareTable } from "@/components/compare/CompareTable";
import { CompareConclusion } from "@/components/compare/CompareConclusion";
import { EmptyState } from "@/components/ui/States";

export function CompareClient({ laptops }: { laptops: Laptop[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idA = searchParams.get("a") ?? undefined;
  const idB = searchParams.get("b") ?? undefined;

  const laptopA = laptops.find((l) => l.id === idA);
  const laptopB = laptops.find((l) => l.id === idB);

  function setId(slot: "a" | "b", id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(slot, id);
    router.replace(`/so-sanh?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-xl font-bold text-slate-900">So sánh laptop</h1>
      <p className="mt-1 text-sm text-slate-500">
        Chọn hai laptop để so sánh trực quan — máy tốt hơn ở mỗi tiêu chí sẽ được đánh dấu.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LaptopPicker
          label="Laptop A"
          laptops={laptops}
          value={idA}
          excludeId={idB}
          onChange={(id) => setId("a", id)}
        />
        <LaptopPicker
          label="Laptop B"
          laptops={laptops}
          value={idB}
          excludeId={idA}
          onChange={(id) => setId("b", id)}
        />
      </div>

      <div className="mt-8">
        {laptopA && laptopB ? (
          <div className="flex flex-col gap-8">
            <CompareTable a={laptopA} b={laptopB} />
            <div>
              <h2 className="mb-3 text-lg font-bold text-slate-900">Kết luận</h2>
              <CompareConclusion a={laptopA} b={laptopB} />
            </div>
          </div>
        ) : (
          <EmptyState
            title="Chọn 2 laptop để bắt đầu so sánh"
            description='Bạn có thể chọn trực tiếp ở trên, hoặc bấm "So sánh" từ trang tìm kiếm để thêm laptop vào đây.'
          />
        )}
      </div>
    </div>
  );
}

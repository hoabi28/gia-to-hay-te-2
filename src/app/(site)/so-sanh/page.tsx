import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllLaptops } from "@/lib/laptopRepo";
import { CompareClient } from "@/components/compare/CompareClient";

const title = "So sánh laptop";
const description =
  "So sánh trực quan hai laptop theo giá, hiệu năng lập trình/gaming/thiết kế/dựng video, màn hình, pin, độ ồn & nhiệt độ, bảo hành và điểm đáng tiền. Kết luận nên chọn máy nào tự động theo dữ liệu.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/so-sanh" },
  openGraph: { title, description, url: "/so-sanh" },
  twitter: { title, description },
};

async function CompareLoader() {
  const laptops = await getAllLaptops();
  return <CompareClient laptops={laptops} />;
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-10 sm:px-6" />}>
      <CompareLoader />
    </Suspense>
  );
}

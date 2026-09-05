import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllLaptops } from "@/lib/laptopRepo";
import { LaptopListClient } from "@/components/list/LaptopListClient";
import { LoadingGrid } from "@/components/ui/States";

// Trang tĩnh mặc định bị Vercel cache dai dẳng ở tầng CDN kể cả sau khi deploy lại —
// buộc render động để luôn khớp dữ liệu DB hiện tại.
export const dynamic = "force-dynamic";

const title = "Tìm laptop";
const description =
  "Tìm và lọc laptop theo ngân sách, hãng, CPU, RAM, GPU, mục đích sử dụng và giá tốt. So sánh nhanh hàng loạt laptop văn phòng, sinh viên, lập trình, gaming, thiết kế và MacBook.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/laptop" },
  openGraph: { title, description, url: "/laptop" },
  twitter: { title, description },
};

async function LaptopListLoader() {
  const laptops = await getAllLaptops();
  return <LaptopListClient laptops={laptops} />;
}

export default function LaptopListPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
          <LoadingGrid />
        </div>
      }
    >
      <LaptopListLoader />
    </Suspense>
  );
}

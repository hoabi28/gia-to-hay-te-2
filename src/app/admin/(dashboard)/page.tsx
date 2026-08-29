import Link from "next/link";
import { getAllLaptops } from "@/lib/laptopRepo";
import { getBestCurrentPrice } from "@/lib/price";
import { formatVND } from "@/lib/format";
import { CATEGORY_LABEL } from "@/types/laptop";

export default async function AdminDashboardPage() {
  const laptops = await getAllLaptops();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Danh sách laptop</h1>
          <p className="mt-1 text-sm text-slate-500">{laptops.length} sản phẩm</p>
        </div>
        <Link
          href="/admin/laptop/new"
          className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
        >
          + Thêm laptop mới
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Tên máy</th>
              <th className="px-4 py-3">Nhóm</th>
              <th className="px-4 py-3">Giá thấp nhất</th>
              <th className="px-4 py-3">Cửa hàng</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {laptops.map((l, i) => {
              const inStockCount = l.stores.filter((s) => s.inStock).length;
              return (
                <tr key={l.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{l.name}</div>
                    <div className="text-xs text-slate-400">{l.brand}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{CATEGORY_LABEL[l.category]}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {formatVND(getBestCurrentPrice(l))}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {inStockCount}/{l.stores.length} còn hàng
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/laptop/${l.id}`} className="font-semibold text-brand-700 hover:underline">
                      Sửa
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

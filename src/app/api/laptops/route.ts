import { NextResponse } from "next/server";
import { getAllLaptops } from "@/lib/laptopRepo";

/** Dùng cho các client component không nằm dưới 1 server page có thể fetch trước
 * (vd CompareBar hiển thị ở mọi trang qua layout gốc). Hỗ trợ ?ids=a,b để lọc bớt. */
export async function GET(request: Request) {
  const laptops = await getAllLaptops();
  const idsParam = new URL(request.url).searchParams.get("ids");

  if (idsParam) {
    const ids = idsParam.split(",").filter(Boolean);
    return NextResponse.json(laptops.filter((l) => ids.includes(l.id)));
  }

  return NextResponse.json(laptops);
}

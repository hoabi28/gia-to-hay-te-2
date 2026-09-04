import type { MetadataRoute } from "next";
import { getAllLaptops } from "@/lib/laptopRepo";
import { SITE_URL } from "@/lib/site";

// sitemap.ts không phản hồi revalidatePath("/sitemap.xml") một cách đáng tin cậy trên
// Vercel — buộc render động để danh sách laptop trong sitemap luôn khớp dữ liệu hiện tại.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const laptops = await getAllLaptops();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/laptop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/so-sanh`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  const laptopRoutes: MetadataRoute.Sitemap = laptops.map((l) => ({
    url: `${SITE_URL}/laptop/${l.id}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...laptopRoutes];
}

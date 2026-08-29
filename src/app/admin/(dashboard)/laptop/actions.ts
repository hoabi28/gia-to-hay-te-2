"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { db } from "@/lib/db";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

type ImageResolution = { url: string } | { error: string };

/** Nếu form có kèm file ảnh mới thì upload lên Vercel Blob và trả về URL mới, xoá ảnh cũ
 * (nếu là ảnh thật, không phải placeholder) để tránh rác. Không có file mới thì giữ nguyên. */
async function resolveImageUrl(
  formData: FormData,
  laptopId: string,
  existingImage: string
): Promise<ImageResolution> {
  const file = formData.get("imageFile");
  if (!(file instanceof File) || file.size === 0) {
    return { url: existingImage };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "image-too-large" };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "image-invalid-type" };
  }

  const ext = file.name.split(".").pop() || "jpg";
  const blob = await put(`laptops/${laptopId}-${Date.now()}.${ext}`, file, {
    access: "public",
  });

  if (/^https?:\/\//.test(existingImage)) {
    await del(existingImage).catch(() => {});
  }

  return { url: blob.url };
}

function str(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function num(formData: FormData, name: string): number {
  return Number(formData.get(name) ?? 0);
}

/** Mỗi dòng trong textarea là 1 phần tử mảng. */
function lines(formData: FormData, name: string): string[] {
  return str(formData, name)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Danh sách phân tách bởi dấu phẩy. */
function csv(formData: FormData, name: string): string[] {
  return str(formData, name)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

interface ParsedStoreOffer {
  store: string;
  price: number;
  shippingFee: number;
  gift: string | null;
  warrantyMonths: number;
  inStock: boolean;
  url: string;
}

/** Form đặt tên input dạng "stores.<rowKey>.<field>" — gom theo rowKey, giữ đúng thứ tự xuất hiện. */
function parseStoreOffers(formData: FormData): ParsedStoreOffer[] {
  const rows = new Map<string, Partial<ParsedStoreOffer>>();

  for (const key of formData.keys()) {
    const match = key.match(/^stores\.([^.]+)\.(.+)$/);
    if (!match) continue;
    const [, rowKey, field] = match;
    const row = rows.get(rowKey) ?? {};
    const raw = formData.get(key);

    if (field === "price" || field === "shippingFee" || field === "warrantyMonths") {
      row[field] = Number(raw ?? 0);
    } else if (field === "inStock") {
      row.inStock = raw === "on";
    } else if (field === "gift") {
      const v = String(raw ?? "").trim();
      row.gift = v ? v : null;
    } else if (field === "store" || field === "url") {
      row[field] = String(raw ?? "").trim();
    }

    rows.set(rowKey, row);
  }

  return Array.from(rows.values())
    .filter((r) => r.store && r.url)
    .map((r) => ({
      store: r.store!,
      price: r.price ?? 0,
      shippingFee: r.shippingFee ?? 0,
      gift: r.gift ?? null,
      warrantyMonths: r.warrantyMonths ?? 0,
      inStock: r.inStock ?? false,
      url: r.url!,
    }));
}

function buildLaptopData(formData: FormData) {
  return {
    name: str(formData, "name"),
    brand: str(formData, "brand"),
    series: str(formData, "series"),
    category: str(formData, "category"),
    useCases: formData.getAll("useCases").map(String),
    releaseYear: num(formData, "releaseYear"),
    specs: {
      cpu: str(formData, "cpu"),
      cpuFamily: str(formData, "cpuFamily"),
      ram: num(formData, "ram"),
      ramType: str(formData, "ramType"),
      storage: str(formData, "storage"),
      gpu: str(formData, "gpu"),
      gpuType: str(formData, "gpuType"),
      screenSize: num(formData, "screenSize"),
      screenResolution: str(formData, "screenResolution"),
      screenPanel: str(formData, "screenPanel"),
      refreshRate: num(formData, "refreshRate"),
      battery: num(formData, "battery"),
      batteryLifeHours: num(formData, "batteryLifeHours"),
      weightKg: num(formData, "weightKg"),
      ports: csv(formData, "ports"),
      os: str(formData, "os"),
    },
    performance: {
      "lap-trinh": num(formData, "perf_lap-trinh"),
      "van-phong": num(formData, "perf_van-phong"),
      "thiet-ke": num(formData, "perf_thiet-ke"),
      gaming: num(formData, "perf_gaming"),
      "dung-video": num(formData, "perf_dung-video"),
    },
    criteria: {
      screen: num(formData, "criteria_screen"),
      battery: num(formData, "criteria_battery"),
      durability: num(formData, "criteria_durability"),
      warranty: num(formData, "criteria_warranty"),
    },
    warrantyMonths: num(formData, "warrantyMonths"),
    pros: lines(formData, "pros"),
    cons: lines(formData, "cons"),
    buyIf: lines(formData, "buyIf"),
    avoidIf: lines(formData, "avoidIf"),
    bestFor: str(formData, "bestFor"),
    tags: csv(formData, "tags"),
  };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function bestPriceOf(stores: ParsedStoreOffer[]): number | null {
  const inStock = stores.filter((s) => s.inStock);
  const pool = inStock.length > 0 ? inStock : stores;
  if (pool.length === 0) return null;
  return Math.min(...pool.map((s) => s.price));
}

async function saveStoresAndSnapshot(laptopId: string, stores: ParsedStoreOffer[]) {
  await db.storeOffer.deleteMany({ where: { laptopId } });
  if (stores.length > 0) {
    await db.storeOffer.createMany({
      data: stores.map((s) => ({ ...s, laptopId })),
    });
  }
  const price = bestPriceOf(stores);
  if (price !== null) {
    await db.priceSnapshot.create({ data: { laptopId, price } });
  }
}

function revalidatePublicPages(id: string) {
  revalidatePath("/");
  revalidatePath("/laptop");
  revalidatePath(`/laptop/${id}`);
  revalidatePath("/so-sanh");
  revalidatePath("/sitemap.xml");
}

export async function updateLaptopAction(id: string, formData: FormData) {
  const data = buildLaptopData(formData);
  const stores = parseStoreOffers(formData);
  if (stores.length === 0) {
    redirect(`/admin/laptop/${id}?error=no-store`);
  }

  const current = await db.laptop.findUniqueOrThrow({ where: { id } });
  const imageResult = await resolveImageUrl(formData, id, current.image);
  if ("error" in imageResult) {
    redirect(`/admin/laptop/${id}?error=${imageResult.error}`);
  }

  await db.laptop.update({ where: { id }, data: { ...data, image: imageResult.url } });
  await saveStoresAndSnapshot(id, stores);

  revalidatePublicPages(id);
  revalidatePath(`/admin/laptop/${id}`);
  revalidatePath("/admin");
  redirect(`/admin/laptop/${id}?saved=1`);
}

export async function createLaptopAction(formData: FormData) {
  const name = str(formData, "name");
  const id = slugify(str(formData, "id") || name);
  if (!id) {
    redirect("/admin/laptop/new?error=missing-name");
  }

  const existing = await db.laptop.findUnique({ where: { id } });
  if (existing) {
    redirect(`/admin/laptop/new?error=duplicate-id&id=${encodeURIComponent(id)}`);
  }

  const data = buildLaptopData(formData);
  const stores = parseStoreOffers(formData);
  if (stores.length === 0) {
    redirect("/admin/laptop/new?error=no-store");
  }

  const imageResult = await resolveImageUrl(formData, id, `${data.category}-placeholder`);
  if ("error" in imageResult) {
    redirect(`/admin/laptop/new?error=${imageResult.error}`);
  }

  await db.laptop.create({ data: { id, ...data, image: imageResult.url } });
  await saveStoresAndSnapshot(id, stores);

  revalidatePublicPages(id);
  revalidatePath("/admin");
  redirect(`/admin/laptop/${id}?saved=1`);
}

export async function deleteLaptopAction(id: string) {
  const laptop = await db.laptop.delete({ where: { id } });
  if (/^https?:\/\//.test(laptop.image)) {
    await del(laptop.image).catch(() => {});
  }
  revalidatePublicPages(id);
  revalidatePath("/admin");
  redirect("/admin");
}

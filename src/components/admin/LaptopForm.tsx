"use client";

import { useState } from "react";
import type { Laptop, LaptopCategory, UseCase, Brand } from "@/types/laptop";
import { CATEGORY_LABEL, USE_CASE_LABEL } from "@/types/laptop";
import { ProductImage } from "@/components/ui/ProductImage";

const BRANDS: Brand[] = ["Asus", "Acer", "Lenovo", "Dell", "HP", "MSI", "Apple"];
const CATEGORIES = Object.keys(CATEGORY_LABEL) as LaptopCategory[];
const USE_CASES = Object.keys(USE_CASE_LABEL) as UseCase[];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none";

interface StoreRowState {
  key: string;
  store: string;
  price: number;
  shippingFee: number;
  gift: string;
  warrantyMonths: number;
  inStock: boolean;
  url: string;
}

let rowCounter = 0;
function newRowKey() {
  rowCounter += 1;
  return `new${rowCounter}-${Date.now()}`;
}

function toRowState(laptop?: Laptop): StoreRowState[] {
  if (!laptop || laptop.stores.length === 0) {
    // Dùng key cố định (không phải newRowKey() sinh từ Date.now()) vì hàm này chạy lúc
    // khởi tạo useState — gọi cả lúc render server lẫn client, giá trị đổi mỗi lần gọi
    // sẽ gây hydration mismatch. newRowKey() chỉ an toàn khi dùng trong sự kiện click
    // (addRow) vì lúc đó chỉ chạy trên client, sau khi đã hydrate xong.
    return [
      {
        key: "row0",
        store: "",
        price: 0,
        shippingFee: 0,
        gift: "",
        warrantyMonths: laptop?.warrantyMonths ?? 12,
        inStock: true,
        url: "",
      },
    ];
  }
  return laptop.stores.map((s, i) => ({
    key: `row${i}`,
    store: s.store,
    price: s.price,
    shippingFee: s.shippingFee,
    gift: s.gift ?? "",
    warrantyMonths: s.warrantyMonths,
    inStock: s.inStock,
    url: s.url,
  }));
}

export function LaptopForm({
  mode,
  laptop,
  action,
}: {
  mode: "create" | "edit";
  laptop?: Laptop;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [rows, setRows] = useState<StoreRowState[]>(() => toRowState(laptop));
  const [idTouched, setIdTouched] = useState(false);
  const [id, setId] = useState(laptop?.id ?? "");
  const [name, setName] = useState(laptop?.name ?? "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<LaptopCategory>(laptop?.category ?? CATEGORIES[0]);

  function handleImageChange(file: File | undefined) {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  }

  function addRow() {
    setRows((r) => [
      ...r,
      {
        key: newRowKey(),
        store: "",
        price: 0,
        shippingFee: 0,
        gift: "",
        warrantyMonths: laptop?.warrantyMonths ?? 12,
        inStock: true,
        url: "",
      },
    ]);
  }

  function removeRow(key: string) {
    setRows((r) => r.filter((row) => row.key !== key));
  }

  function handleNameChange(v: string) {
    setName(v);
    if (mode === "create" && !idTouched) {
      setId(
        v
          .toLowerCase()
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .replace(/đ/g, "d")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  }

  return (
    <form action={action} className="flex flex-col gap-8">
      {mode === "create" && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Tên máy">
            <input
              name="name"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Slug / ID (dùng trong URL, không dấu, không trùng máy khác)">
            <input
              name="id"
              required
              value={id}
              onChange={(e) => {
                setIdTouched(true);
                setId(e.target.value);
              }}
              className={inputClass}
            />
          </Field>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-900">Ảnh sản phẩm</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="h-32 w-40 shrink-0 overflow-hidden rounded-xl border border-slate-200">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <ProductImage category={category} imageUrl={laptop?.image} className="h-full w-full" />
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0])}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              JPG/PNG/WebP, tối đa 5MB. Bỏ trống nếu chưa có ảnh — máy sẽ dùng hình minh hoạ
              theo nhóm sản phẩm.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-900">Thông tin cơ bản</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mode === "edit" && (
            <Field label="Tên máy">
              <input name="name" required defaultValue={laptop?.name} className={inputClass} />
            </Field>
          )}
          <Field label="Hãng">
            <select name="brand" defaultValue={laptop?.brand ?? BRANDS[0]} className={inputClass}>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Dòng máy (series)">
            <input name="series" required defaultValue={laptop?.series} className={inputClass} />
          </Field>
          <Field label="Nhóm">
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as LaptopCategory)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Năm ra mắt">
            <input
              type="number"
              name="releaseYear"
              required
              defaultValue={laptop?.releaseYear ?? new Date().getFullYear()}
              className={inputClass}
            />
          </Field>
          <Field label="Bảo hành (tháng)">
            <input
              type="number"
              name="warrantyMonths"
              required
              defaultValue={laptop?.warrantyMonths ?? 12}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Phù hợp nhất cho (1 câu ngắn)">
            <input name="bestFor" required defaultValue={laptop?.bestFor} className={inputClass} />
          </Field>
        </div>
        <div className="mt-4">
          <span className="mb-1.5 block text-xs font-semibold text-slate-500">Mục đích sử dụng</span>
          <div className="flex flex-wrap gap-3">
            {USE_CASES.map((uc) => (
              <label key={uc} className="flex items-center gap-1.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="useCases"
                  value={uc}
                  defaultChecked={laptop?.useCases.includes(uc) ?? false}
                  className="h-4 w-4 rounded border-slate-300 text-brand-700"
                />
                {USE_CASE_LABEL[uc]}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <Field label="Tags hiển thị trên thẻ sản phẩm (phân tách bởi dấu phẩy)">
            <input name="tags" defaultValue={laptop?.tags.join(", ")} className={inputClass} />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-900">Thông số kỹ thuật</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="CPU (hiển thị đầy đủ)">
            <input name="cpu" required defaultValue={laptop?.specs.cpu} className={inputClass} />
          </Field>
          <Field label="Dòng CPU (dùng để lọc, vd 'Intel Core i5')">
            <input name="cpuFamily" required defaultValue={laptop?.specs.cpuFamily} className={inputClass} />
          </Field>
          <Field label="RAM (GB)">
            <input type="number" name="ram" required defaultValue={laptop?.specs.ram} className={inputClass} />
          </Field>
          <Field label="Loại RAM">
            <input name="ramType" required defaultValue={laptop?.specs.ramType} className={inputClass} />
          </Field>
          <Field label="Ổ cứng">
            <input name="storage" required defaultValue={laptop?.specs.storage} className={inputClass} />
          </Field>
          <Field label="GPU (hiển thị đầy đủ)">
            <input name="gpu" required defaultValue={laptop?.specs.gpu} className={inputClass} />
          </Field>
          <Field label="Loại GPU">
            <select name="gpuType" defaultValue={laptop?.specs.gpuType ?? "tich-hop"} className={inputClass}>
              <option value="tich-hop">Card tích hợp</option>
              <option value="roi">Card rời</option>
            </select>
          </Field>
          <Field label="Kích thước màn hình (inch)">
            <input
              type="number"
              step="0.1"
              name="screenSize"
              required
              defaultValue={laptop?.specs.screenSize}
              className={inputClass}
            />
          </Field>
          <Field label="Độ phân giải màn hình">
            <input
              name="screenResolution"
              required
              defaultValue={laptop?.specs.screenResolution}
              className={inputClass}
            />
          </Field>
          <Field label="Loại tấm nền">
            <input name="screenPanel" required defaultValue={laptop?.specs.screenPanel} className={inputClass} />
          </Field>
          <Field label="Tần số quét (Hz)">
            <input
              type="number"
              name="refreshRate"
              required
              defaultValue={laptop?.specs.refreshRate}
              className={inputClass}
            />
          </Field>
          <Field label="Dung lượng pin (Wh)">
            <input
              type="number"
              name="battery"
              required
              defaultValue={laptop?.specs.battery}
              className={inputClass}
            />
          </Field>
          <Field label="Thời lượng pin thực tế (giờ)">
            <input
              type="number"
              step="0.5"
              name="batteryLifeHours"
              required
              defaultValue={laptop?.specs.batteryLifeHours}
              className={inputClass}
            />
          </Field>
          <Field label="Trọng lượng (kg)">
            <input
              type="number"
              step="0.01"
              name="weightKg"
              required
              defaultValue={laptop?.specs.weightKg}
              className={inputClass}
            />
          </Field>
          <Field label="Hệ điều hành">
            <input name="os" required defaultValue={laptop?.specs.os} className={inputClass} />
          </Field>
          <Field label="Cổng kết nối (phân tách bởi dấu phẩy)">
            <input name="ports" defaultValue={laptop?.specs.ports.join(", ")} className={inputClass} />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-900">
          Điểm hiệu năng theo nhu cầu (0-100)
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {USE_CASES.map((uc) => (
            <Field key={uc} label={USE_CASE_LABEL[uc]}>
              <input
                type="number"
                min={0}
                max={100}
                name={`perf_${uc}`}
                required
                defaultValue={laptop?.performance[uc] ?? 50}
                className={inputClass}
              />
            </Field>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-900">Điểm tiêu chí khác (0-100)</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Màn hình">
            <input
              type="number"
              min={0}
              max={100}
              name="criteria_screen"
              required
              defaultValue={laptop?.criteria.screen ?? 50}
              className={inputClass}
            />
          </Field>
          <Field label="Pin">
            <input
              type="number"
              min={0}
              max={100}
              name="criteria_battery"
              required
              defaultValue={laptop?.criteria.battery ?? 50}
              className={inputClass}
            />
          </Field>
          <Field label="Độ bền / tản nhiệt">
            <input
              type="number"
              min={0}
              max={100}
              name="criteria_durability"
              required
              defaultValue={laptop?.criteria.durability ?? 50}
              className={inputClass}
            />
          </Field>
          <Field label="Bảo hành">
            <input
              type="number"
              min={0}
              max={100}
              name="criteria_warranty"
              required
              defaultValue={laptop?.criteria.warranty ?? 50}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Ưu điểm (mỗi dòng 1 ý)">
          <textarea name="pros" rows={4} defaultValue={laptop?.pros.join("\n")} className={inputClass} />
        </Field>
        <Field label="Nhược điểm (mỗi dòng 1 ý)">
          <textarea name="cons" rows={4} defaultValue={laptop?.cons.join("\n")} className={inputClass} />
        </Field>
        <Field label="Nên mua nếu... (mỗi dòng 1 ý)">
          <textarea name="buyIf" rows={3} defaultValue={laptop?.buyIf.join("\n")} className={inputClass} />
        </Field>
        <Field label="Không nên mua nếu... (mỗi dòng 1 ý)">
          <textarea name="avoidIf" rows={3} defaultValue={laptop?.avoidIf.join("\n")} className={inputClass} />
        </Field>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Giá tại các cửa hàng</h2>
          <button
            type="button"
            onClick={addRow}
            className="rounded-lg border border-brand-700 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
          >
            + Thêm cửa hàng
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {rows.map((row) => (
            <div key={row.key} className="rounded-xl border border-slate-200 p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Tên cửa hàng">
                  <input
                    name={`stores.${row.key}.store`}
                    required
                    defaultValue={row.store}
                    className={inputClass}
                  />
                </Field>
                <Field label="Giá (đ)">
                  <input
                    type="number"
                    name={`stores.${row.key}.price`}
                    required
                    defaultValue={row.price}
                    className={inputClass}
                  />
                </Field>
                <Field label="Phí ship (đ, 0 = miễn phí)">
                  <input
                    type="number"
                    name={`stores.${row.key}.shippingFee`}
                    defaultValue={row.shippingFee}
                    className={inputClass}
                  />
                </Field>
                <Field label="Bảo hành cửa hàng (tháng)">
                  <input
                    type="number"
                    name={`stores.${row.key}.warrantyMonths`}
                    required
                    defaultValue={row.warrantyMonths}
                    className={inputClass}
                  />
                </Field>
                <Field label="Quà tặng (để trống nếu không có)">
                  <input
                    name={`stores.${row.key}.gift`}
                    defaultValue={row.gift}
                    className={inputClass}
                  />
                </Field>
                <Field label="Link cửa hàng">
                  <input
                    name={`stores.${row.key}.url`}
                    required
                    defaultValue={row.url}
                    className={inputClass}
                  />
                </Field>
                <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name={`stores.${row.key}.inStock`}
                    defaultChecked={row.inStock}
                    className="h-4 w-4 rounded border-slate-300 text-brand-700"
                  />
                  Còn hàng
                </label>
                <div className="flex items-end justify-end pb-1">
                  <button
                    type="button"
                    onClick={() => removeRow(row.key)}
                    disabled={rows.length <= 1}
                    title={rows.length <= 1 ? "Cần giữ lại ít nhất 1 cửa hàng" : undefined}
                    className="text-xs font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline"
                  >
                    Xoá cửa hàng này
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-800 sm:w-auto"
        >
          {mode === "create" ? "Tạo laptop" : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}

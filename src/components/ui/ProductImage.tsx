import type { LaptopCategory } from "@/types/laptop";

const CATEGORY_STYLE: Record<
  LaptopCategory,
  { from: string; to: string; icon: string }
> = {
  "van-phong": { from: "#eef1f5", to: "#dde3ea", icon: "#4b5563" },
  "sinh-vien": { from: "#eaf4fb", to: "#d7ebf7", icon: "#1f5690" },
  "lap-trinh": { from: "#eef0fb", to: "#e0e4f8", icon: "#3c3f8f" },
  gaming: { from: "#fdeeee", to: "#fbe2df", icon: "#b3311f" },
  "thiet-ke": { from: "#f6eefb", to: "#ecdff5", icon: "#7a3ea3" },
  macbook: { from: "#f1f1f2", to: "#e4e4e6", icon: "#3a3a3c" },
};

function isRealImageUrl(value: string | undefined): value is string {
  return !!value && /^https?:\/\//.test(value);
}

/**
 * Ảnh sản phẩm: nếu laptop có ảnh thật (upload qua /admin, lưu URL Vercel Blob) thì hiển thị
 * ảnh đó; nếu chưa có thì dùng ảnh minh hoạ dạng vector theo nhóm sản phẩm làm placeholder.
 */
export function ProductImage({
  category,
  imageUrl,
  alt = "",
  className = "",
}: {
  category: LaptopCategory;
  imageUrl?: string;
  alt?: string;
  className?: string;
}) {
  if (isRealImageUrl(imageUrl)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt={alt} className={`object-cover ${className}`} />
    );
  }

  const style = CATEGORY_STYLE[category];
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, ${style.from}, ${style.to})`,
      }}
    >
      <svg viewBox="0 0 64 64" className="h-[44%] w-[44%]" fill="none">
        <rect x="10" y="14" width="44" height="28" rx="2.5" stroke={style.icon} strokeWidth="2.5" />
        <rect x="15" y="18.5" width="34" height="19" rx="1" fill={style.icon} opacity="0.15" />
        <path
          d="M6 46h52l-3.5 6a3 3 0 0 1-2.6 1.5H12.1a3 3 0 0 1-2.6-1.5L6 46Z"
          stroke={style.icon}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

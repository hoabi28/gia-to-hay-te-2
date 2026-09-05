import { ImageResponse } from "next/og";
import { getLaptopById } from "@/lib/laptopRepo";
import { getBestCurrentPrice, isGoodPrice } from "@/lib/price";
import { calculateValueScore } from "@/lib/scoring";
import { formatVND } from "@/lib/format";
import { SITE_NAME } from "@/lib/site";
import { getLogoDataUri } from "@/lib/logoAsset";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const CATEGORY_COLOR: Record<string, string> = {
  "van-phong": "#4b5563",
  "sinh-vien": "#1f5690",
  "lap-trinh": "#3c3f8f",
  gaming: "#b3311f",
  "thiet-ke": "#7a3ea3",
  macbook: "#3a3a3c",
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const laptop = await getLaptopById(id);

  if (!laptop) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontFamily: "sans-serif",
            color: "#0d2740",
            background: "#eaf1fb",
          }}
        >
          {SITE_NAME}
        </div>
      ),
      { ...size }
    );
  }

  const price = getBestCurrentPrice(laptop);
  const goodPrice = isGoodPrice(laptop);
  const { total: score } = calculateValueScore(laptop);
  const accent = CATEGORY_COLOR[laptop.category] ?? "#17426f";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getLogoDataUri()} width={52} height={52} alt="" />
          <div style={{ fontSize: 28, fontWeight: 700, color: "#0d2740" }}>{SITE_NAME}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {laptop.tags.slice(0, 3).map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: 999,
                  background: "#f1f5f9",
                  color: "#475467",
                  fontSize: 22,
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 800, color: "#101828", lineHeight: 1.15, maxWidth: 900 }}>
            {laptop.name}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 32 }}>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 800, color: "#101828" }}>
              {formatVND(price)}
            </div>
            {goodPrice && (
              <div
                style={{
                  display: "flex",
                  padding: "8px 20px",
                  borderRadius: 999,
                  background: "#eafbf2",
                  color: "#0d6b47",
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                Giá tốt
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 84,
                height: 84,
                borderRadius: 999,
                background: accent,
                color: "white",
                fontSize: 30,
                fontWeight: 800,
              }}
            >
              {score}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

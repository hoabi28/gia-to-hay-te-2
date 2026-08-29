import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { getLogoDataUri } from "@/lib/logoAsset";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #eaf1fb, #ffffff)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getLogoDataUri()} width={64} height={64} alt="" />
          <div style={{ fontSize: 40, fontWeight: 800, color: "#0d2740" }}>{SITE_NAME}</div>
        </div>
        <div style={{ fontSize: 56, fontWeight: 800, color: "#101828", lineHeight: 1.15, display: "flex", maxWidth: 980 }}>
          Chọn đúng laptop, đúng nhu cầu, đúng giá
        </div>
        <div style={{ fontSize: 28, color: "#475467", marginTop: 24, maxWidth: 900, display: "flex" }}>
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size }
  );
}

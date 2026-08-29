import { ImageResponse } from "next/og";
import { getLogoDataUri } from "@/lib/logoAsset";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={getLogoDataUri()} width={60} height={60} alt="" />
      </div>
    ),
    { ...size }
  );
}

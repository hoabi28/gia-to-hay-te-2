"use client";

import { useMemo, useState } from "react";
import type { PricePoint } from "@/types/laptop";
import { formatVND, formatDateVN } from "@/lib/format";

const WIDTH = 640;
const HEIGHT = 220;
const PAD_X = 8;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;

export function PriceHistoryChart({ history }: { history: PricePoint[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const { points, min, max } = useMemo(() => {
    if (history.length === 0) return { points: [], min: 0, max: 0 };
    const prices = history.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const innerW = WIDTH - PAD_X * 2;
    const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;

    const points = history.map((p, i) => {
      // Chỉ 1 điểm dữ liệu thì đặt giữa trục X, tránh chia cho 0 (history.length - 1 = 0).
      const x =
        history.length > 1 ? PAD_X + (i / (history.length - 1)) * innerW : WIDTH / 2;
      const y = PAD_TOP + innerH - ((p.price - min) / range) * innerH;
      return { x, y, ...p };
    });
    return { points, min, max };
  }, [history]);

  const hasEnoughData = points.length >= 2;
  const linePath = hasEnoughData
    ? points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")
    : "";
  const areaPath = hasEnoughData
    ? `${linePath} L${points[points.length - 1].x},${HEIGHT - PAD_BOTTOM} L${points[0].x},${HEIGHT - PAD_BOTTOM} Z`
    : "";

  const hovered = hoverIdx !== null ? points[hoverIdx] : null;

  function handleMove(e: React.PointerEvent<SVGSVGElement>) {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let closest = 0;
    let closestDist = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - relX);
      if (d < closestDist) {
        closestDist = d;
        closest = i;
      }
    });
    setHoverIdx(closest);
  }

  if (points.length === 0) {
    return (
      <p className="flex h-[220px] items-center justify-center text-sm text-slate-400">
        Chưa có dữ liệu lịch sử giá.
      </p>
    );
  }

  if (!hasEnoughData) {
    return (
      <p className="flex h-[220px] items-center justify-center text-center text-sm text-slate-400">
        Mới có 1 điểm giá ({formatDateVN(history[0].date)} · {formatVND(history[0].price)}) — cần
        thêm dữ liệu để vẽ biểu đồ xu hướng.
      </p>
    );
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full touch-none"
        onPointerMove={handleMove}
        onPointerLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="priceArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {[0, 0.5, 1].map((t) => {
          const y = PAD_TOP + t * (HEIGHT - PAD_TOP - PAD_BOTTOM);
          return (
            <line
              key={t}
              x1={PAD_X}
              x2={WIDTH - PAD_X}
              y1={y}
              y2={y}
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />
          );
        })}

        <path d={areaPath} fill="url(#priceArea)" />
        <path d={linePath} fill="none" stroke="var(--color-brand-600)" strokeWidth="2" />

        {hovered && (
          <>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={PAD_TOP}
              y2={HEIGHT - PAD_BOTTOM}
              stroke="#94a3b8"
              strokeWidth="1"
            />
            <circle cx={hovered.x} cy={hovered.y} r="4" fill="var(--color-brand-700)" />
          </>
        )}
      </svg>

      <div className="mt-1 flex justify-between text-[11px] text-slate-400">
        <span>{formatDateVN(history[0].date)}</span>
        <span>{formatDateVN(history[history.length - 1].date)}</span>
      </div>

      <div className="mt-2 flex h-6 items-center justify-center text-sm font-medium text-slate-700">
        {hovered ? (
          <span>
            {formatDateVN(hovered.date)} · <span className="font-bold">{formatVND(hovered.price)}</span>
          </span>
        ) : (
          <span className="text-slate-400">
            Di chuột (hoặc chạm) trên biểu đồ để xem giá theo ngày · Thấp nhất {formatVND(min)} · Cao nhất{" "}
            {formatVND(max)}
          </span>
        )}
      </div>
    </div>
  );
}

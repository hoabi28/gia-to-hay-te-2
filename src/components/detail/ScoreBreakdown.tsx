import type { Laptop } from "@/types/laptop";
import { calculateValueScore } from "@/lib/scoring";
import { ValueScoreBadge } from "@/components/ui/ValueScoreBadge";

function barColor(score: number): string {
  if (score >= 80) return "bg-good-600";
  if (score >= 65) return "bg-brand-600";
  return "bg-warn-600";
}

export function ScoreBreakdown({ laptop }: { laptop: Laptop }) {
  const { total, breakdown } = calculateValueScore(laptop);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <ValueScoreBadge score={total} size="lg" />
        <div>
          <h3 className="text-base font-bold text-slate-900">Điểm đáng tiền</h3>
          <p className="text-sm text-slate-500">
            Tổng hợp từ 6 tiêu chí bên dưới, mỗi tiêu chí có trọng số riêng.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3.5">
        {breakdown.map((b) => (
          <div key={b.key}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700">
                {b.label}{" "}
                <span className="text-xs text-slate-400">({Math.round(b.weight * 100)}%)</span>
              </span>
              <span className="font-semibold text-slate-800">{Math.round(b.rawScore)}/100</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${barColor(b.rawScore)}`}
                style={{ width: `${Math.round(b.rawScore)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Điểm đáng tiền = Σ (điểm tiêu chí × trọng số). Tiêu chí &quot;Giá hiện tại&quot; so
        sánh giá tốt nhất hiện tại với giá trung bình 30 ngày gần nhất.
      </p>
    </div>
  );
}

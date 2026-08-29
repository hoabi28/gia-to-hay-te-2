import type { Laptop } from "@/types/laptop";

export function VerdictBox({ laptop }: { laptop: Laptop }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-good-100 bg-good-50 p-4">
        <h3 className="text-sm font-bold text-good-700">Nên mua nếu…</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
          {laptop.buyIf.map((t, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="text-good-600">✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-red-100 bg-red-50 p-4">
        <h3 className="text-sm font-bold text-red-700">Không nên mua nếu…</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
          {laptop.avoidIf.map((t, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="text-red-500">✕</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
        <h3 className="text-sm font-bold text-brand-700">Phù hợp nhất cho</h3>
        <p className="mt-2 text-sm text-slate-700">{laptop.bestFor}</p>
      </div>
    </div>
  );
}

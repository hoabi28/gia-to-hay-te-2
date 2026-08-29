import type { Laptop } from "@/types/laptop";
import { getBestCurrentPrice } from "@/lib/price";
import { calculateValueScore, getOverallPerformance } from "@/lib/scoring";
import { formatVND } from "@/lib/format";

interface Row {
  label: string;
  render: (l: Laptop) => string;
  raw?: (l: Laptop) => number;
  higherIsBetter?: boolean;
  note?: string;
}

function storageGB(storage: string): number {
  const match = storage.match(/(\d+)\s*TB/i);
  if (match) return Number(match[1]) * 1000;
  const gb = storage.match(/(\d+)\s*GB/i);
  return gb ? Number(gb[1]) : 0;
}

const ROWS: Row[] = [
  {
    label: "Giá hiện tại",
    render: (l) => formatVND(getBestCurrentPrice(l)),
    raw: (l) => getBestCurrentPrice(l),
    higherIsBetter: false,
  },
  {
    label: "Giá trị so với giá tiền",
    render: (l) =>
      `${formatVND(Math.round(getBestCurrentPrice(l) / getOverallPerformance(l)))} / điểm hiệu năng`,
    raw: (l) => getBestCurrentPrice(l) / getOverallPerformance(l),
    higherIsBetter: false,
    note: "Số tiền phải trả cho mỗi điểm hiệu năng — càng thấp càng lời",
  },
  { label: "CPU", render: (l) => l.specs.cpu },
  {
    label: "RAM",
    render: (l) => `${l.specs.ram}GB ${l.specs.ramType}`,
    raw: (l) => l.specs.ram,
    higherIsBetter: true,
  },
  {
    label: "Ổ cứng (SSD)",
    render: (l) => l.specs.storage,
    raw: (l) => storageGB(l.specs.storage),
    higherIsBetter: true,
  },
  { label: "Card đồ hoạ (GPU)", render: (l) => l.specs.gpu },
  {
    label: "Hiệu năng lập trình",
    render: (l) => `${l.performance["lap-trinh"]}/100`,
    raw: (l) => l.performance["lap-trinh"],
    higherIsBetter: true,
  },
  {
    label: "Hiệu năng Photoshop / thiết kế",
    render: (l) => `${l.performance["thiet-ke"]}/100`,
    raw: (l) => l.performance["thiet-ke"],
    higherIsBetter: true,
  },
  {
    label: "Hiệu năng chơi game",
    render: (l) => `${l.performance.gaming}/100`,
    raw: (l) => l.performance.gaming,
    higherIsBetter: true,
  },
  {
    label: "Hiệu năng dựng video",
    render: (l) => `${l.performance["dung-video"]}/100`,
    raw: (l) => l.performance["dung-video"],
    higherIsBetter: true,
  },
  {
    label: "Màn hình",
    render: (l) => `${l.specs.screenSize}" ${l.specs.screenPanel} — ${l.criteria.screen}/100`,
    raw: (l) => l.criteria.screen,
    higherIsBetter: true,
  },
  {
    label: "Pin",
    render: (l) => `${l.specs.batteryLifeHours} giờ thực tế — ${l.criteria.battery}/100`,
    raw: (l) => l.criteria.battery,
    higherIsBetter: true,
  },
  {
    label: "Độ ồn & nhiệt độ",
    render: (l) => `${l.criteria.durability}/100`,
    raw: (l) => l.criteria.durability,
    higherIsBetter: true,
    note: "Điểm càng cao = tản nhiệt tốt hơn, máy càng mát và êm hơn",
  },
  {
    label: "Bảo hành",
    render: (l) => `${l.warrantyMonths} tháng`,
    raw: (l) => l.warrantyMonths,
    higherIsBetter: true,
  },
  {
    label: "Điểm đáng tiền",
    render: (l) => `${calculateValueScore(l).total}/100`,
    raw: (l) => calculateValueScore(l).total,
    higherIsBetter: true,
  },
];

function WinnerCell({
  value,
  isWinner,
  note,
}: {
  value: string;
  isWinner: boolean;
  note?: string;
}) {
  return (
    <div
      className={`rounded-lg px-3 py-2.5 text-sm ${
        isWinner ? "bg-good-50 font-semibold text-good-700 ring-1 ring-good-600/20" : "text-slate-700"
      }`}
    >
      <div className="flex items-center gap-1.5">
        {isWinner && <span aria-hidden>✓</span>}
        <span>{value}</span>
      </div>
      {note && <p className="mt-0.5 text-[11px] font-normal text-slate-400">{note}</p>}
    </div>
  );
}

export function CompareTable({ a, b }: { a: Laptop; b: Laptop }) {
  return (
    <div className="scrollbar-thin overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="w-48 px-4 py-3 text-left font-semibold text-slate-500">Tiêu chí</th>
            <th className="px-3 py-3 text-left font-bold text-slate-900">{a.name}</th>
            <th className="px-3 py-3 text-left font-bold text-slate-900">{b.name}</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => {
            const rawA = row.raw?.(a);
            const rawB = row.raw?.(b);
            let winnerA = false;
            let winnerB = false;
            if (rawA !== undefined && rawB !== undefined && rawA !== rawB) {
              const aWins = row.higherIsBetter ? rawA > rawB : rawA < rawB;
              winnerA = aWins;
              winnerB = !aWins;
            }
            return (
              <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                <td className="px-4 py-2.5 align-top text-xs font-medium text-slate-500">
                  {row.label}
                </td>
                <td className="px-3 py-2.5 align-top">
                  <WinnerCell value={row.render(a)} isWinner={winnerA} note={row.note} />
                </td>
                <td className="px-3 py-2.5 align-top">
                  <WinnerCell value={row.render(b)} isWinner={winnerB} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

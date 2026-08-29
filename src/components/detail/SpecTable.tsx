import type { Laptop } from "@/types/laptop";

export function SpecTable({ laptop }: { laptop: Laptop }) {
  const { specs } = laptop;
  const rows: [string, string][] = [
    ["CPU", specs.cpu],
    ["RAM", `${specs.ram}GB ${specs.ramType}`],
    ["Ổ cứng", specs.storage],
    ["Card đồ hoạ", specs.gpu],
    ["Màn hình", `${specs.screenSize}" ${specs.screenResolution} · ${specs.screenPanel} · ${specs.refreshRate}Hz`],
    ["Pin", `${specs.battery}Wh (khoảng ${specs.batteryLifeHours} giờ sử dụng thực tế)`],
    ["Trọng lượng", `${specs.weightKg}kg`],
    ["Cổng kết nối", specs.ports.join(", ")],
    ["Hệ điều hành", specs.os],
    ["Bảo hành", `${laptop.warrantyMonths} tháng`],
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={label} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
              <th className="w-40 shrink-0 px-4 py-3 text-left font-medium text-slate-500 sm:w-56">
                {label}
              </th>
              <td className="px-4 py-3 text-slate-800">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

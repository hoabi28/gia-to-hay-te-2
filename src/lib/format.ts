export function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}

/** Rút gọn số tiền theo đơn vị triệu, vd 21990000 -> "22 triệu" */
export function formatVNDShort(amount: number): string {
  const trieu = amount / 1_000_000;
  const rounded = Math.round(trieu * 10) / 10;
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)} triệu`;
}

export function formatDateVN(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${Math.round(value * 100)}%`;
}

function scoreColor(score: number): string {
  if (score >= 80) return "bg-good-50 text-good-700 ring-good-600/20";
  if (score >= 65) return "bg-brand-50 text-brand-700 ring-brand-600/20";
  return "bg-warn-50 text-warn-700 ring-warn-600/20";
}

export function ValueScoreBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-9 w-9 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg",
  }[size];

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-full font-bold ring-1 ${scoreColor(
        score
      )} ${sizeClasses}`}
      title="Điểm đáng tiền trên thang 100"
    >
      <span className="leading-none">{score}</span>
    </div>
  );
}

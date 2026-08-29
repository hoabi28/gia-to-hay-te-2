export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-5xl animate-pulse px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[280px_1fr]">
        <div className="aspect-[4/3] w-full rounded-2xl bg-slate-100" />
        <div className="space-y-3">
          <div className="h-4 w-40 rounded bg-slate-100" />
          <div className="h-7 w-72 rounded bg-slate-100" />
          <div className="h-4 w-56 rounded bg-slate-100" />
          <div className="h-8 w-40 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

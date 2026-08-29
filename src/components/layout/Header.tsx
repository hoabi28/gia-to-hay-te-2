import Link from "next/link";
import { SearchBar } from "@/components/ui/SearchBar";
import { SITE_NAME } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-small.png" alt={SITE_NAME} className="h-9 w-9" />
          <span className="text-base font-bold tracking-tight text-slate-900">
            {SITE_NAME}
          </span>
        </Link>

        <div className="order-3 w-full min-w-0 sm:order-2 sm:max-w-md sm:flex-1">
          <SearchBar />
        </div>

        <Link
          href="/so-sanh"
          className="order-2 ml-auto shrink-0 rounded-full border border-brand-700 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 sm:order-3 sm:ml-0"
        >
          So sánh laptop
        </Link>
      </div>
    </header>
  );
}

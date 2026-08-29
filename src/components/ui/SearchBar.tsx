"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  defaultValue?: string;
  size?: "sm" | "lg";
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  defaultValue = "",
  size = "sm",
  placeholder = "Tìm MacBook, Lenovo LOQ, laptop dưới 20 triệu…",
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/laptop?${params.toString()}`);
  }

  const isLg = size === "lg";

  return (
    <form onSubmit={handleSubmit} className={`flex w-full ${className}`}>
      <div
        className={`flex w-full min-w-0 items-center gap-2 rounded-full border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-brand-500/30 ${
          isLg ? "px-5 py-3.5" : "px-4 py-2"
        }`}
      >
        <svg
          className={`shrink-0 text-slate-400 ${isLg ? "h-5 w-5" : "h-4 w-4"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={`w-full min-w-0 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none ${
            isLg ? "text-base" : "text-sm"
          }`}
        />
        <button
          type="submit"
          className={`shrink-0 rounded-full bg-brand-700 font-semibold text-white transition-colors hover:bg-brand-800 ${
            isLg ? "px-5 py-2 text-sm" : "px-3.5 py-1.5 text-xs"
          }`}
        >
          Tìm
        </button>
      </div>
    </form>
  );
}

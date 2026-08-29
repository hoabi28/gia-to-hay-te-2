"use client";

import { useState } from "react";
import type { CommunityReview, ReviewAspect } from "@/types/laptop";
import { REVIEW_ASPECT_LABEL } from "@/types/laptop";
import { formatDateVN } from "@/lib/format";
import { hasVotedHelpful, markHelpful } from "@/lib/helpfulVotes";

const ASPECT_ORDER: ReviewAspect[] = [
  "nhiet-do",
  "do-on-quat",
  "pin-thuc-te",
  "man-hinh",
  "hoan-thien",
  "loi-thuong-gap",
  "bao-hanh",
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating}/5 sao`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-3.5 w-3.5 ${i < rating ? "fill-amber-400" : "fill-slate-200"}`}
        >
          <path d="M10 1.5 12.6 7l6 .9-4.3 4.2 1 6-5.3-2.8L4.7 18l1-6L1.4 7.9l6-.9L10 1.5Z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: CommunityReview }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [voted, setVoted] = useState(false);

  function handleHelpful() {
    if (typeof window !== "undefined" && hasVotedHelpful(review.id)) {
      setVoted(true);
      return;
    }
    if (markHelpful(review.id)) {
      setHelpfulCount((c) => c + 1);
      setVoted(true);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800">{review.author}</span>
          <Stars rating={review.rating} />
        </div>
        <span className="shrink-0 text-xs text-slate-400">{formatDateVN(review.date)}</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Đã dùng máy khoảng {review.usageDurationMonths} tháng
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{review.content}</p>
      <button
        type="button"
        onClick={handleHelpful}
        disabled={voted}
        className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
          voted
            ? "border-brand-200 bg-brand-50 text-brand-700"
            : "border-slate-200 text-slate-500 hover:bg-slate-50"
        }`}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 10v11M2 10h4v11H2z" />
          <path d="M9 10l3.5-7a2 2 0 0 1 2.5.5 2 2 0 0 1 .3 1.5L14.5 10H20a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 18.6 21H9V10Z" />
        </svg>
        Hữu ích ({helpfulCount})
      </button>
    </div>
  );
}

export function ReviewsSection({ reviews }: { reviews: CommunityReview[] }) {
  const grouped = ASPECT_ORDER.map((aspect) => ({
    aspect,
    items: reviews.filter((r) => r.aspect === aspect),
  })).filter((g) => g.items.length > 0);

  if (grouped.length === 0) {
    return <p className="text-sm text-slate-500">Chưa có nhận xét nào cho máy này.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {grouped.map((g) => (
        <div key={g.aspect}>
          <h3 className="mb-3 text-sm font-bold text-slate-900">
            {REVIEW_ASPECT_LABEL[g.aspect]}
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {g.items.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

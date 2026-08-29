const STORAGE_KEY = "giatothayte:helpful-votes";

function readVotes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function hasVotedHelpful(reviewId: string): boolean {
  return readVotes().includes(reviewId);
}

/** Đánh dấu một review là hữu ích (chỉ tính 1 lần mỗi thiết bị). Trả về true nếu vừa ghi nhận vote mới. */
export function markHelpful(reviewId: string): boolean {
  const votes = readVotes();
  if (votes.includes(reviewId)) return false;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...votes, reviewId]));
  return true;
}

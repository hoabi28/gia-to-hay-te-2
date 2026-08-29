const STORAGE_KEY = "giatothayte:compare";
const EVENT_NAME = "giatothayte:compare-changed";
const MAX_COMPARE = 2;
const EMPTY: string[] = [];

// Cache tham chiếu mảng theo raw string trong localStorage — bắt buộc để
// useSyncExternalStore không rơi vào vòng lặp vô hạn (getSnapshot phải trả
// về cùng reference nếu dữ liệu chưa đổi).
let cachedRaw: string | null | undefined;
let cachedIds: string[] = EMPTY;

function readIds(): string[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedIds;

  cachedRaw = raw;
  try {
    if (!raw) {
      cachedIds = EMPTY;
    } else {
      const parsed = JSON.parse(raw);
      cachedIds = Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : EMPTY;
    }
  } catch {
    cachedIds = EMPTY;
  }
  return cachedIds;
}

function writeIds(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function getCompareIds(): string[] {
  return readIds();
}

export function isInCompare(id: string): boolean {
  return readIds().includes(id);
}

/** Thêm vào danh sách so sánh. Nếu đã đủ 2, thay máy được thêm sớm nhất. */
export function addToCompare(id: string): string[] {
  const ids = readIds();
  if (ids.includes(id)) return ids;
  const next = [...ids, id].slice(-MAX_COMPARE);
  writeIds(next);
  return next;
}

export function removeFromCompare(id: string): string[] {
  const next = readIds().filter((x) => x !== id);
  writeIds(next);
  return next;
}

export function toggleCompare(id: string): string[] {
  return isInCompare(id) ? removeFromCompare(id) : addToCompare(id);
}

export function clearCompare(): string[] {
  writeIds([]);
  return [];
}

export function subscribeCompare(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

export { MAX_COMPARE };

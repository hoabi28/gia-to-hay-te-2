"use client";

import { useSyncExternalStore } from "react";
import { getCompareIds, subscribeCompare } from "@/lib/compareStore";

const SERVER_SNAPSHOT: string[] = [];

function getServerSnapshot(): string[] {
  return SERVER_SNAPSHOT;
}

/** Hook đồng bộ danh sách so sánh (tối đa 2 máy) với localStorage, an toàn khi SSR. */
export function useCompareIds(): string[] {
  return useSyncExternalStore(subscribeCompare, getCompareIds, getServerSnapshot);
}

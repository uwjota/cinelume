"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollTriggerProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => Promise<unknown>;
  loadingLabel: string;
}

/** Loads the next catalog page shortly before the user reaches the end of a list. */
export function InfiniteScrollTrigger({
  hasMore,
  isLoading,
  onLoadMore,
  loadingLabel,
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          void onLoadMore();
        }
      },
      { rootMargin: "0px 0px 400px" }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  if (!hasMore) return null;

  return (
    <div ref={triggerRef} className="flex min-h-16 justify-center pt-6" aria-live="polite">
      {isLoading && (
        <span className="inline-flex items-center gap-2 text-sm text-cine-text-secondary">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {loadingLabel}
        </span>
      )}
    </div>
  );
}

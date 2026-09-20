"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { UnifiedSearchResult } from "@/services/search/search.service";

type SearchPage = UnifiedSearchResult;

async function fetchSearchPage(query: string, page: number): Promise<SearchPage> {
  const params = new URLSearchParams({ q: query, page: String(page) });
  const response = await fetch(`/api/search?${params}`);
  if (!response.ok) throw new Error("Não foi possível concluir a busca.");
  return response.json() as Promise<SearchPage>;
}

/**
 * Custom hook providing debounced search across all content types with React Query.
 */
export function useUnifiedSearch(rawQuery: string, debounceMs = 400) {
  const [debouncedQuery, setDebouncedQuery] = useState(rawQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(rawQuery.trim());
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [rawQuery, debounceMs]);

  const queryResult = useInfiniteQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: ({ pageParam }) => fetchSearchPage(debouncedQuery, pageParam),
    enabled: debouncedQuery.length > 1,
    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.mediaPage < lastPage.mediaTotalPages
        ? lastPage.mediaPage + 1
        : undefined,
  });

  const pages = queryResult.data?.pages ?? [];
  const firstPage = pages[0];
  const data: UnifiedSearchResult | undefined = firstPage
    ? {
        ...firstPage,
        media: pages.flatMap((searchPage) => searchPage.media),
        channels: firstPage.channels,
        events: firstPage.events,
      }
    : undefined;

  const isDebouncing = rawQuery.trim() !== debouncedQuery;
  const isIdle = debouncedQuery.length <= 1;
  const isEmpty =
    !isIdle &&
    !queryResult.isLoading &&
    data?.media.length === 0 &&
    data?.channels.length === 0 &&
    data?.events.length === 0;

  return {
    ...queryResult,
    data,
    debouncedQuery,
    isDebouncing,
    isIdle,
    isEmpty,
    hasMoreMedia: queryResult.hasNextPage,
    loadMoreMedia: queryResult.fetchNextPage,
    isLoadingMoreMedia: queryResult.isFetchingNextPage,
  };
}

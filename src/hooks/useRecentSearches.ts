"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recentSearchesService } from "@/services/storage/recent-searches.service";

const queryKey = ["local", "recentSearches"] as const;

export function useRecentSearches() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey,
    queryFn: () => recentSearchesService.getAll(),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey });

  const addMutation = useMutation({
    mutationFn: (value: string) => recentSearchesService.add(value),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => recentSearchesService.remove(id),
    onSuccess: invalidate,
  });
  const clearMutation = useMutation({
    mutationFn: () => recentSearchesService.clear(),
    onSuccess: invalidate,
  });

  return {
    recentSearches: query.data ?? [],
    isLoading: query.isLoading,
    addRecentSearch: addMutation.mutate,
    removeRecentSearch: removeMutation.mutate,
    clearRecentSearches: clearMutation.mutate,
  };
}

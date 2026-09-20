"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { watchProgressService } from "@/services/storage/watch-progress.service";
import type { WatchProgress } from "@/types";

export function useWatchProgress(limit = 10) {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery<WatchProgress[]>({
    queryKey: ["local", "watchProgress", limit],
    queryFn: () => watchProgressService.getAll(limit),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const saveMutation = useMutation({
    mutationFn: (item: Omit<WatchProgress, "updatedAt">) =>
      watchProgressService.save(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["local", "watchProgress"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (mediaId: string) => watchProgressService.remove(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["local", "watchProgress"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => watchProgressService.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["local", "watchProgress"] });
    },
  });

  return {
    items,
    isLoading,
    saveProgress: saveMutation.mutate,
    removeProgress: removeMutation.mutate,
    clearProgress: clearMutation.mutate,
  };
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { historyService } from "@/services/storage/history.service";

const queryKey = ["local", "history"] as const;

export function useHistory() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey,
    queryFn: () => historyService.getAll(),
  });
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey });

  const removeMutation = useMutation({
    mutationFn: (id: number) => historyService.remove(id),
    onSuccess: invalidate,
  });
  const clearMutation = useMutation({
    mutationFn: () => historyService.clear(),
    onSuccess: invalidate,
  });

  return {
    history: query.data ?? [],
    isLoading: query.isLoading,
    removeHistoryItem: removeMutation.mutate,
    clearHistory: clearMutation.mutate,
  };
}

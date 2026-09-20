"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritesService } from "@/services/storage/favorites.service";
import type { Media, Favorite } from "@/types";

export function useFavorites() {
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery<Favorite[]>({
    queryKey: ["local", "favorites"],
    queryFn: () => favoritesService.getAll(),
  });

  const toggleMutation = useMutation({
    mutationFn: (media: Media) => favoritesService.toggle(media),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["local", "favorites"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (mediaId: string) => favoritesService.remove(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["local", "favorites"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => favoritesService.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["local", "favorites"] });
    },
  });

  const isFavorite = (mediaId: string) =>
    favorites.some((f) => f.mediaId === mediaId);

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite: toggleMutation.mutate,
    removeFavorite: removeMutation.mutate,
    clearFavorites: clearMutation.mutate,
  };
}

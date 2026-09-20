"use client";

import { useQuery } from "@tanstack/react-query";
import { metadataService } from "@/services/metadata/metadata.service";
import type { Episode, MediaType } from "@/types";

export function useMediaDetails(id: string, type: MediaType) {
  return useQuery({
    queryKey: ["media", type, id],
    queryFn: () => metadataService.getDetails(id, type),
    enabled: Boolean(id),
  });
}

export function useSeasonEpisodes(seriesId: string, seasonNumber: number) {
  return useQuery({
    queryKey: ["series", seriesId, "season", seasonNumber],
    queryFn: async () => {
      const response = await fetch(
        `/api/series/${encodeURIComponent(seriesId)}/seasons/${seasonNumber}`
      );
      if (!response.ok) {
        throw new Error("Não foi possível carregar os episódios.");
      }
      return response.json() as Promise<Episode[]>;
    },
    enabled: Boolean(seriesId && seasonNumber > 0),
  });
}

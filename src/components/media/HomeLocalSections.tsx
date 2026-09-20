"use client";

import { ContinueWatchingRow } from "./ContinueWatchingCard";
import { MediaRow } from "./MediaRow";
import { useFavorites } from "@/hooks/useFavorites";
import { useWatchProgress } from "@/hooks/useWatchProgress";
import type { Media } from "@/types";

export function HomeLocalSections() {
  const { items } = useWatchProgress(10);
  const { favorites } = useFavorites();
  const favoriteMedia: Media[] = favorites.map((favorite) => ({
    id: favorite.mediaId,
    title: favorite.title,
    poster: favorite.poster,
    type: favorite.type,
  }));

  if (items.length === 0 && favoriteMedia.length === 0) return null;

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <ContinueWatchingRow items={items} />
      {favoriteMedia.length > 0 && (
        <MediaRow title="Minha Lista" items={favoriteMedia} showType />
      )}
    </div>
  );
}

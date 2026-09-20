"use client";

import { Heart, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { MediaCard, MediaCardSkeleton } from "@/components/media/MediaCard";
import { GenreChip } from "@/components/ui/GenreChip";
import { useFavorites } from "@/hooks/useFavorites";
import { useState } from "react";
import type { Media, MediaType } from "@/types";

const filters: Array<{ label: string; value: "all" | MediaType }> = [
  { label: "Todos", value: "all" },
  { label: "Filmes", value: "movie" },
  { label: "Séries", value: "series" },
  { label: "Animes", value: "anime" },
  { label: "Doramas", value: "dorama" },
];

export default function MinhaListaPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | MediaType>("all");
  const { favorites, isLoading, removeFavorite, clearFavorites } = useFavorites();
  const filtered = favorites.filter(
    (item) => activeFilter === "all" || item.type === activeFilter
  );

  const removeAll = () => {
    if (window.confirm("Remover todos os títulos da Minha Lista?")) {
      clearFavorites();
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 pt-20 md:pt-24 flex flex-col gap-6 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Minha Lista
          </h1>
          <p className="text-sm sm:text-base text-cine-text-secondary mt-1">
            Seus títulos favoritos ficam salvos somente neste dispositivo.
          </p>
        </div>
        {favorites.length > 0 && (
          <button
            type="button"
            onClick={removeAll}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/15 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
            Limpar lista
          </button>
        )}
      </div>

      {favorites.length > 0 && (
        <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide">
          {filters.map((filter) => (
            <GenreChip
              key={filter.value}
              label={filter.label}
              active={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
            />
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <MediaCardSkeleton key={index} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-5">
          {filtered.map((favorite) => {
            const media: Media = {
              id: favorite.mediaId,
              title: favorite.title,
              poster: favorite.poster,
              type: favorite.type,
            };

            return (
              <div key={favorite.mediaId} className="relative">
                <MediaCard media={media} showType />
                <button
                  type="button"
                  onClick={() => removeFavorite(favorite.mediaId)}
                  className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/75 text-white/80 backdrop-blur-sm transition-colors hover:bg-red-600 hover:text-white"
                  aria-label={`Remover ${favorite.title} da Minha Lista`}
                  title="Remover da Minha Lista"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-cine-border bg-cine-surface p-8">
          <EmptyState
            icon={<Heart className="mb-4 h-12 w-12 text-cine-brand" />}
            message={
              favorites.length > 0
                ? "Nenhum título corresponde a este filtro."
                : "Você ainda não adicionou nenhum título. Use o botão Minha Lista nos detalhes de uma obra."
            }
          />
        </div>
      )}
    </div>
  );
}

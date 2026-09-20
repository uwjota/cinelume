"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import type { Media } from "@/types";

interface FavoriteButtonProps {
  media: Media;
  showText?: boolean;
  className?: string;
}

export function FavoriteButton({
  media,
  showText = true,
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(media.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(media);
      }}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand ${
        active
          ? "bg-cine-brand text-white border-cine-brand shadow-lg shadow-cine-brand/25"
          : "bg-white/10 hover:bg-white/20 text-white border-white/10"
      } ${className}`}
      aria-label={
        active
          ? `Remover ${media.title} da Minha Lista`
          : `Adicionar ${media.title} à Minha Lista`
      }
      aria-pressed={active}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-200 ${
          active ? "fill-white scale-110" : ""
        }`}
      />
      {showText && (
        <span>{active ? "Na Minha Lista" : "Minha Lista"}</span>
      )}
    </button>
  );
}

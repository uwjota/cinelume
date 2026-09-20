"use client";

import type { Season } from "@/types";

interface SeasonSelectorProps {
  seasons: Season[];
  selectedSeason: number;
  onSelectSeason: (seasonNumber: number) => void;
}

export function SeasonSelector({
  seasons,
  selectedSeason,
  onSelectSeason,
}: SeasonSelectorProps) {
  if (!seasons || seasons.length <= 1) return null;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-cine-text-muted">
        Temporada
      </label>
      <div
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 -mx-4 px-4 sm:mx-0 sm:px-0"
        role="tablist"
        aria-label="Seletor de Temporadas"
      >
        {seasons.map((season) => {
          const isSelected = season.number === selectedSeason;
          return (
            <button
              key={season.number}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectSeason(season.number)}
              className={`min-h-[44px] px-4 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand ${
                isSelected
                  ? "bg-cine-brand text-white shadow-lg shadow-cine-brand/25"
                  : "bg-cine-surface text-cine-text-secondary border border-cine-border hover:bg-cine-surface-elevated hover:text-white"
              }`}
            >
              {season.name || `Temporada ${season.number}`}
              {season.episodeCount > 0 && (
                <span
                  className={`ml-2 text-xs font-normal ${
                    isSelected ? "text-white/80" : "text-cine-text-muted"
                  }`}
                >
                  ({season.episodeCount} ep)
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

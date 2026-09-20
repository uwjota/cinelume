"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { Episode, MediaType } from "@/types";
import { formatRuntime, getProgressPercentage } from "@/utils/media";

interface EpisodeCardProps {
  mediaId: string;
  mediaType: MediaType;
  episode: Episode;
  progress?: { current: number; duration: number };
}

export function EpisodeCard({
  mediaId,
  mediaType,
  episode,
  progress,
}: EpisodeCardProps) {
  const [imgError, setImgError] = useState(false);

  const watchUrl = `/assistir/${mediaType === "movie" ? "filme" : "serie"}/${mediaId}?season=${episode.seasonNumber}&episode=${episode.number}&type=${mediaType}`;
  const pct = progress ? getProgressPercentage(progress.current, progress.duration) : 0;
  const episodeLabel = `E${String(episode.number).padStart(2, "0")}`;

  return (
    <Link
      href={watchUrl}
      className="group grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 rounded-xl border border-cine-border/60 bg-cine-surface p-3 transition-all duration-200 hover:border-cine-border hover:bg-cine-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand sm:grid-cols-[9.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:p-4"
      aria-label={`Assistir Episódio ${episode.number}: ${episode.title}`}
    >
      {/* Thumbnail 16:9 */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-cine-border/40 bg-black/40">
        {episode.thumbnail && !imgError ? (
          <Image
            src={episode.thumbnail}
            alt={episode.title}
            fill
            sizes="(max-width: 640px) 100vw, 210px"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cine-surface-elevated to-cine-surface">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cine-border bg-black/20 text-cine-text-muted">
              <Play className="h-4 w-4 fill-current translate-x-px" />
            </span>
          </div>
        )}

        {/* Play Icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-10 h-10 rounded-full bg-cine-brand flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
          </div>
        </div>

        {/* Progress Bar */}
        {pct > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-cine-brand" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-cine-brand sm:text-base">
            <span className="mr-2 text-xs font-bold tracking-[0.12em] text-cine-text-muted">{episodeLabel}</span>
            {episode.title}
          </h3>
          {episode.runtime && (
            <span className="text-xs text-cine-text-muted shrink-0 font-mono">
              {formatRuntime(episode.runtime)}
            </span>
          )}
        </div>

        {episode.overview ? (
          <p className="text-xs sm:text-sm text-cine-text-secondary line-clamp-2 mt-1.5 leading-relaxed">
            {episode.overview}
          </p>
        ) : (
          <p className="text-xs text-cine-text-muted italic mt-1.5">
            Sem sinopse disponível para este episódio.
          </p>
        )}
      </div>
      <span className="hidden h-9 w-9 items-center justify-center rounded-full border border-cine-border text-cine-text-secondary transition-colors group-hover:border-cine-brand group-hover:bg-cine-brand group-hover:text-white sm:flex" aria-hidden="true">
        <Play className="h-4 w-4 fill-current translate-x-px" />
      </span>
    </Link>
  );
}

export function EpisodeSkeleton() {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 rounded-xl border border-cine-border/40 bg-cine-surface p-3 animate-pulse sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:items-center sm:gap-4 sm:p-4">
      <div className="aspect-video w-full rounded-lg bg-cine-surface-elevated" />
      <div className="w-full space-y-2">
        <div className="h-4 bg-cine-surface-elevated rounded w-1/3" />
        <div className="h-3 bg-cine-surface-elevated/70 rounded w-full" />
        <div className="h-3 bg-cine-surface-elevated/50 rounded w-2/3" />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Media } from "@/types";
import { formatRating, getMediaDetailUrl, getMediaTypeLabel } from "@/utils/media";

interface MediaCardProps {
  media: Media;
  showType?: boolean;
  priority?: boolean;
}

export function MediaCard({ media, showType = false, priority = false }: MediaCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={getMediaDetailUrl(media)}
      className="group relative flex flex-col gap-2 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand focus-visible:ring-offset-2 focus-visible:ring-offset-cine-bg rounded-xl"
      aria-label={`${media.title}${media.year ? ` (${media.year})` : ""}`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-cine-surface border border-cine-border/50 transition-transform duration-200 ease-out md:group-hover:scale-[1.04] md:group-hover:shadow-xl md:group-hover:shadow-black/40">
        {media.poster && !imgError ? (
          <Image
            src={media.poster}
            alt={media.title}
            fill
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 180px"
            className="object-cover"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-cine-surface-elevated to-cine-surface text-cine-text-muted">
            <span className="text-xs font-semibold text-white/90 line-clamp-2">{media.title}</span>
            {media.year && <span className="text-[10px] text-cine-text-muted mt-1">{media.year}</span>}
          </div>
        )}

        {/* Hover overlay - desktop only */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Type badge */}
        {showType && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-cine-brand/90 text-white rounded-md">
            {getMediaTypeLabel(media.type)}
          </span>
        )}

        {/* Rating - shown on hover for desktop */}
        {media.rating && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded-md md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-white">
              {formatRating(media.rating)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-0.5">
        <h3 className="text-sm font-medium text-white truncate leading-snug">
          {media.title}
        </h3>
        {(media.year || (media.genres && media.genres.length > 0)) && (
          <p className="text-xs text-cine-text-muted truncate mt-0.5">
            {media.year}
            {media.year && media.genres && media.genres.length > 0 && " • "}
            {media.genres?.slice(0, 2).join(", ")}
          </p>
        )}
      </div>
    </Link>
  );
}

export function MediaCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 min-w-0 animate-pulse">
      <div className="aspect-[2/3] w-full rounded-xl bg-cine-surface border border-cine-border/30" />
      <div className="px-0.5 space-y-1.5">
        <div className="h-4 w-3/4 bg-cine-surface rounded" />
        <div className="h-3 w-1/2 bg-cine-surface/70 rounded" />
      </div>
    </div>
  );
}

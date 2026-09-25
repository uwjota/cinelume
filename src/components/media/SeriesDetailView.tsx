"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, ArrowLeft, Users, Clapperboard } from "lucide-react";
import { SeasonSelector } from "./SeasonSelector";
import { EpisodeCard, EpisodeSkeleton } from "./EpisodeCard";
import { FavoriteButton } from "./FavoriteButton";
import { MediaRow } from "./MediaRow";
import { useSeasonEpisodes } from "@/hooks/useMediaDetails";
import { formatRating } from "@/utils/media";
import type { MediaDetails, MediaType, Media } from "@/types";

interface SeriesDetailViewProps {
  media: MediaDetails;
  backUrl: string;
  backLabel: string;
  recommendations: Media[];
}

export function SeriesDetailView({
  media,
  backUrl,
  backLabel,
  recommendations,
}: SeriesDetailViewProps) {
  const [selectedSeason, setSelectedSeason] = useState(
    media.seasons?.[0]?.number || 1
  );

  const { data: episodes, isLoading: episodesLoading } = useSeasonEpisodes(
    media.id,
    selectedSeason
  );

  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Backdrop Hero Header */}
      <div className="relative flex min-h-[max(28rem,min(68svh,36rem))] w-full items-end overflow-hidden sm:min-h-[min(62svh,38rem)] lg:min-h-[min(68vh,42rem)]">
        {(media.backdrop || media.poster) && (
          <Image
            src={media.backdrop || media.poster!}
            alt=""
            fill
            className="object-cover object-[64%_top] sm:object-top"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cine-bg via-cine-bg/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cine-bg/95 via-cine-bg/40 to-transparent" />

        {/* Back Link */}
        <div className="absolute left-4 top-28 z-20 md:left-8">
          <Link
            href={backUrl}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/85 text-white/80 hover:text-white backdrop-blur-md text-xs sm:text-sm font-medium transition-colors border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        </div>

        {/* Content */}
        <div className="relative w-full pt-40">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 pb-10 sm:pb-14 w-full">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              {/* Poster Thumbnail */}
              {media.poster && (
                <div className="relative hidden sm:block w-36 lg:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-cine-border shrink-0">
                  <Image
                    src={media.poster}
                    alt={media.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Text info */}
              <div className="flex min-w-0 flex-col gap-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  {media.year && (
                    <span className="text-cine-text-secondary font-medium">
                      {media.year}
                    </span>
                  )}
                  {media.rating && (
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold text-white">
                        {formatRating(media.rating)}
                      </span>
                    </span>
                  )}
                  {media.genres && media.genres.length > 0 && (
                    <span className="text-cine-text-muted">
                      {media.genres.join(" • ")}
                    </span>
                  )}
                </div>

                <h1 className="break-words text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {media.title}
                </h1>

                {media.overview && (
                  <p className="text-xs sm:text-sm md:text-base text-cine-text-secondary leading-relaxed line-clamp-3">
                    {media.overview}
                  </p>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={`/assistir/${media.type === "movie" ? "filme" : "serie"}/${media.id}?season=${selectedSeason}&episode=1&type=${media.type}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-cine-brand hover:bg-cine-brand-hover text-white font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-cine-brand/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Assistir T{selectedSeason}:E1
                  </Link>
                  <FavoriteButton media={media} />
                  {media.trailer && (
                    <a
                      href={media.trailer}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
                    >
                      <Clapperboard className="h-4 w-4" /> Trailer
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 w-full flex flex-col gap-10">
        {/* Cast Section */}
        {media.cast && media.cast.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cine-brand" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Elenco
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
              {media.cast.map((actor) => (
                <div
                  key={actor.id}
                  className="flex flex-col items-center text-center w-24 shrink-0"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-cine-surface border border-cine-border mb-1.5">
                    {actor.profilePath ? (
                      <Image
                        src={actor.profilePath}
                        alt={actor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-cine-text-muted text-xs font-bold">
                        {actor.name.substring(0, 2)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-white line-clamp-1">
                    {actor.name}
                  </span>
                  {actor.character && (
                    <span className="text-[10px] text-cine-text-muted line-clamp-1">
                      {actor.character}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Season Selector */}
        {media.seasons && media.seasons.length > 0 && (
          <SeasonSelector
            seasons={media.seasons}
            selectedSeason={selectedSeason}
            onSelectSeason={setSelectedSeason}
          />
        )}

        {/* Episodes List */}
        <div className="flex flex-col gap-4 rounded-2xl border border-cine-border/70 bg-cine-surface/40 p-4 sm:p-5">
          <div className="border-b border-cine-border pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Episódios — Temporada {selectedSeason}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {episodesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <EpisodeSkeleton key={i} />
                ))
              : episodes && episodes.length > 0
                ? episodes.map((ep) => (
                    <EpisodeCard
                      key={ep.id}
                      mediaId={media.id}
                      mediaType={media.type as MediaType}
                      episode={ep}
                    />
                  ))
                : (
                  <div className="p-8 text-center bg-cine-surface border border-cine-border rounded-xl text-cine-text-secondary text-sm">
                    Os episódios desta temporada não estão disponíveis no momento.
                  </div>
                )}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="pt-4">
            <MediaRow title="Você também pode gostar" items={recommendations} />
          </div>
        )}
      </div>
    </div>
  );
}

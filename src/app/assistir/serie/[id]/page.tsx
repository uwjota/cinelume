import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Tv, Star } from "lucide-react";
import { metadataService } from "@/services/metadata/metadata.service";
import { CinelumePlayer } from "@/components/player/CinelumePlayer";
import { EpisodeCard } from "@/components/media/EpisodeCard";
import { formatRating } from "@/utils/media";
import type { MediaType } from "@/types";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;
export const metadata = createPageMetadata({
  title: "Assistir episódio",
  description: "Player de séries, animes e doramas do Cinelume.",
  path: "/assistir/serie",
  noIndex: true,
});

export default async function AssistirSeriePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; episode?: string; type?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const currentSeason = Number.parseInt(sp.season || "1", 10) || 1;
  const currentEpisode = Number.parseInt(sp.episode || "1", 10) || 1;
  const mediaType: MediaType =
    sp.type === "anime" || sp.type === "dorama" ? sp.type : "series";

  const [serie, episodes] = await Promise.all([
    metadataService.getDetails(id, mediaType),
    metadataService.getEpisodes(id, currentSeason),
  ]);

  if (!serie) {
    notFound();
  }

  const currentEpData = episodes.find((e) => e.number === currentEpisode);
  const totalEpisodesInSeason = episodes.length;

  // Next / Previous episode calculation
  const hasNext = currentEpisode < totalEpisodesInSeason;
  const hasPrev = currentEpisode > 1;

  const nextUrl = hasNext
    ? `/assistir/serie/${serie.id}?season=${currentSeason}&episode=${currentEpisode + 1}&type=${mediaType}`
    : undefined;

  const prevUrl = hasPrev
    ? `/assistir/serie/${serie.id}?season=${currentSeason}&episode=${currentEpisode - 1}&type=${mediaType}`
    : undefined;

  return (
    <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-8 pt-24 md:pt-28 flex flex-col gap-8 pb-16">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${mediaType === "series" ? "serie" : mediaType}/${serie.id}`}
          className="inline-flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-cine-text-secondary hover:text-white transition-colors p-1 -ml-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Voltar para {serie.title}
        </Link>
      </div>

      {/* Cinelume Video Player */}
      <CinelumePlayer
        mediaId={serie.id}
        mediaType={mediaType}
        title={serie.title}
        season={currentSeason}
        episode={currentEpisode}
        episodeTitle={currentEpData?.title}
        poster={currentEpData?.thumbnail || serie.backdrop || serie.poster}
        durationSeconds={
          currentEpData?.runtime ? currentEpData.runtime * 60 : undefined
        }
        nextEpisodeUrl={nextUrl}
        prevEpisodeUrl={prevUrl}
      />

      {/* Episode / Series Info Card */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-5 bg-cine-surface border border-cine-border rounded-2xl">
        <div className="flex min-w-0 flex-col gap-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-cine-brand font-semibold uppercase tracking-wider">
              <Tv className="w-3.5 h-3.5" />
              Série
            </span>
            <span className="text-cine-text-muted">
              • Temporada {currentSeason}, Episódio {currentEpisode}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {serie.title}
            {currentEpData?.title && (
              <span className="text-cine-text-secondary font-medium ml-2">
                — {currentEpData.title}
              </span>
            )}
          </h1>
          {currentEpData?.overview ? (
            <p className="text-xs sm:text-sm text-cine-text-secondary leading-relaxed">
              {currentEpData.overview}
            </p>
          ) : serie.overview ? (
            <p className="text-xs sm:text-sm text-cine-text-secondary leading-relaxed line-clamp-3">
              {serie.overview}
            </p>
          ) : null}
        </div>

        {serie.rating && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cine-surface-elevated border border-cine-border rounded-xl text-sm font-bold text-white shrink-0">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            {formatRating(serie.rating)}
          </div>
        )}
      </div>

      {/* Season Episodes List for quick switching */}
      {episodes.length > 0 && (
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cine-border pb-3">
            <h2 className="text-base sm:text-lg font-bold text-white">
              Episódios — Temporada {currentSeason}
            </h2>
            <span className="text-xs text-cine-text-muted font-mono">
              {episodes.length} episódios
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {episodes.map((ep) => (
              <div
                key={ep.id}
                className={ep.number === currentEpisode ? "ring-1 ring-cine-brand rounded-xl" : ""}
              >
                <EpisodeCard
                  mediaId={serie.id}
                      mediaType={mediaType}
                  episode={ep}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Film, Star } from "lucide-react";
import { metadataService } from "@/services/metadata/metadata.service";
import { catalogService } from "@/services/catalog/catalog.service";
import { CinelumePlayer } from "@/components/player/CinelumePlayer";
import { MediaRow } from "@/components/media/MediaRow";
import { formatRating } from "@/utils/media";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;
export const metadata = createPageMetadata({
  title: "Assistir filme",
  description: "Player de filmes do Cinelume.",
  path: "/assistir/filme",
  noIndex: true,
});

export default async function AssistirFilmePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [movie, popular] = await Promise.all([
    metadataService.getDetails(id, "movie"),
    catalogService.getPopularMovies(),
  ]);

  if (!movie) {
    notFound();
  }

  const recommendations = popular.filter((m) => m.id !== movie.id);

  return (
    <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-8 pt-24 md:pt-28 flex flex-col gap-8 pb-16">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href={`/filme/${movie.id}`}
          className="inline-flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-cine-text-secondary hover:text-white transition-colors p-1 -ml-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Voltar para detalhes de {movie.title}
        </Link>
      </div>

      {/* Cinelume Video Player */}
      <CinelumePlayer
        mediaId={movie.id}
        mediaType="movie"
        title={movie.title}
        poster={movie.backdrop || movie.poster}
        durationSeconds={movie.runtime ? movie.runtime * 60 : undefined}
      />

      {/* Movie Info Card */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-5 bg-cine-surface border border-cine-border rounded-2xl">
        <div className="flex min-w-0 flex-col gap-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-cine-brand font-semibold uppercase tracking-wider">
              <Film className="w-3.5 h-3.5" />
              Filme
            </span>
            {movie.year && (
              <span className="text-cine-text-muted">• {movie.year}</span>
            )}
            {movie.genres && movie.genres.length > 0 && (
              <span className="text-cine-text-muted">
                • {movie.genres.slice(0, 3).join(", ")}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {movie.title}
          </h1>
          {movie.overview && (
            <p className="text-xs sm:text-sm text-cine-text-secondary leading-relaxed line-clamp-3">
              {movie.overview}
            </p>
          )}
        </div>

        {movie.rating && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cine-surface-elevated border border-cine-border rounded-xl text-sm font-bold text-white shrink-0">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            {formatRating(movie.rating)}
          </div>
        )}
      </div>

      {/* Recommended Movies */}
      {recommendations.length > 0 && (
        <div className="pt-4">
          <MediaRow title="Você também pode gostar" items={recommendations} />
        </div>
      )}
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Star, ArrowLeft, Clock, Users, Clapperboard } from "lucide-react";
import { metadataService } from "@/services/metadata/metadata.service";
import { catalogService } from "@/services/catalog/catalog.service";
import { FavoriteButton } from "@/components/media/FavoriteButton";
import { MediaRow } from "@/components/media/MediaRow";
import { formatRating, formatRuntime } from "@/utils/media";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await metadataService.getDetails(id, "movie");

  if (!movie) {
    return createPageMetadata({
      title: "Filme não encontrado",
      description: "Este filme não está disponível no Cinelume.",
      path: `/filme/${id}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: movie.title,
    description: movie.overview || `Veja detalhes de ${movie.title} no Cinelume.`,
    path: `/filme/${movie.id}`,
    image: movie.backdrop || movie.poster,
  });
}

export default async function FilmeDetailPage({
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

  const recommendations = [...(movie.recommendations ?? []), ...popular]
    .filter((item) => item.id !== movie.id)
    .filter((item, index, collection) => collection.findIndex((candidate) => candidate.id === item.id) === index);

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Hero Backdrop */}
      <div className="relative flex min-h-[32rem] w-full items-end overflow-hidden sm:min-h-[36rem] lg:min-h-[38rem]">
        {(movie.backdrop || movie.poster) && (
          <Image
            src={movie.backdrop || movie.poster!}
            alt=""
            fill
            className="object-cover object-[62%_top] sm:object-top"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cine-bg via-cine-bg/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cine-bg/95 via-cine-bg/40 to-transparent" />

        <div className="absolute left-4 top-28 z-20 md:left-8">
          <Link
            href="/filmes"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/85 text-white/80 hover:text-white backdrop-blur-md text-xs sm:text-sm font-medium transition-colors border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Filmes
          </Link>
        </div>

        <div className="relative w-full pt-40">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 pb-8 sm:pb-12 w-full">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              {movie.poster && (
                <div className="relative hidden sm:block w-36 lg:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-cine-border shrink-0">
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex min-w-0 flex-col gap-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  {movie.year && (
                    <span className="text-cine-text-secondary font-medium">
                      {movie.year}
                    </span>
                  )}
                  {movie.runtime && (
                    <span className="flex items-center gap-1 text-cine-text-secondary">
                      <Clock className="w-3.5 h-3.5" />
                      {formatRuntime(movie.runtime)}
                    </span>
                  )}
                  {movie.rating && (
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold text-white">
                        {formatRating(movie.rating)}
                      </span>
                    </span>
                  )}
                  {movie.genres && (
                    <span className="text-cine-text-muted">
                      {movie.genres.join(" • ")}
                    </span>
                  )}
                </div>

                <h1 className="break-words text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                  {movie.title}
                </h1>

                {movie.overview && (
                  <p className="text-xs sm:text-sm md:text-base text-cine-text-secondary leading-relaxed line-clamp-3">
                    {movie.overview}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={`/assistir/filme/${movie.id}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-cine-brand hover:bg-cine-brand-hover text-white font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-cine-brand/25"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Assistir
                  </Link>
                  <FavoriteButton media={movie} />
                  {movie.trailer && (
                    <a
                      href={movie.trailer}
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

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 w-full flex flex-col gap-10">
        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cine-brand" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Elenco
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
              {movie.cast.map((actor) => (
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

        {movie.directors && movie.directors.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-white">Direção:</span>
            <span className="text-cine-text-secondary">
              {movie.directors.map((director) => director.name).join(", ")}
            </span>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <MediaRow title="Você também pode gostar" items={recommendations} />
        )}
      </div>
    </div>
  );
}

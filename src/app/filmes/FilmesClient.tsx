"use client";

import { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { MediaGrid } from "@/components/media/MediaGrid";
import { GenreChip } from "@/components/ui/GenreChip";
import { EmptyState } from "@/components/feedback/EmptyState";
import { InfiniteScrollTrigger } from "@/components/media/InfiniteScrollTrigger";
import { formatRating, getMediaDetailUrl } from "@/utils/media";
import { MOVIE_GENRES } from "@/config/catalog-filters";
import type { MediaCatalogPage } from "@/providers/metadata/tmdb.provider";

interface FilmesClientProps {
  initialCatalog: MediaCatalogPage;
}

async function fetchCatalogPage(
  genre: string,
  page: number
): Promise<MediaCatalogPage> {
  const params = new URLSearchParams({ type: "movie", genre, sort: "popularity", page: String(page) });
  const response = await fetch(`/api/catalog?${params}`);
  if (!response.ok) throw new Error("Não foi possível carregar o catálogo.");
  return response.json() as Promise<MediaCatalogPage>;
}

export function FilmesClient({
  initialCatalog,
}: FilmesClientProps) {
  const [selectedGenre, setSelectedGenre] = useState("all");

  const catalogQuery = useInfiniteQuery({
    queryKey: ["catalog", "movie", selectedGenre, "popularity"],
    queryFn: ({ pageParam }) => fetchCatalogPage(selectedGenre, pageParam),
    initialPageParam: 1,
    initialData:
      selectedGenre === "all"
        ? { pages: [initialCatalog], pageParams: [1] }
        : undefined,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const featured = initialCatalog.items[0];

  const allMovies = useMemo(() => {
    const combined = catalogQuery.data?.pages.flatMap((page) => page.items) ?? [];
    const seen = new Set<string>();
    return combined.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [catalogQuery.data]);

  const totalResults = catalogQuery.data?.pages[0]?.totalResults ?? initialCatalog.totalResults;
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = catalogQuery;

  return (
    <div className={`flex flex-col gap-10 pb-12 ${featured ? "" : "pt-24 md:pt-28"}`}>
      {/* Featured Banner */}
      {featured && (
        <div className="relative flex min-h-[26rem] w-full items-end overflow-hidden sm:min-h-[30rem] lg:min-h-[32rem]">
          {(featured.backdrop || featured.poster) && (
            <Image
              src={featured.backdrop || featured.poster!}
              alt=""
              fill
              className="object-cover object-[62%_top] sm:object-top"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-cine-bg via-cine-bg/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-cine-bg/95 via-cine-bg/50 to-transparent" />

          <div className="relative w-full pt-28">
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 pb-9 sm:pb-12 w-full">
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-cine-brand">
                  Filme em destaque
                </span>
                <h1 className="break-words text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1 mb-2">
                  {featured.title}
                </h1>
                {featured.overview && (
                  <p className="text-xs sm:text-sm text-cine-text-secondary line-clamp-2 mb-4 leading-relaxed">
                    {featured.overview}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={getMediaDetailUrl(featured)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-cine-brand hover:bg-cine-brand-hover text-white font-semibold text-sm rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Ver detalhes
                  </Link>
                  {featured.rating && (
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-black/40 backdrop-blur-sm border border-cine-border rounded-lg text-xs font-semibold text-white">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                      {formatRating(featured.rating)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Catálogo por gênero */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 w-full flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cine-border pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Todos os filmes
            </h2>
            <p className="text-xs sm:text-sm text-cine-text-secondary mt-0.5">
              {totalResults} títulos encontrados
            </p>
          </div>

        </div>

        {/* Genre Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
          {MOVIE_GENRES.map((genre) => (
            <GenreChip
              key={genre.id}
              label={genre.label}
              active={selectedGenre === genre.id}
              onClick={() => setSelectedGenre(genre.id)}
            />
          ))}
        </div>

        {/* Grid or Empty */}
        {allMovies.length > 0 ? (
          <>
            <MediaGrid items={allMovies} />
            <InfiniteScrollTrigger
              hasMore={hasNextPage}
              isLoading={isFetchingNextPage}
              onLoadMore={fetchNextPage}
              loadingLabel="Carregando mais filmes..."
            />
          </>
        ) : (
          <EmptyState
            message={catalogQuery.isLoading ? "Carregando filmes..." : "Nenhum filme encontrado nesta categoria."}
          />
        )}
      </div>
    </div>
  );
}

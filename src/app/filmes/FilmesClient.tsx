"use client";

import { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Play, Star, SlidersHorizontal } from "lucide-react";
import { MediaGrid } from "@/components/media/MediaGrid";
import { MediaRow } from "@/components/media/MediaRow";
import { GenreChip } from "@/components/ui/GenreChip";
import { EmptyState } from "@/components/feedback/EmptyState";
import { formatRating, getMediaDetailUrl } from "@/utils/media";
import { MOVIE_GENRES, type CatalogSort } from "@/config/catalog-filters";
import type { MediaCatalogPage } from "@/providers/metadata/tmdb.provider";
import type { Media } from "@/types";

interface FilmesClientProps {
  initialCatalog: MediaCatalogPage;
  initialReleases: Media[];
}

type SortOption = CatalogSort;

async function fetchCatalogPage(
  genre: string,
  sort: CatalogSort,
  page: number
): Promise<MediaCatalogPage> {
  const params = new URLSearchParams({ type: "movie", genre, sort, page: String(page) });
  const response = await fetch(`/api/catalog?${params}`);
  if (!response.ok) throw new Error("Não foi possível carregar o catálogo.");
  return response.json() as Promise<MediaCatalogPage>;
}

export function FilmesClient({
  initialCatalog,
  initialReleases,
}: FilmesClientProps) {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("popularity");

  const catalogQuery = useInfiniteQuery({
    queryKey: ["catalog", "movie", selectedGenre, sortBy],
    queryFn: ({ pageParam }) => fetchCatalogPage(selectedGenre, sortBy, pageParam),
    initialPageParam: 1,
    initialData:
      selectedGenre === "all" && sortBy === "popularity"
        ? { pages: [initialCatalog], pageParams: [1] }
        : undefined,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const featured = initialCatalog.items[0] || initialReleases[0];

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

  return (
    <div className="flex flex-col gap-10 pb-12">
      {/* Featured Banner */}
      {featured && (
        <div className="relative h-[26rem] w-full overflow-hidden sm:h-[30rem] lg:h-[min(60vh,36rem)] lg:min-h-[32rem]">
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

          <div className="absolute inset-0 flex items-end">
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 pb-9 sm:pb-12 w-full">
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-cine-brand">
                  Destaque em Filmes
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1 mb-2">
                  {featured.title}
                </h1>
                {featured.overview && (
                  <p className="text-xs sm:text-sm text-cine-text-secondary line-clamp-2 mb-4 leading-relaxed">
                    {featured.overview}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <Link
                    href={getMediaDetailUrl(featured)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-cine-brand hover:bg-cine-brand-hover text-white font-semibold text-sm rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Ver Detalhes
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

      {/* Lançamentos Recentes Row */}
      {initialReleases.length > 0 && (
        <MediaRow title="Lançamentos no Cinema & Streaming" items={initialReleases} />
      )}

      {/* Catálogo Geral com Filtros e Ordenação */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 w-full flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cine-border pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Explorar Catálogo de Filmes
            </h2>
            <p className="text-xs sm:text-sm text-cine-text-secondary mt-0.5">
              {totalResults} títulos encontrados
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-cine-text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-cine-surface border border-cine-border text-white text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cine-brand"
            >
              <option value="popularity">Mais Populares</option>
              <option value="rating">Melhor Avaliados</option>
              <option value="year">Ano de Lançamento</option>
            </select>
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
            {catalogQuery.hasNextPage && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={() => catalogQuery.fetchNextPage()}
                  disabled={catalogQuery.isFetchingNextPage}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-cine-surface hover:bg-cine-surface-elevated text-white font-medium text-sm rounded-xl border border-cine-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand disabled:cursor-wait disabled:opacity-60"
                >
                  {catalogQuery.isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />}
                  {catalogQuery.isFetchingNextPage ? "Carregando..." : "Carregar mais filmes"}
                </button>
              </div>
            )}
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

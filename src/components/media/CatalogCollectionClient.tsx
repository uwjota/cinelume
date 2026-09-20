"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, Play, SlidersHorizontal, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/feedback/EmptyState";
import { GenreChip } from "@/components/ui/GenreChip";
import { formatRating, getMediaDetailUrl } from "@/utils/media";
import {
  ANIME_GENRES,
  DORAMA_GENRES,
  type CatalogMediaType,
  type CatalogSort,
} from "@/config/catalog-filters";
import type { MediaCatalogPage } from "@/providers/metadata/tmdb.provider";
import { FavoriteButton } from "./FavoriteButton";
import { MediaGrid } from "./MediaGrid";

type SortOption = CatalogSort;

interface CatalogCollectionClientProps {
  title: string;
  description: string;
  mediaType: Extract<CatalogMediaType, "anime" | "dorama">;
  initialCatalog: MediaCatalogPage;
}

async function fetchCatalogPage(
  mediaType: Extract<CatalogMediaType, "anime" | "dorama">,
  genre: string,
  sort: CatalogSort,
  page: number
): Promise<MediaCatalogPage> {
  const params = new URLSearchParams({
    type: mediaType,
    genre,
    sort,
    page: String(page),
  });
  const response = await fetch(`/api/catalog?${params}`);
  if (!response.ok) throw new Error("Não foi possível carregar o catálogo.");
  return response.json() as Promise<MediaCatalogPage>;
}

export function CatalogCollectionClient({
  title,
  description,
  mediaType,
  initialCatalog,
}: CatalogCollectionClientProps) {
  const [genre, setGenre] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const genres = mediaType === "anime" ? ANIME_GENRES : DORAMA_GENRES;
  const catalogQuery = useInfiniteQuery({
    queryKey: ["catalog", mediaType, genre, sortBy],
    queryFn: ({ pageParam }) =>
      fetchCatalogPage(mediaType, genre, sortBy, pageParam),
    initialPageParam: 1,
    initialData:
      genre === "all" && sortBy === "popularity"
        ? { pages: [initialCatalog], pageParams: [1] }
        : undefined,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
  const featured = initialCatalog.items[0];
  const items = useMemo(() => {
    const seen = new Set<string>();
    return (catalogQuery.data?.pages.flatMap((page) => page.items) ?? []).filter(
      (item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      }
    );
  }, [catalogQuery.data]);
  const totalResults =
    catalogQuery.data?.pages[0]?.totalResults ?? initialCatalog.totalResults;

  return (
    <div className="flex flex-col gap-10 pb-16">
      {featured && (
        <section className="relative h-[min(66svh,34rem)] min-h-[26rem] overflow-hidden sm:h-[min(60svh,36rem)] lg:h-[min(66vh,40rem)]">
          {(featured.backdrop || featured.poster) && (
          <Image src={featured.backdrop || featured.poster!} alt="" fill priority sizes="100vw" className="object-cover object-[62%_top] sm:object-top" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-cine-bg via-cine-bg/70 to-cine-bg/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-cine-bg via-transparent to-transparent" />
          <div className="absolute inset-0 mx-auto flex max-w-[1440px] items-end px-4 pb-10 md:px-6 lg:px-8 lg:pb-14">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cine-brand">Destaque em {title}</span>
              <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">{featured.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-cine-text-secondary">
                {featured.year && <span>{featured.year}</span>}
                {featured.rating && <span className="inline-flex items-center gap-1 text-white"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{formatRating(featured.rating)}</span>}
                {featured.genres && <span className="hidden sm:inline">{featured.genres.slice(0, 3).join(" • ")}</span>}
              </div>
              {featured.overview && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-cine-text-secondary sm:line-clamp-3">{featured.overview}</p>}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={getMediaDetailUrl(featured)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cine-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cine-brand-hover">
                  <Play className="h-4 w-4 fill-current" /> Ver detalhes
                </Link>
                <FavoriteButton media={featured} />
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 md:px-6 lg:px-8">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">{title}</h2>
          <p className="mt-1 text-sm text-cine-text-secondary sm:text-base">{description}</p>
          <p className="mt-1 text-xs text-cine-text-muted">
            {totalResults} títulos encontrados
          </p>
        </div>

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide">
            {genres.map((item) => (
              <GenreChip
                key={item.id}
                label={item.label}
                active={genre === item.id}
                onClick={() => setGenre(item.id)}
              />
            ))}
          </div>
          <label className="flex min-h-11 w-fit items-center gap-2 rounded-lg border border-cine-border bg-cine-surface px-3 text-sm text-cine-text-secondary">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Ordenar catálogo</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} className="bg-transparent py-2 text-sm text-white outline-none">
              <option value="popularity">Mais populares</option>
              <option value="rating">Melhor avaliados</option>
              <option value="year">Mais recentes</option>
              <option value="title">Ordem alfabética</option>
            </select>
          </label>
        </div>

        {items.length > 0 ? (
          <>
            <MediaGrid items={items} />
            {catalogQuery.hasNextPage && (
              <button
                type="button"
                onClick={() => catalogQuery.fetchNextPage()}
                disabled={catalogQuery.isFetchingNextPage}
                className="mx-auto inline-flex min-h-11 items-center gap-2 rounded-lg border border-cine-border bg-cine-surface px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cine-surface-elevated disabled:cursor-wait disabled:opacity-60"
              >
                {catalogQuery.isFetchingNextPage && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {catalogQuery.isFetchingNextPage ? "Carregando..." : "Carregar mais"}
              </button>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-cine-border bg-cine-surface">
            <EmptyState
              message={
                catalogQuery.isLoading
                  ? "Carregando títulos..."
                  : "Nenhum título encontrado nesta categoria."
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

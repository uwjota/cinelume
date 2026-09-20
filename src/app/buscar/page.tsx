"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Clock,
  Trash2,
  Tv,
  Trophy,
  Film,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useUnifiedSearch } from "@/hooks/useSearch";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { MediaCard, MediaCardSkeleton } from "@/components/media/MediaCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { GenreChip } from "@/components/ui/GenreChip";
import type { LiveChannel, LiveEvent, Media } from "@/types";

const SEARCH_TABS = [
  "Todos",
  "Filmes",
  "Séries",
  "Animes",
  "Doramas",
  "TV",
  "Esportes",
] as const;

type SearchTab = typeof SEARCH_TABS[number];

export default function BuscarPage() {
  const [inputQuery, setInputQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("Todos");
  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useRecentSearches();

  const {
    data,
    isLoading,
    isDebouncing,
    isError,
    refetch,
    debouncedQuery,
    isIdle,
    isEmpty,
    hasMoreMedia,
    loadMoreMedia,
    isLoadingMoreMedia,
  } = useUnifiedSearch(inputQuery);

  // Save to recents whenever a search successfully resolves
  useEffect(() => {
    if (debouncedQuery.length >= 2 && data) {
      addRecentSearch(debouncedQuery);
    }
  }, [debouncedQuery, data, addRecentSearch]);

  const mediaItems = data?.media || [];
  const channelItems = data?.channels || [];
  const eventItems = data?.events || [];

  // Filter items according to active tab
  const filteredMedia = mediaItems.filter((m) => {
    if (activeTab === "Todos") return true;
    if (activeTab === "Filmes") return m.type === "movie";
    if (activeTab === "Séries") return m.type === "series";
    if (activeTab === "Animes") return m.type === "anime";
    if (activeTab === "Doramas") return m.type === "dorama";
    return false;
  });

  const showChannels =
    (activeTab === "Todos" || activeTab === "TV") && channelItems.length > 0;
  const showEvents =
    (activeTab === "Todos" || activeTab === "Esportes") && eventItems.length > 0;

  const totalResults =
    filteredMedia.length +
    (showChannels ? channelItems.length : 0) +
    (showEvents ? eventItems.length : 0);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 pt-20 md:pt-24 flex flex-col gap-6 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Buscar
        </h1>
        <p className="text-sm sm:text-base text-cine-text-secondary mt-1">
          Encontre filmes, séries, animes, doramas, canais e transmissões esportivas.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cine-text-muted" />
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Digite o título, gênero, canal ou time..."
          className="w-full bg-cine-surface border border-cine-border rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-cine-text-muted focus:outline-none focus:border-cine-brand focus:ring-1 focus:ring-cine-brand text-sm sm:text-base transition-colors"
          autoFocus
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {isDebouncing && (
            <Loader2 className="w-4 h-4 text-cine-brand animate-spin" />
          )}
          {inputQuery && (
            <button
              onClick={() => setInputQuery("")}
              className="p-1 text-cine-text-muted hover:text-white transition-colors rounded"
              aria-label="Limpar busca"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Tabs (Shown when there is a search term) */}
      {!isIdle && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
          {SEARCH_TABS.map((tab) => (
            <GenreChip
              key={tab}
              label={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <MediaCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <ErrorState
          message="Erro ao realizar a busca. Verifique sua conexão e tente novamente."
          onRetry={() => refetch()}
        />
      )}

      {/* Idle State: Show Recent Searches & Trending Suggestions */}
      {isIdle && (
        <div className="flex flex-col gap-8 max-w-2xl">
          {recentSearches.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cine-text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  Pesquisas Recentes
                </span>
                <button
                  onClick={() => clearRecentSearches()}
                  className="text-xs text-cine-text-muted hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Limpar
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <div
                    key={item.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cine-surface border border-cine-border rounded-lg text-sm text-cine-text-secondary hover:text-white hover:border-cine-text-muted transition-colors group"
                  >
                    <button
                      onClick={() => setInputQuery(item.query)}
                      className="focus:outline-none"
                    >
                      {item.query}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(item.id);
                      }}
                      className="text-cine-text-muted hover:text-red-400 p-0.5 rounded"
                      aria-label={`Remover ${item.query}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cine-text-muted">
              <Sparkles className="w-3.5 h-3.5 text-cine-brand" />
              Sugestões Rápidas
            </span>
            <div className="flex flex-wrap gap-2">
              {["Venom", "Gladiador", "Demon Slayer", "Game of Thrones", "One Piece", "The Boys"].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setInputQuery(term)}
                    className="px-3 py-1.5 bg-cine-surface hover:bg-cine-surface-elevated border border-cine-border text-xs sm:text-sm text-cine-text-secondary hover:text-white rounded-lg transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success State with Results */}
      {!isIdle && !isLoading && !isError && (
        <div className="flex flex-col gap-8">
          {totalResults > 0 && (
            <span className="text-sm text-cine-text-muted">
              {totalResults} resultado(s) encontrado(s) para &ldquo;
              <strong className="text-white font-medium">{debouncedQuery}</strong>
              &rdquo;
            </span>
          )}

          {/* TV Channels Section */}
          {showChannels && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-cine-border pb-2">
                <Tv className="w-4 h-4 text-cine-brand" />
                <h2 className="text-base font-bold text-white">
                  Canais de TV ({channelItems.length})
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {channelItems.map((ch: LiveChannel) => (
                  <Link
                    key={ch.id}
                    href={`/tv/${ch.id}`}
                    className="flex flex-col items-center text-center p-3 rounded-xl bg-cine-surface border border-cine-border hover:bg-cine-surface-elevated transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center mb-2 font-bold text-white text-xs border border-cine-border/50">
                      {ch.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={ch.logo}
                          alt={ch.name}
                          className="max-h-8 max-w-[40px] object-contain"
                        />
                      ) : (
                        ch.name.slice(0, 3)
                      )}
                    </div>
                    <span className="text-xs font-semibold text-white group-hover:text-cine-brand transition-colors line-clamp-1">
                      {ch.name}
                    </span>
                    {ch.nowPlaying && (
                      <span className="text-[10px] text-cine-text-muted mt-0.5 line-clamp-1">
                        {ch.nowPlaying}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Sports Events Section */}
          {showEvents && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-cine-border pb-2">
                <Trophy className="w-4 h-4 text-cine-brand" />
                <h2 className="text-base font-bold text-white">
                  Eventos Esportivos ({eventItems.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {eventItems.map((ev: LiveEvent) => (
                  <Link
                    key={ev.id}
                    href={`/esportes/${ev.id}`}
                    className="p-4 rounded-xl bg-cine-surface border border-cine-border hover:bg-cine-surface-elevated transition-colors flex flex-col gap-2 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-cine-brand font-semibold uppercase">
                        {ev.sport || "Esporte"}
                      </span>
                      {ev.status === "live" ? (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 font-bold text-[10px] rounded animate-pulse">
                          AO VIVO
                        </span>
                      ) : (
                        <span className="text-cine-text-muted">
                          {ev.startTime ? new Date(ev.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Em breve"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-cine-brand transition-colors">
                      {ev.title}
                    </h3>
                    {ev.competition && (
                      <span className="text-xs text-cine-text-muted">
                        {ev.competition}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Movies, Series, Animes, Doramas Section */}
          {filteredMedia.length > 0 && (
            <div className="flex flex-col gap-3">
              {(showChannels || showEvents) && (
                <div className="flex items-center gap-2 border-b border-cine-border pb-2">
                  <Film className="w-4 h-4 text-cine-brand" />
                  <h2 className="text-base font-bold text-white">
                    Catálogo ({filteredMedia.length})
                  </h2>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
                {filteredMedia.map((media: Media) => (
                  <MediaCard key={media.id} media={media} showType />
                ))}
              </div>
              {hasMoreMedia && activeTab !== "TV" && activeTab !== "Esportes" && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => loadMoreMedia()}
                    disabled={isLoadingMoreMedia}
                    className="inline-flex items-center gap-2 rounded-xl border border-cine-border bg-cine-surface px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cine-surface-elevated disabled:cursor-wait disabled:opacity-60"
                  >
                    {isLoadingMoreMedia && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isLoadingMoreMedia ? "Carregando..." : "Carregar mais resultados"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty State when no results in this category */}
          {isEmpty && (
            <EmptyState
              message={`Nenhum resultado encontrado para "${debouncedQuery}". Tente outros termos ou navegue pelas categorias.`}
            />
          )}
        </div>
      )}
    </div>
  );
}

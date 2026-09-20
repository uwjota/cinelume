"use client";

import { RefreshCw, Search, Tv, X } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { ChannelCard, ChannelCardSkeleton } from "@/components/tv";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { GenreChip } from "@/components/ui/GenreChip";
import { useChannelCategories, useChannels } from "@/hooks/useLiveTv";

export default function TvPage() {
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase("pt-BR"));
  const channelsQuery = useChannels(category === "Todos" ? undefined : category);
  const categoriesQuery = useChannelCategories();
  const categories = useMemo(
    () => ["Todos", ...new Set((categoriesQuery.data ?? []).filter((item) => item !== "Todos"))],
    [categoriesQuery.data]
  );
  const filteredChannels = useMemo(() => {
    const channels = channelsQuery.data ?? [];
    if (!deferredQuery) return channels;
    return channels.filter((channel) =>
      [channel.name, channel.category, channel.nowPlaying].some((value) =>
        value?.toLocaleLowerCase("pt-BR").includes(deferredQuery)
      )
    );
  }, [channelsQuery.data, deferredQuery]);
  const highlights = filteredChannels.filter((channel) => channel.nowPlaying).slice(0, 4);

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 pb-16 pt-20 md:px-6 md:pt-24 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cine-brand">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cine-brand" />
            Transmissões em tempo real
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">TV ao Vivo</h1>
          <p className="mt-1 text-sm text-cine-text-secondary sm:text-base">
            Canais lineares e programação atual em um só lugar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => channelsQuery.refetch()}
          disabled={channelsQuery.isFetching}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-cine-border bg-cine-surface px-4 py-2 text-sm font-medium text-cine-text-secondary transition-colors hover:text-white disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${channelsQuery.isFetching ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cine-text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar canal ou programa no ar..."
          className="w-full rounded-xl border border-cine-border bg-cine-surface py-3.5 pl-12 pr-12 text-sm text-white outline-none transition-colors placeholder:text-cine-text-muted focus:border-cine-brand focus:ring-1 focus:ring-cine-brand"
          aria-label="Buscar canais"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-cine-text-muted hover:text-white"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide" aria-label="Categorias de canais">
        {categories.map((item) => (
          <GenreChip key={item} label={item} active={category === item} onClick={() => setCategory(item)} />
        ))}
      </div>

      {channelsQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => <ChannelCardSkeleton key={index} />)}
        </div>
      ) : channelsQuery.isError ? (
        <ErrorState message="Não foi possível carregar os canais ao vivo." onRetry={() => channelsQuery.refetch()} />
      ) : filteredChannels.length === 0 ? (
        <div className="rounded-xl border border-cine-border bg-cine-surface">
          <EmptyState icon={<Tv className="mb-4 h-12 w-12 text-cine-brand" />} message="Nenhum canal encontrado para esta seleção." />
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {highlights.length > 0 && !query && category === "Todos" && (
            <section className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">No ar agora</h2>
                <p className="text-sm text-cine-text-muted">Destaques com programação disponível.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {highlights.map((channel) => <ChannelCard key={`highlight-${channel.id}`} channel={channel} />)}
              </div>
            </section>
          )}

          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{category === "Todos" ? "Todos os canais" : category}</h2>
                <p className="text-sm text-cine-text-muted">{filteredChannels.length} canal(is) disponível(is)</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredChannels.map((channel) => <ChannelCard key={channel.id} channel={channel} />)}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

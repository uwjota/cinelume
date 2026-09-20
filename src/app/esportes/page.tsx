"use client";

import { Radio, RefreshCw, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { EventCard, EventCardSkeleton } from "@/components/sports";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { GenreChip } from "@/components/ui/GenreChip";
import { useEventCategories, useEvents } from "@/hooks/useEvents";
import { useChannels } from "@/hooks/useLiveTv";
import { ChannelCard, ChannelCardSkeleton } from "@/components/tv";
import type { LiveChannel } from "@/types";

const DEFAULT_SPORTS = [
  "Futebol",
  "Todos",
  "Basquete",
  "MMA",
  "Vôlei",
  "Beisebol",
  "Hóquei",
  "Rugby",
  "Golfe",
  "Outros",
];
const SPORT_CHANNEL_KEYWORDS: Record<string, string[]> = {
  Futebol: ["futebol", "premiere", "canal goat", "cazé", "sportv"],
  Basquete: ["basquete", "basket", "nba"],
  MMA: ["mma", "ufc", "combate", "fight"],
  "Vôlei": ["vôlei", "volei", "volleyball"],
  Beisebol: ["beisebol", "baseball", "mlb"],
  "Hóquei": ["hóquei", "hoquei", "hockey", "nhl"],
  Rugby: ["rugby"],
  Golfe: ["golfe", "golf"],
};
const FEATURED_CHANNEL_IDS = [
  "bandsports",
  "combate",
  "espn",
  "espn2",
  "espn3",
  "espn4",
  "nbatv",
  "sportv",
  "dazn",
  "ufcfightpass",
];
const STATUS_FILTERS = [
  { label: "Todos", value: undefined },
  { label: "Ao vivo", value: "live" },
  { label: "Próximos", value: "upcoming" },
  { label: "Encerrados", value: "finished" },
] as const;

export default function EsportesPage() {
  const [sport, setSport] = useState("Futebol");
  const [status, setStatus] = useState<string | undefined>();
  const eventsQuery = useEvents(sport === "Todos" ? undefined : sport, status);
  const sportsChannelsQuery = useChannels("Esportes");
  const categoriesQuery = useEventCategories();
  const sports = useMemo(() => {
    const providerCategories = categoriesQuery.data ?? [];
    return [...new Set([...DEFAULT_SPORTS, ...providerCategories])];
  }, [categoriesQuery.data]);
  const events = eventsQuery.data ?? [];
  const sportsChannels = useMemo(() => {
    const channels = sportsChannelsQuery.data ?? [];
    if (sport === "Todos" || sport === "Outros") {
      const featured = FEATURED_CHANNEL_IDS
        .map((id) => channels.find((channel) => channel.id === id))
        .filter((channel): channel is LiveChannel => Boolean(channel));
      return featured.slice(0, 10);
    }

    const keywords = SPORT_CHANNEL_KEYWORDS[sport] ?? [];
    return channels
      .filter((channel) => {
        const searchable = `${channel.name} ${channel.nowPlaying ?? ""}`.toLocaleLowerCase("pt-BR");
        return keywords.some((keyword) => searchable.includes(keyword));
      })
      .slice(0, 12);
  }, [sport, sportsChannelsQuery.data]);
  const liveCount = events.filter((event) => event.status === "live").length;

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 pb-16 pt-20 md:px-6 md:pt-24 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cine-brand">
            <Trophy className="h-4 w-4" /> Agenda esportiva
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">Eventos Esportivos</h1>
          <p className="mt-1 text-sm text-cine-text-secondary sm:text-base">Jogos, lutas e competições organizados por status e modalidade.</p>
        </div>
        <button
          type="button"
          onClick={() => eventsQuery.refetch()}
          disabled={eventsQuery.isFetching}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-cine-border bg-cine-surface px-4 py-2 text-sm font-medium text-cine-text-secondary transition-colors hover:text-white disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${eventsQuery.isFetching ? "animate-spin" : ""}`} /> Atualizar
        </button>
      </div>

      {liveCount > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600"><Radio className="h-4 w-4" /></span>
          <span><strong>{liveCount}</strong> evento(s) ao vivo nesta seleção.</span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide" aria-label="Modalidades">
          {sports.map((item) => <GenreChip key={item} label={item} active={sport === item} onClick={() => setSport(item)} />)}
        </div>
        <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide" aria-label="Status dos eventos">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setStatus(item.value)}
              aria-pressed={status === item.value}
              className={`min-h-10 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                status === item.value
                  ? "border-cine-brand bg-cine-brand/15 text-white"
                  : "border-cine-border bg-cine-surface text-cine-text-secondary hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {eventsQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => <EventCardSkeleton key={index} />)}
        </div>
      ) : eventsQuery.isError ? (
        <ErrorState message="Não foi possível carregar a agenda esportiva." onRetry={() => eventsQuery.refetch()} />
      ) : events.length > 0 ? (
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">{sport === "Todos" ? "Agenda completa" : sport}</h2>
            <p className="text-sm text-cine-text-muted">Ao vivo primeiro, seguidos pelos próximos eventos.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </section>
      ) : (
        <div className="rounded-xl border border-cine-border bg-cine-surface">
          <EmptyState
            icon={<Trophy className="mb-4 h-12 w-12 text-cine-brand" />}
            message={`O provider não possui eventos de ${sport === "Todos" ? "outras modalidades" : sport} nesta agenda. Confira os canais esportivos disponíveis abaixo.`}
          />
        </div>
      )}

      <section className="flex flex-col gap-4 border-t border-cine-border pt-8">
        <div>
          <h2 className="text-xl font-bold text-white">Canais esportivos ao vivo</h2>
          <p className="text-sm text-cine-text-muted">
            {sport === "Todos" || sport === "Outros"
              ? "Uma seleção com diferentes modalidades e competições."
              : `Canais com programação relacionada a ${sport}.`}
          </p>
        </div>

        {sportsChannelsQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => <ChannelCardSkeleton key={index} />)}
          </div>
        ) : sportsChannels.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sportsChannels.map((channel) => <ChannelCard key={channel.id} channel={channel} />)}
          </div>
        ) : (
          <div className="rounded-xl border border-cine-border bg-cine-surface">
            <EmptyState message={`Nenhum canal relacionado a ${sport} está disponível agora.`} />
          </div>
        )}
      </section>
    </div>
  );
}

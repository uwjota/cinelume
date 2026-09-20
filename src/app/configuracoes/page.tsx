"use client";

import Link from "next/link";
import {
  Clock3,
  History,
  PlayCircle,
  Server,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { useHistory } from "@/hooks/useHistory";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useSettings } from "@/hooks/useSettings";
import { useWatchProgress } from "@/hooks/useWatchProgress";
import { playerRegistry } from "@/services/players/player.service";

export default function ConfiguracoesPage() {
  const [feedback, setFeedback] = useState("");
  const {
    autoplayNext,
    setAutoplayNext,
    defaultPlayerServer,
    setDefaultPlayerServer,
    clearAllData,
  } = useSettings();
  const playerServers = playerRegistry.getAll();
  const { clearFavorites } = useFavorites();
  const { history, removeHistoryItem, clearHistory } = useHistory();
  const { clearProgress } = useWatchProgress();
  const { clearRecentSearches } = useRecentSearches();

  const confirmAction = (message: string, action: () => void, result: string) => {
    if (!window.confirm(message)) return;
    action();
    setFeedback(result);
  };

  const clearPlaybackHistory = () => {
    clearHistory();
    clearProgress();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 pt-24 md:pt-28 flex flex-col gap-10 pb-20">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-cine-brand">Preferências</span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Configurações
        </h1>
        <p className="text-sm sm:text-base text-cine-text-secondary mt-1">
          Personalize sua experiência no Cinelume neste dispositivo.
        </p>
      </div>

      {feedback && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400"
        >
          {feedback}
          <button
            type="button"
            onClick={() => setFeedback("")}
            aria-label="Fechar aviso"
            className="rounded p-1 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-8">
        <section className="rounded-2xl border border-cine-border bg-cine-surface p-5 sm:p-6">
          <div className="mb-5 border-b border-cine-border pb-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-cine-text-secondary">Reprodução</h2>
          </div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cine-brand/20 bg-cine-brand/10">
              <PlayCircle className="w-5 h-5 text-cine-brand" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-white">Autoplay do próximo episódio</h2>
              <p className="text-xs sm:text-sm text-cine-text-secondary">
                Mantém sua preferência pronta para players que informem o término do episódio.
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autoplayNext}
            onClick={() => setAutoplayNext(!autoplayNext)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand ${
              autoplayNext ? "bg-cine-brand" : "bg-cine-surface-elevated"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                autoplayNext ? "translate-x-6" : "translate-x-1"
              }`}
            />
            <span className="sr-only">
              {autoplayNext ? "Desativar autoplay" : "Ativar autoplay"}
            </span>
          </button>
          </div>
          <div className="flex flex-col gap-3 border-t border-cine-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cine-brand/20 bg-cine-brand/10">
                <Server className="h-5 w-5 text-cine-brand" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-white">Servidor padrão</h2>
                <p className="text-xs sm:text-sm text-cine-text-secondary">
                  Usado automaticamente ao abrir filmes e episódios.
                </p>
              </div>
            </div>
            <label className="sr-only" htmlFor="default-player-server">
              Servidor padrão de reprodução
            </label>
            <select
              id="default-player-server"
              value={defaultPlayerServer}
              onChange={(event) => setDefaultPlayerServer(event.target.value)}
              className="min-h-11 rounded-lg border border-cine-border bg-cine-surface-elevated px-3 text-sm font-medium text-white outline-none transition-colors focus:border-cine-brand focus:ring-1 focus:ring-cine-brand"
            >
              {playerServers.map((server) => (
                <option key={server.id} value={server.id}>
                  {server.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="rounded-2xl border border-cine-border bg-cine-surface p-5 sm:p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
              <Trash2 className="w-5 h-5 text-red-400" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-white">Dados neste dispositivo</h2>
              <p className="mt-0.5 text-xs text-cine-text-muted">Você controla o que permanece salvo.</p>
            </div>
          </div>
          <p className="text-sm text-cine-text-secondary">
            Favoritos, histórico, progresso, pesquisas e preferências ficam somente no IndexedDB deste navegador.
          </p>
          <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                confirmAction(
                  "Limpar o histórico e todo o progresso de reprodução?",
                  clearPlaybackHistory,
                  "Histórico e progresso removidos."
                )
              }
              className="min-h-11 px-3 py-2 text-left text-sm font-medium text-cine-text-secondary hover:text-white bg-cine-surface-elevated border border-cine-border rounded-lg transition-colors"
            >
              Limpar histórico
            </button>
            <button
              type="button"
              onClick={() =>
                confirmAction(
                  "Remover todos os favoritos da Minha Lista?",
                  () => clearFavorites(),
                  "Favoritos removidos."
                )
              }
              className="min-h-11 px-3 py-2 text-left text-sm font-medium text-cine-text-secondary hover:text-white bg-cine-surface-elevated border border-cine-border rounded-lg transition-colors"
            >
              Limpar favoritos
            </button>
            <button
              type="button"
              onClick={() =>
                confirmAction(
                  "Limpar todas as pesquisas recentes?",
                  () => clearRecentSearches(),
                  "Pesquisas recentes removidas."
                )
              }
              className="min-h-11 px-3 py-2 text-left text-sm font-medium text-cine-text-secondary hover:text-white bg-cine-surface-elevated border border-cine-border rounded-lg transition-colors"
            >
              Limpar pesquisas
            </button>
            <button
              type="button"
              onClick={() =>
                confirmAction(
                  "Apagar todos os dados locais do Cinelume neste navegador? Esta ação não pode ser desfeita.",
                  () => clearAllData(),
                  "Todos os dados locais do Cinelume foram apagados."
                )
              }
              className="min-h-11 px-3 py-2 text-left text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg transition-colors"
            >
              Apagar todos os dados
            </button>
          </div>
        </section>

        {history.length > 0 && (
          <section className="rounded-2xl border border-cine-border bg-cine-surface p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-cine-brand" />
              <div>
                <h2 className="text-base font-semibold text-white">Histórico recente</h2>
                <p className="text-xs text-cine-text-muted">As últimas sessões iniciadas neste dispositivo.</p>
              </div>
            </div>
            <div className="divide-y divide-cine-border">
              {history.slice(0, 8).map((item) => {
                const href =
                  item.season !== undefined && item.episode !== undefined
                    ? `/assistir/serie/${item.mediaId}?season=${item.season}&episode=${item.episode}&type=${item.mediaType}`
                    : `/assistir/filme/${item.mediaId}`;

                return (
                  <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Clock3 className="h-4 w-4 shrink-0 text-cine-text-muted" />
                    <Link href={href} className="min-w-0 flex-1 hover:text-cine-brand">
                      <span className="block truncate text-sm font-medium text-white">{item.title}</span>
                      <span className="block text-xs text-cine-text-muted">
                        {item.season && item.episode
                          ? `Temporada ${item.season}, episódio ${item.episode} • `
                          : ""}
                        {new Date(item.watchedAt).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </Link>
                    {item.id !== undefined && (
                      <button
                        type="button"
                        onClick={() => removeHistoryItem(item.id as number)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-cine-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                        aria-label={`Remover ${item.title} do histórico`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

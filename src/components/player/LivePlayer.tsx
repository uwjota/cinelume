"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { PlayerIframe } from "./PlayerIframe";
import { ServerSelector } from "./ServerSelector";
import { playerRegistry } from "@/services/players/player.service";

export interface LiveSource {
  id: string;
  url: string;
  quality?: string;
}

interface LivePlayerProps {
  title: string;
  sources: LiveSource[];
}

export function LivePlayer({ title, sources }: LivePlayerProps) {
  const allowedSources = useMemo(
    () => sources.filter((source) => playerRegistry.isUrlAllowed(source.url)),
    [sources]
  );
  const [activeId, setActiveId] = useState(allowedSources[0]?.id ?? "");
  const [loading, setLoading] = useState(true);
  const activeSource =
    allowedSources.find((source) => source.id === activeId) ?? allowedSources[0];

  useEffect(() => {
    if (!allowedSources.some((source) => source.id === activeId)) {
      setActiveId(allowedSources[0]?.id ?? "");
      setLoading(true);
    }
  }, [activeId, allowedSources]);

  const selectSource = (id: string) => {
    if (id === activeId) return;
    setActiveId(id);
    setLoading(true);
  };

  if (!activeSource) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-cine-border bg-black p-6 text-center">
        <AlertTriangle className="mb-3 h-10 w-10 text-cine-brand" />
        <h2 className="font-bold text-white">Transmissão indisponível</h2>
        <p className="mt-1 max-w-md text-sm text-cine-text-secondary">
          Nenhuma fonte autorizada está disponível para este conteúdo no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="truncate text-sm font-semibold text-white">{title}</p>
        <ServerSelector
          servers={allowedSources.map((source, index) => ({
            id: source.id,
            label: `Servidor ${index + 1}${source.quality ? ` • ${source.quality}` : ""}`,
          }))}
          activeServerId={activeSource.id}
          onSelectServer={selectSource}
        />
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-cine-border bg-black shadow-2xl shadow-black/70">
        {loading && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/85"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="mb-3 h-9 w-9 animate-spin text-cine-brand" />
            <span className="text-sm font-medium text-white">Carregando transmissão...</span>
          </div>
        )}

        <PlayerIframe
          key={activeSource.id}
          url={activeSource.url}
          title={title}
          onLoad={() => setLoading(false)}
          sandboxed={false}
        />
      </div>
    </div>
  );
}

"use client";

import { Server, Check } from "lucide-react";

export interface ServerOption {
  id: string;
  label: string;
}

interface ServerSelectorProps {
  servers: ServerOption[];
  activeServerId: string;
  onSelectServer: (serverId: string) => void;
}

export function ServerSelector({
  servers,
  activeServerId,
  onSelectServer,
}: ServerSelectorProps) {
  if (servers.length <= 1) return null;

  return (
    <div className="flex min-w-0 max-w-full items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-xs text-cine-text-muted mr-1">
        <Server className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Servidor:</span>
      </div>
      <div className="flex max-w-full flex-wrap items-center gap-1.5 p-1 bg-cine-surface border border-cine-border rounded-xl">
        {servers.map((server) => {
          const isActive = server.id === activeServerId;
          return (
            <button
              key={server.id}
              onClick={() => onSelectServer(server.id)}
              className={`flex min-h-10 min-w-0 max-w-full items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand ${
                isActive
                  ? "bg-cine-brand text-white shadow-md shadow-cine-brand/30"
                  : "text-cine-text-secondary hover:text-white hover:bg-white/5"
              }`}
              aria-pressed={isActive}
            >
              {isActive && <Check className="w-3 h-3 shrink-0 stroke-[3]" />}
              <span className="break-words text-left">{server.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

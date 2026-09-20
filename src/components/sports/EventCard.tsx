"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarClock, Play, Trophy } from "lucide-react";
import type { LiveEvent } from "@/types";

const statusContent = {
  live: { label: "AO VIVO", className: "bg-red-600 text-white" },
  upcoming: { label: "EM BREVE", className: "bg-amber-500/15 text-amber-400 border border-amber-500/25" },
  finished: { label: "ENCERRADO", className: "bg-white/5 text-cine-text-muted border border-white/10" },
} as const;

function parseProviderDate(value: string): Date {
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(normalized);
  return new Date(hasTimezone ? normalized : `${normalized}-03:00`);
}

function formatEventDate(value?: string): string {
  if (!value) return "Horário a confirmar";
  const date = parseProviderDate(value);
  if (Number.isNaN(date.getTime())) return "Horário a confirmar";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

function Team({ name, logo }: { name: string; logo?: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/30 p-2">
        {logo ? (
          <Image src={logo} alt="" fill sizes="56px" className="object-contain p-2" unoptimized />
        ) : (
          <Trophy className="h-6 w-6 text-cine-text-muted" />
        )}
      </div>
      <span className="line-clamp-2 text-xs font-semibold text-white">{name}</span>
    </div>
  );
}

export function EventCard({ event }: { event: LiveEvent }) {
  const status = statusContent[event.status];
  const hasVersus = Boolean(event.homeTeam && event.awayTeam);

  return (
    <Link
      href={`/esportes/${event.id}`}
      className="group flex min-h-64 flex-col overflow-hidden rounded-xl border border-cine-border bg-cine-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-cine-text-muted hover:bg-cine-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand"
    >
      <div className="flex items-center justify-between gap-3 border-b border-cine-border px-4 py-3">
        <span className="truncate text-[11px] font-semibold uppercase tracking-wide text-cine-brand">
          {event.sport || "Esporte"}
        </span>
        <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4 p-4">
        {hasVersus ? (
          <div className="flex items-center gap-3">
            <Team name={event.homeTeam?.name ?? "Equipe 1"} logo={event.homeTeam?.logo} />
            <span className="text-xs font-black text-cine-text-muted">VS</span>
            <Team name={event.awayTeam?.name ?? "Equipe 2"} logo={event.awayTeam?.logo} />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cine-brand/10 text-cine-brand">
              <Trophy className="h-6 w-6" />
            </div>
            <h2 className="line-clamp-3 text-base font-bold leading-snug text-white">{event.title}</h2>
          </div>
        )}

        {hasVersus && (
          <h2 className="line-clamp-2 text-center text-sm font-semibold text-white">{event.title}</h2>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-cine-border pt-3">
          <div className="min-w-0">
            {event.competition && (
              <p className="truncate text-xs font-medium text-cine-text-secondary">{event.competition}</p>
            )}
            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-cine-text-muted">
              <CalendarClock className="h-3.5 w-3.5" />
              {formatEventDate(event.startTime)}
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cine-brand text-white shadow-lg shadow-cine-brand/20">
            <Play className="h-4 w-4 fill-current" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="min-h-64 animate-pulse rounded-xl border border-cine-border bg-cine-surface p-4">
      <div className="mb-8 h-4 w-1/3 rounded bg-cine-surface-elevated" />
      <div className="mx-auto mb-5 h-16 w-4/5 rounded bg-cine-surface-elevated" />
      <div className="mt-auto h-10 rounded bg-cine-surface-elevated" />
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Radio, Tv } from "lucide-react";
import { useState } from "react";
import type { LiveChannel } from "@/types";

export function ChannelCard({ channel }: { channel: LiveChannel }) {
  const [imageFailed, setImageFailed] = useState(false);
  const progress = Math.min(Math.max(channel.progress ?? 0, 0), 100);

  return (
    <Link
      href={`/tv/${channel.id}`}
      className="group flex min-h-48 flex-col overflow-hidden rounded-xl border border-cine-border bg-cine-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-cine-text-muted hover:bg-cine-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand"
      aria-label={`Assistir ${channel.name} ao vivo`}
    >
      <div className="relative flex min-h-28 flex-1 items-center justify-center bg-gradient-to-br from-cine-surface-elevated to-black p-5">
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-red-600/90 px-2 py-1 text-[10px] font-bold tracking-wide text-white">
          <Radio className="h-3 w-3" /> AO VIVO
        </span>
        {channel.category && (
          <span className="absolute right-3 top-3 max-w-[45%] truncate rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[10px] text-cine-text-secondary">
            {channel.category}
          </span>
        )}
        {channel.logo && !imageFailed ? (
          <div className="relative h-16 w-32">
            <Image
              src={channel.logo}
              alt={channel.name}
              fill
              sizes="128px"
              className="object-contain transition-transform duration-200 group-hover:scale-105"
              unoptimized
              onError={() => setImageFailed(true)}
            />
          </div>
        ) : (
          <Tv className="h-12 w-12 text-cine-text-muted" />
        )}
        <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-cine-brand text-white opacity-100 shadow-lg shadow-cine-brand/25 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
          <Play className="h-4 w-4 fill-current" />
        </span>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h2 className="truncate text-sm font-bold text-white">{channel.name}</h2>
        <div className="min-h-8">
          <p className="line-clamp-2 text-xs leading-relaxed text-cine-text-secondary">
            {channel.nowPlaying || "Programação ao vivo"}
          </p>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/10" aria-label={`Progresso: ${progress}%`}>
          <div className="h-full rounded-full bg-cine-brand" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Link>
  );
}

export function ChannelCardSkeleton() {
  return (
    <div className="min-h-48 animate-pulse overflow-hidden rounded-xl border border-cine-border bg-cine-surface">
      <div className="h-28 bg-cine-surface-elevated" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-1/2 rounded bg-cine-surface-elevated" />
        <div className="h-3 w-4/5 rounded bg-cine-surface-elevated" />
        <div className="h-1 rounded bg-cine-surface-elevated" />
      </div>
    </div>
  );
}

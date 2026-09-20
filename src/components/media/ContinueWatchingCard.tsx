"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { WatchProgress } from "@/types";
import { getProgressPercentage } from "@/utils/media";

interface ContinueWatchingCardProps {
  item: WatchProgress;
}

function formatPlaybackTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
    : `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function ContinueWatchingCard({ item }: ContinueWatchingCardProps) {
  const [imgError, setImgError] = useState(false);
  const progress = getProgressPercentage(item.progress, item.duration);

  const watchUrl =
    item.season !== undefined && item.episode !== undefined
      ? `/assistir/serie/${item.mediaId}?season=${item.season}&episode=${item.episode}&type=${item.mediaType}`
      : `/assistir/filme/${item.mediaId}`;
  const savedTime = formatPlaybackTime(item.progress);

  return (
    <Link
      href={watchUrl}
      className="group relative flex flex-col gap-2 min-w-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand focus-visible:ring-offset-2 focus-visible:ring-offset-cine-bg"
      aria-label={`Continuar assistindo ${item.title}${
        item.season !== undefined && item.episode !== undefined
          ? `, temporada ${item.season}, episódio ${item.episode}`
          : ""
      }, ponto salvo em ${savedTime}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-cine-surface border border-cine-border/50">
        {item.poster && !imgError ? (
          <Image
            src={item.poster}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 300px"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-cine-text-muted">
            <span className="text-xs text-center px-2">{item.title}</span>
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 md:transition-opacity duration-200">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-cine-brand transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Info */}
      <div className="px-0.5">
        <h3 className="text-sm font-medium text-white truncate">
          {item.title}
        </h3>
        <p className="mt-0.5 truncate text-xs text-cine-text-muted">
          {item.season !== undefined && item.episode !== undefined
            ? `T${item.season} E${item.episode}${
                item.episodeTitle ? ` • ${item.episodeTitle}` : ""
              }`
            : "Filme"}
        </p>
        <p className="mt-0.5 text-xs font-medium text-cine-text-secondary">
          Continuar em {savedTime}
          {item.duration > 0 ? ` de ${formatPlaybackTime(item.duration)}` : ""}
        </p>
      </div>
    </Link>
  );
}

interface ContinueWatchingRowProps {
  items: WatchProgress[];
}

export function ContinueWatchingRow({ items }: ContinueWatchingRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    setCanScrollLeft(element.scrollLeft > 8);
    setCanScrollRight(
      element.scrollLeft < element.scrollWidth - element.clientWidth - 8
    );
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    checkScrollability();
    element.addEventListener("scroll", checkScrollability, { passive: true });
    const resizeObserver = new ResizeObserver(checkScrollability);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener("scroll", checkScrollability);
      resizeObserver.disconnect();
    };
  }, [checkScrollability, items]);

  const scroll = (direction: "left" | "right") => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollBy({
      left:
        direction === "left"
          ? -element.clientWidth * 0.85
          : element.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  if (items.length === 0) return null;

  return (
    <section aria-label="Continuar assistindo">
      <div className="px-4 md:px-6 lg:px-8 mb-3 lg:mb-4">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
          Continuar assistindo
        </h2>
      </div>
      <div className="relative">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute inset-y-0 left-0 z-10 flex w-11 items-center justify-center bg-gradient-to-r from-cine-bg via-cine-bg/80 to-transparent text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cine-brand sm:w-14"
            aria-label="Ver cards anteriores"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/70 shadow-lg backdrop-blur-sm">
              <ChevronLeft className="h-5 w-5" />
            </span>
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth scroll-px-4 px-4 scrollbar-hide md:gap-4 md:scroll-px-6 md:px-6 lg:scroll-px-8 lg:px-8"
          role="list"
        >
          {items.map((item) => (
            <div
              key={`${item.mediaId}-${item.season}-${item.episode}`}
              className="w-[240px] flex-shrink-0 snap-start sm:w-[280px] md:w-[300px] lg:w-[320px]"
              role="listitem"
            >
              <ContinueWatchingCard item={item} />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute inset-y-0 right-0 z-10 flex w-11 items-center justify-center bg-gradient-to-l from-cine-bg via-cine-bg/80 to-transparent text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cine-brand sm:w-14"
            aria-label="Ver mais cards"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/70 shadow-lg backdrop-blur-sm">
              <ChevronRight className="h-5 w-5" />
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

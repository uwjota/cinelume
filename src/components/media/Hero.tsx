"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Media } from "@/types";
import { formatRating, getMediaDetailUrl } from "@/utils/media";
import { FavoriteButton } from "./FavoriteButton";

interface HeroProps {
  items: Media[];
}

export function Hero({ items }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentItem = items[currentIndex];

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = setTimeout(
        () => setIsTransitioning(false),
        500
      );
    },
    [isTransitioning]
  );

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, goTo]);

  // Auto-advance
  useEffect(() => {
    if (
      items.length <= 1 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = setInterval(goNext, 8000);
    return () => clearInterval(timer);
  }, [goNext, items.length]);

  useEffect(() => {
    if (currentIndex >= items.length) setCurrentIndex(0);
  }, [currentIndex, items.length]);

  useEffect(
    () => () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    },
    []
  );

  if (!currentItem) return null;

  return (
    <section className="relative w-full" aria-label="Destaques">
      {/* Aspect ratio container */}
      <div className="relative h-[min(68svh,34rem)] min-h-[25rem] w-full overflow-hidden sm:h-[min(62svh,35rem)] sm:min-h-[28rem] lg:h-[min(68vh,40rem)] lg:min-h-[30rem]">
        {/* Backdrop Images */}
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {(item.backdrop || item.poster) && (
              <Image
                src={item.backdrop || item.poster!}
                alt=""
                fill
                className="object-cover object-[62%_top] sm:object-top"
                priority={index === 0}
                sizes="100vw"
              />
            )}
          </div>
        ))}

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-cine-bg via-cine-bg/35 to-transparent sm:via-cine-bg/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-cine-bg/[.96] via-cine-bg/60 to-transparent sm:via-cine-bg/35 lg:via-cine-bg/15" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-cine-bg to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 pb-16 sm:pb-16 lg:pb-20">
            <div className="max-w-xl lg:max-w-2xl">
              {/* Metadata */}
              <div className="flex items-center gap-2.5 mb-3 text-xs sm:text-sm">
                {currentItem.year && (
                  <span className="text-cine-text-secondary font-medium">
                    {currentItem.year}
                  </span>
                )}
                {currentItem.rating && (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-semibold text-white">
                      {formatRating(currentItem.rating)}
                    </span>
                  </span>
                )}
                {currentItem.genres && currentItem.genres.length > 0 && (
                  <span className="hidden sm:inline text-cine-text-muted">
                    {currentItem.genres.slice(0, 3).join(" • ")}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="max-w-[18ch] text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {currentItem.title}
              </h1>

              {/* Overview (hidden on small mobile) */}
              <p className="mt-3 hidden text-sm leading-relaxed text-cine-text-secondary sm:block md:text-base lg:mb-6 lg:line-clamp-3">
                {currentItem.overview}
              </p>

              {/* CTA Buttons */}
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href={getMediaDetailUrl(currentItem)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 bg-cine-brand hover:bg-cine-brand-hover text-white font-semibold text-sm sm:text-base rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand focus-visible:ring-offset-2 focus-visible:ring-offset-cine-bg shadow-lg shadow-cine-brand/25"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  Assistir
                </Link>
                <FavoriteButton media={currentItem} />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Desktop only */}
        {items.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-all backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand"
              aria-label="Destaque anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-all backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand"
              aria-label="Próximo destaque"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="absolute bottom-6 right-6 hidden items-center gap-2 sm:flex lg:right-8">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand ${
                index === currentIndex
                  ? "w-6 h-2 bg-cine-brand"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Ir para destaque ${index + 1}`}
              aria-current={index === currentIndex ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}

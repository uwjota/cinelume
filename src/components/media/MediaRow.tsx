"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Media } from "@/types";
import { MediaCard, MediaCardSkeleton } from "./MediaCard";

interface MediaRowProps {
  title: string;
  items: Media[];
  loading?: boolean;
  showType?: boolean;
}

export function MediaRow({ title, items, loading = false, showType = false }: MediaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScrollability();
    el.addEventListener("scroll", checkScrollability, { passive: true });
    const resizeObs = new ResizeObserver(checkScrollability);
    resizeObs.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScrollability);
      resizeObs.disconnect();
    };
  }, [checkScrollability, items]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Don't render empty sections
  if (!loading && items.length === 0) return null;

  return (
    <section className="relative" aria-label={title}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 mb-3 lg:mb-4">
        <h2 className="min-w-0 text-lg font-bold leading-tight text-white sm:text-xl lg:text-2xl">
          {title}
        </h2>
      </div>

      {/* Scroll Container */}
      <div className="relative group/row">
        {/* Left Arrow - Desktop only */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-0 bottom-8 z-10 w-12 items-center justify-center bg-gradient-to-r from-cine-bg/90 to-transparent opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand"
            aria-label="Rolar para a esquerda"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth scroll-px-4 px-4 scrollbar-hide md:gap-4 md:scroll-px-6 md:px-6 lg:scroll-px-8 lg:px-8"
          role="list"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[130px] sm:w-[150px] md:w-[160px] lg:w-[180px] snap-start"
                  role="listitem"
                >
                  <MediaCardSkeleton />
                </div>
              ))
            : items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-[130px] sm:w-[150px] md:w-[160px] lg:w-[180px] snap-start"
                  role="listitem"
                >
                  <MediaCard
                    media={item}
                    showType={showType}
                    priority={index < 4}
                  />
                </div>
              ))}
        </div>

        {/* Right Arrow - Desktop only */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-0 bottom-8 z-10 w-12 items-center justify-center bg-gradient-to-l from-cine-bg/90 to-transparent opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand"
            aria-label="Rolar para a direita"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
    </section>
  );
}

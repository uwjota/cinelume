"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Film,
  Tv,
  Heart,
  MoreHorizontal,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const BOTTOM_NAV_ITEMS = [
  { label: "Início", href: "/", icon: Home },
  { label: "Filmes", href: "/filmes", icon: Film },
  { label: "Séries", href: "/series", icon: Tv },
  { label: "Minha Lista", href: "/minha-lista", icon: Heart },
];

const MORE_ITEMS = [
  { label: "Animes", href: "/animes" },
  { label: "Doramas", href: "/doramas" },
  { label: "TV ao Vivo", href: "/tv" },
  { label: "Esportes", href: "/esportes" },
  { label: "Instalar aplicativo", href: "/instalar" },
  { label: "Configurações", href: "/configuracoes" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        moreRef.current &&
        !moreRef.current.contains(target) &&
        !moreButtonRef.current?.contains(target)
      ) {
        setMoreOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMoreOpen(false);
        moreButtonRef.current?.focus();
      }
    }
    if (moreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [moreOpen]);

  // Close menu on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isMoreActive = MORE_ITEMS.some((item) => isActive(item.href));

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 xl:hidden bg-cine-bg/95 backdrop-blur-md border-t border-cine-border safe-area-bottom"
      aria-label="Navegação inferior"
    >
      {/* More Menu Popup */}
      {moreOpen && (
        <div
          ref={moreRef}
          id="mobile-more-menu"
          role="menu"
          className="absolute bottom-full right-2 mb-2 w-52 max-h-[calc(100dvh-11rem-env(safe-area-inset-bottom,0px))] overflow-y-auto overscroll-contain bg-cine-surface-elevated border border-cine-border rounded-xl shadow-2xl shadow-black/50 animate-in slide-in-from-bottom-2 duration-200"
        >
          {MORE_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className={`flex items-center px-4 py-3.5 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-cine-brand bg-cine-brand/10"
                  : "text-cine-text-secondary hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setMoreOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center justify-around h-16 px-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand ${
                active ? "text-cine-brand" : "text-cine-text-muted"
              }`}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More Button */}
        <button
          ref={moreButtonRef}
          onClick={() => setMoreOpen((prev) => !prev)}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand ${
            isMoreActive || moreOpen
              ? "text-cine-brand"
              : "text-cine-text-muted"
          }`}
          aria-label="Mais opções"
          aria-expanded={moreOpen}
          aria-controls="mobile-more-menu"
          aria-haspopup="menu"
        >
          <MoreHorizontal
            className="w-5 h-5"
            strokeWidth={isMoreActive || moreOpen ? 2.5 : 2}
          />
          <span className="text-[10px] font-medium leading-none">Mais</span>
        </button>
      </div>
    </nav>
  );
}

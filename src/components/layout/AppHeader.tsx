"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Settings, Smartphone } from "lucide-react";
import { SupportBanner } from "@/components/layout/SupportBanner";

const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Filmes", href: "/filmes" },
  { label: "Séries", href: "/series" },
  { label: "Animes", href: "/animes" },
  { label: "Doramas", href: "/doramas" },
  { label: "TV", href: "/tv" },
  { label: "Esportes", href: "/esportes" },
];

export function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cine-bg/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      <SupportBanner />
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Desktop Header */}
        <nav
          className="hidden xl:flex items-center justify-between h-20"
          aria-label="Navegação principal"
        >
          <div className="flex items-center gap-8">
            <Link href="/" aria-label="Cinelume — Página Inicial">
              <Image
                src="/branding/cinelume_wordmark.png"
                alt="Cinelume"
                width={160}
                height={160}
                className="h-16 w-auto object-contain"
                priority
              />
            </Link>

            <div className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand focus-visible:ring-offset-2 focus-visible:ring-offset-cine-bg ${
                    isActive(link.href)
                      ? "bg-white/10 text-white"
                      : "text-cine-text-secondary hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/instalar"
              aria-current={isActive("/instalar") ? "page" : undefined}
              className="flex items-center gap-2 rounded-lg border border-cine-brand/30 bg-cine-brand/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-cine-brand/20"
            >
              <Smartphone className="h-4 w-4" aria-hidden="true" />
              Instalar app
            </Link>

            <Link
              href="/buscar"
              className="p-2.5 text-cine-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand"
              aria-label="Pesquisar"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/minha-lista"
              className="p-2.5 text-cine-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand"
              aria-label="Minha Lista"
            >
              <Heart className="w-5 h-5" />
            </Link>
            <Link
              href="/configuracoes"
              className="p-2.5 text-cine-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand"
              aria-label="Configurações"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </nav>

        {/* Mobile Header */}
        <div className="flex xl:hidden items-center justify-between h-16">
          <Link href="/" aria-label="Cinelume — Página Inicial">
            <Image
              src="/branding/cinelume_wordmark.png"
              alt="Cinelume"
              width={144}
              height={144}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>
          <Link
            href="/buscar"
            className="p-2.5 text-cine-text-secondary hover:text-white transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand"
            aria-label="Pesquisar"
          >
            <Search className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

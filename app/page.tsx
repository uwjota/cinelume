"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ContentType = "movie" | "series" | "anime" | "dorama";
type View = "home" | "tv" | "favorites" | ContentType;

type MediaItem = {
  id: string;
  title: string;
  poster: string;
  year?: string;
  type: ContentType;
};

type Channel = {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  embedUrl: string;
  category?: string;
};

type SavedItem = {
  key: string;
  id: string;
  title: string;
  image?: string;
  meta: string;
  kind: "catalog" | "channel";
  streamUrl: string;
  contentType?: ContentType;
};

type PlayerTarget = SavedItem;

type CatalogResponse = { items?: MediaItem[]; error?: string };
type ChannelsResponse = {
  channels?: Channel[];
  categories?: { id: string; name: string }[];
  error?: string;
};

const CONTENT: { id: ContentType; label: string; endpoint: string; eyebrow: string }[] = [
  { id: "movie", label: "Filmes", endpoint: "filme", eyebrow: "Filmes para a sua noite" },
  { id: "series", label: "Séries", endpoint: "serie", eyebrow: "Séries para maratonar" },
  { id: "anime", label: "Animes", endpoint: "serie", eyebrow: "Histórias sem limite" },
  { id: "dorama", label: "Doramas", endpoint: "serie", eyebrow: "Doramas em destaque" },
];

const EMPTY_CATALOG: Record<ContentType, MediaItem[]> = {
  movie: [],
  series: [],
  anime: [],
  dorama: [],
};

const EMPTY_LOADING: Record<ContentType, boolean> = {
  movie: false,
  series: false,
  anime: false,
  dorama: false,
};

function contentInfo(type: ContentType) {
  return CONTENT.find((item) => item.id === type) ?? CONTENT[0];
}

function withNoExternalLink(streamUrl: string) {
  return streamUrl.includes("#noLink") ? streamUrl : `${streamUrl}#noLink`;
}

function toCatalogTarget(item: MediaItem): PlayerTarget {
  const info = contentInfo(item.type);
  return {
    key: `catalog:${item.type}:${item.id}`,
    id: item.id,
    title: item.title,
    image: item.poster,
    meta: [info.label.slice(0, -1), item.year].filter(Boolean).join(" · "),
    kind: "catalog",
    contentType: item.type,
    streamUrl: `https://superflixapi.pro/${info.endpoint}/${encodeURIComponent(item.id)}`,
  };
}

function toChannelTarget(channel: Channel): PlayerTarget {
  return {
    key: `channel:${channel.id}`,
    id: channel.id,
    title: channel.name,
    image: channel.logo,
    meta: channel.category || "TV ao vivo",
    kind: "channel",
    streamUrl: channel.embedUrl,
  };
}

function readSavedItems(): SavedItem[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem("cinelume-library") || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is SavedItem =>
        Boolean(entry) &&
        typeof entry === "object" &&
        typeof (entry as SavedItem).key === "string" &&
        typeof (entry as SavedItem).title === "string" &&
        typeof (entry as SavedItem).streamUrl === "string",
    );
  } catch {
    return [];
  }
}

function readRecentItems(): SavedItem[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem("cinelume-recent") || "[]");
    return Array.isArray(parsed) ? (parsed as SavedItem[]).slice(0, 12) : [];
  } catch {
    return [];
  }
}

function Poster({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`poster-fallback ${className}`} aria-label={alt} role="img">
        <span>C</span>
      </div>
    );
  }

  return <img className={className} src={src} alt={alt} loading="lazy" />;
}

function Spinner() {
  return <span className="spinner" aria-label="Carregando" />;
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [catalog, setCatalog] = useState<Record<ContentType, MediaItem[]>>(EMPTY_CATALOG);
  const [catalogLoading, setCatalogLoading] = useState<Record<ContentType, boolean>>(EMPTY_LOADING);
  const [catalogError, setCatalogError] = useState<string>("");
  const [catalogPage, setCatalogPage] = useState<Record<ContentType, number>>({
    movie: 1,
    series: 1,
    anime: 1,
    dorama: 1,
  });
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelCategories, setChannelCategories] = useState<{ id: string; name: string }[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [channelsError, setChannelsError] = useState("");
  const [channelQuery, setChannelQuery] = useState("");
  const [channelCategory, setChannelCategory] = useState("");
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [recent, setRecent] = useState<SavedItem[]>([]);
  const [detail, setDetail] = useState<PlayerTarget | null>(null);
  const [player, setPlayer] = useState<PlayerTarget | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"all" | ContentType>("all");
  const [searchResults, setSearchResults] = useState<Record<ContentType, MediaItem[]>>(EMPTY_CATALOG);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const loadCatalog = useCallback(async (type: ContentType, page = 1, append = false) => {
    setCatalogLoading((current) => ({ ...current, [type]: true }));
    setCatalogError("");

    try {
      const response = await fetch(`/api/catalog?type=${type}&page=${page}`);
      const payload = (await response.json()) as CatalogResponse;
      if (!response.ok) throw new Error(payload.error || "Não foi possível atualizar este catálogo.");

      const items = payload.items || [];
      setCatalog((current) => ({
        ...current,
        [type]: append
          ? [...current[type], ...items.filter((item) => !current[type].some((known) => known.id === item.id))]
          : items,
      }));
      setCatalogPage((current) => ({ ...current, [type]: page }));
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : "Não foi possível atualizar este catálogo.");
    } finally {
      setCatalogLoading((current) => ({ ...current, [type]: false }));
    }
  }, []);

  const loadChannels = useCallback(async () => {
    if (channelsLoading || channels.length) return;
    setChannelsLoading(true);
    setChannelsError("");
    try {
      const response = await fetch("/api/channels");
      const payload = (await response.json()) as ChannelsResponse;
      if (!response.ok) throw new Error(payload.error || "Não foi possível carregar os canais.");
      setChannels(payload.channels || []);
      setChannelCategories(payload.categories || []);
    } catch (error) {
      setChannelsError(error instanceof Error ? error.message : "Não foi possível carregar os canais.");
    } finally {
      setChannelsLoading(false);
    }
  }, [channels.length, channelsLoading]);

  useEffect(() => {
    setSaved(readSavedItems());
    setRecent(readRecentItems());
    void Promise.all(CONTENT.map((item) => loadCatalog(item.id)));
  }, [loadCatalog]);

  useEffect(() => {
    if (view === "tv") void loadChannels();
  }, [loadChannels, view]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSearchOpen(false);
      setDetail(null);
      setPlayer(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!searchOpen || searchTerm.trim().length < 2) {
      setSearchResults(EMPTY_CATALOG);
      setSearchLoading(false);
      setSearchError("");
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      setSearchError("");
      const types = searchType === "all" ? CONTENT.map((item) => item.id) : [searchType];

      try {
        const entries = await Promise.all(
          types.map(async (type) => {
            const params = new URLSearchParams({ type, q: searchTerm.trim(), page: "1" });
            const response = await fetch(`/api/catalog?${params.toString()}`);
            const payload = (await response.json()) as CatalogResponse;
            if (!response.ok) throw new Error(payload.error || "A busca não pôde ser concluída.");
            return [type, payload.items || []] as const;
          }),
        );
        if (!cancelled) {
          setSearchResults({ ...EMPTY_CATALOG, ...Object.fromEntries(entries) });
        }
      } catch (error) {
        if (!cancelled) setSearchError(error instanceof Error ? error.message : "A busca não pôde ser concluída.");
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 360);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [searchOpen, searchTerm, searchType]);

  const featured = useMemo(
    () => CONTENT.map((entry) => catalog[entry.id][0]).find(Boolean) || null,
    [catalog],
  );

  const filteredChannels = useMemo(() => {
    const query = channelQuery.trim().toLocaleLowerCase("pt-BR");
    return channels.filter((channel) => {
      const inCategory = !channelCategory || channel.category === channelCategory;
      const haystack = `${channel.name} ${channel.description || ""} ${channel.category || ""}`.toLocaleLowerCase("pt-BR");
      return inCategory && (!query || haystack.includes(query));
    });
  }, [channelCategory, channelQuery, channels]);

  const isSaved = useCallback((target: PlayerTarget) => saved.some((item) => item.key === target.key), [saved]);

  const toggleSaved = useCallback((target: PlayerTarget) => {
    setSaved((current) => {
      const exists = current.some((item) => item.key === target.key);
      const next = exists ? current.filter((item) => item.key !== target.key) : [target, ...current].slice(0, 80);
      window.localStorage.setItem("cinelume-library", JSON.stringify(next));
      return next;
    });
  }, []);

  const openPlayer = useCallback((target: PlayerTarget) => {
    setPlayer(target);
    setDetail(null);
    setRecent((current) => {
      const next = [target, ...current.filter((item) => item.key !== target.key)].slice(0, 12);
      window.localStorage.setItem("cinelume-recent", JSON.stringify(next));
      return next;
    });
  }, []);

  const navigate = (nextView: View) => {
    setView(nextView);
    setSearchOpen(false);
    window.setTimeout(() => document.getElementById("conteudo")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const renderCards = (items: MediaItem[], type: ContentType, variant: "rail" | "grid" = "rail") => {
    if (!items.length && catalogLoading[type]) {
      return Array.from({ length: variant === "rail" ? 7 : 12 }, (_, index) => <div className={`media-skeleton ${variant}`} key={`skeleton-${index}`} />);
    }
    if (!items.length && variant === "rail") {
      return Array.from({ length: 5 }, (_, index) => <div className="media-skeleton rail" key={`placeholder-${index}`} />);
    }
    return items.map((item) => {
      const target = toCatalogTarget(item);
      return (
        <article className={`media-card ${variant}`} key={`${item.type}-${item.id}`}>
          <button className="media-art" type="button" onClick={() => setDetail(target)} aria-label={`Detalhes de ${item.title}`}>
            <Poster src={item.poster} alt={`Pôster de ${item.title}`} className="media-poster" />
            <span className="card-play" aria-hidden="true">▶</span>
          </button>
          <div className="media-meta">
            <strong title={item.title}>{item.title}</strong>
            <span>{item.year || contentInfo(item.type).label}</span>
          </div>
        </article>
      );
    });
  };

  const renderHome = () => (
    <>
      <section className="hero" aria-label="Destaque CineLume">
        <img className="hero-backdrop" src={featured?.poster || "/og.png"} alt="" aria-hidden="true" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="hero-kicker">{featured ? [featured.year, contentInfo(featured.type).label.slice(0, -1).toUpperCase()].filter(Boolean).join("  •  ") : "CINELUME"}</p>
          <h1>{featured?.title || "Carregando destaque"}</h1>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={() => featured && openPlayer(toCatalogTarget(featured))} disabled={!featured}>
              <span aria-hidden="true">▶</span> Assistir
            </button>
            <button className="button button-quiet" type="button" onClick={() => featured && toggleSaved(toCatalogTarget(featured))} disabled={!featured}>
              <span aria-hidden="true">+</span> Minha lista
            </button>
          </div>
        </div>
      </section>

      {CONTENT.map((section) => (
        <section className="content-row" key={section.id}>
          <div className="row-heading">
            <div>
              <h2>{section.label}</h2>
            </div>
            <button type="button" className="text-button" onClick={() => navigate(section.id)}>Ver tudo</button>
          </div>
          <div className="media-rail">
            {renderCards(catalog[section.id], section.id)}
          </div>
        </section>
      ))}

    </>
  );

  const renderBrowse = (type: ContentType) => {
    const info = contentInfo(type);
    const items = catalog[type];
    return (
      <section className="browse-view">
        <div className="browse-heading">
          <div>
            <p className="eyebrow">CINE LUME / CATÁLOGO</p>
            <h1>{info.label}</h1>
            <span>{items.length ? `${items.length} títulos disponíveis nesta seleção` : "Atualizando a seleção"}</span>
          </div>
          <button type="button" className="refresh-button" onClick={() => void loadCatalog(type, 1)} disabled={catalogLoading[type]}>
            {catalogLoading[type] ? <Spinner /> : "↻"} Atualizar
          </button>
        </div>
        <div className="browse-tabs" aria-label="Tipos de conteúdo">
          {CONTENT.map((entry) => <button className={entry.id === type ? "active" : ""} type="button" onClick={() => navigate(entry.id)} key={entry.id}>{entry.label}</button>)}
        </div>
        {catalogError ? <InlineError message={catalogError} onRetry={() => void loadCatalog(type, 1)} /> : null}
        <div className="media-grid">{renderCards(items, type, "grid")}</div>
        {items.length ? (
          <button className="load-more" type="button" disabled={catalogLoading[type]} onClick={() => void loadCatalog(type, catalogPage[type] + 1, true)}>
            {catalogLoading[type] ? <><Spinner /> Carregando</> : <>Mostrar mais <span>↓</span></>}
          </button>
        ) : !catalogLoading[type] && !catalogError ? <EmptyState title="Ainda estamos preparando esta seleção." detail="Tente atualizar daqui a alguns instantes." /> : null}
      </section>
    );
  };

  const renderTV = () => (
    <section className="tv-view">
      <div className="browse-heading">
        <div>
          <p className="eyebrow"><span className="live-dot" /> AGORA NO CINE LUME</p>
          <h1>TV ao vivo</h1>
          <span>{channels.length ? `${channels.length} canais ativos para escolher` : "Sintonizando os canais"}</span>
        </div>
        <button type="button" className="refresh-button" onClick={() => { setChannels([]); void loadChannels(); }} disabled={channelsLoading}>
          {channelsLoading ? <Spinner /> : "↻"} Atualizar
        </button>
      </div>
      <div className="tv-tools">
        <label className="search-field" aria-label="Buscar canal">
          <span aria-hidden="true">⌕</span>
          <input value={channelQuery} onChange={(event) => setChannelQuery(event.target.value)} placeholder="Buscar canal" />
        </label>
        <div className="category-scroll" aria-label="Categorias de canais">
          <button className={!channelCategory ? "active" : ""} type="button" onClick={() => setChannelCategory("")}>Todos</button>
          {channelCategories.map((category) => <button className={channelCategory === category.id ? "active" : ""} type="button" onClick={() => setChannelCategory(category.id)} key={category.id}>{category.name}</button>)}
        </div>
      </div>
      {channelsError ? <InlineError message={channelsError} onRetry={() => { setChannels([]); void loadChannels(); }} /> : null}
      {channelsLoading ? <div className="channel-grid">{Array.from({ length: 12 }, (_, index) => <div className="channel-skeleton" key={index} />)}</div> : null}
      {!channelsLoading && filteredChannels.length ? (
        <div className="channel-grid">
          {filteredChannels.map((channel) => {
            const target = toChannelTarget(channel);
            return (
              <article className="channel-card" key={channel.id}>
                <button type="button" className="channel-main" onClick={() => setDetail(target)} aria-label={`Abrir ${channel.name}`}>
                  <Poster src={channel.logo} alt={`Logo ${channel.name}`} className="channel-logo" />
                  <span className="channel-title"><b>{channel.name}</b><small>{channel.category || "TV ao vivo"}</small></span>
                  <i aria-hidden="true">▶</i>
                </button>
              </article>
            );
          })}
        </div>
      ) : null}
      {!channelsLoading && !channelsError && channels.length && !filteredChannels.length ? <EmptyState title="Nenhum canal encontrado." detail="Tente outro nome ou uma categoria diferente." /> : null}
    </section>
  );

  const renderFavorites = () => (
    <section className="favorites-view">
      <div className="browse-heading">
        <div>
          <p className="eyebrow">SUA BIBLIOTECA</p>
          <h1>Minha lista</h1>
          <span>{saved.length ? `${saved.length} ${saved.length === 1 ? "título salvo" : "títulos salvos"}` : "Tudo o que você salvar aparece aqui"}</span>
        </div>
      </div>
      {saved.length ? <Rail title="" eyebrow="" items={saved} onOpen={setDetail} library /> : <EmptyState title="Sua lista ainda está vazia." detail="Nos títulos que chamarem sua atenção, use + Minha lista para guardar aqui." />}
    </section>
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" aria-label="CineLume, início" onClick={() => navigate("home")}>
          <img src="/cinelume-wordmark-clean.png" alt="CineLume" />
        </button>
        <div className="top-actions">
          <button type="button" className="icon-button" aria-label="Abrir busca" onClick={() => setSearchOpen(true)}>⌕</button>
        </div>
      </header>

      <div id="conteudo" className="page-content">
        {view === "home" ? renderHome() : null}
        {CONTENT.some((item) => item.id === view) ? renderBrowse(view as ContentType) : null}
        {view === "tv" ? renderTV() : null}
        {view === "favorites" ? renderFavorites() : null}
      </div>

      <nav className="mobile-nav" aria-label="Navegação móvel">
        <button className={view === "home" ? "active" : ""} type="button" onClick={() => navigate("home")}><span>⌂</span>Início</button>
        <button className={CONTENT.some((item) => item.id === view) ? "active" : ""} type="button" onClick={() => navigate("movie")}><span>◈</span>Catálogo</button>
        <button className={view === "tv" ? "active" : ""} type="button" onClick={() => navigate("tv")}><span className="tiny-live" />TV</button>
        <button className={view === "favorites" ? "active" : ""} type="button" onClick={() => navigate("favorites")}><span>♡</span>Minha lista</button>
      </nav>

      {searchOpen ? (
        <div className="overlay search-overlay" role="dialog" aria-modal="true" aria-label="Pesquisar no CineLume">
          <section className="search-dialog">
            <div className="search-dialog-top">
              <label className="big-search"><span aria-hidden="true">⌕</span><input autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Título, série, anime ou dorama" /></label>
              <button type="button" className="close-button" onClick={() => setSearchOpen(false)}>Fechar <span>×</span></button>
            </div>
            <div className="search-filter" aria-label="Filtrar tipo de busca">
              <button className={searchType === "all" ? "active" : ""} type="button" onClick={() => setSearchType("all")}>Tudo</button>
              {CONTENT.map((item) => <button className={searchType === item.id ? "active" : ""} type="button" onClick={() => setSearchType(item.id)} key={item.id}>{item.label}</button>)}
            </div>
            {searchTerm.trim().length < 2 ? (
              <div className="search-empty"><span>⌕</span><h2>O que você quer assistir?</h2><p>Digite pelo menos duas letras para encontrar títulos no catálogo atualizado.</p></div>
            ) : null}
            {searchLoading ? <div className="search-loading"><Spinner /> Procurando no catálogo</div> : null}
            {searchError ? <InlineError message={searchError} /> : null}
            {!searchLoading && !searchError && searchTerm.trim().length >= 2 ? (
              <div className="search-results">
                {CONTENT.filter((item) => searchType === "all" || searchType === item.id).map((section) => searchResults[section.id].length ? (
                  <section key={section.id}><h2>{section.label}</h2><div className="media-grid compact">{renderCards(searchResults[section.id], section.id, "grid")}</div></section>
                ) : null)}
                {!CONTENT.some((item) => (searchType === "all" || searchType === item.id) && searchResults[item.id].length) ? <EmptyState title="Nada encontrado desta vez." detail="Experimente um título mais curto ou outra grafia." /> : null}
              </div>
            ) : null}
          </section>
        </div>
      ) : null}

      {detail ? (
        <div className="overlay detail-overlay" role="dialog" aria-modal="true" aria-label={`Detalhes de ${detail.title}`} onMouseDown={(event) => { if (event.target === event.currentTarget) setDetail(null); }}>
          <section className="detail-dialog">
            <button type="button" className="dialog-close" onClick={() => setDetail(null)} aria-label="Fechar detalhes">×</button>
            <div className="detail-art"><Poster src={detail.image} alt={detail.title} className="detail-poster" /><span className="detail-vignette" /></div>
            <div className="detail-content">
              <p className="eyebrow">{detail.kind === "channel" ? "CANAL AO VIVO" : "CINE LUME SELECIONOU"}</p>
              <h2>{detail.title}</h2>
              <p className="detail-meta">{detail.meta || "Disponível no catálogo"}</p>
              <p className="detail-description">A reprodução é disponibilizada pelo parceiro de conteúdo. Salve na sua lista para assistir depois ou abra quando estiver pronto.</p>
              <div className="detail-actions">
                <button type="button" className="button button-primary" onClick={() => openPlayer(detail)}><span>▶</span> Assistir</button>
                <button type="button" className={isSaved(detail) ? "button button-saved" : "button button-quiet"} onClick={() => toggleSaved(detail)}><span>{isSaved(detail) ? "✓" : "+"}</span>{isSaved(detail) ? "Na minha lista" : "Minha lista"}</button>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {player ? (
        <div className="overlay player-overlay" role="dialog" aria-modal="true" aria-label={`Reproduzir ${player.title}`}>
          <section className="player-dialog">
            <div className="player-top"><div><span className="live-dot" /> REPRODUZINDO <b>{player.title}</b></div><button type="button" className="dialog-close" onClick={() => setPlayer(null)} aria-label="Fechar reprodução">×</button></div>
            <div className="player-frame">
              <iframe
                src={withNoExternalLink(player.streamUrl)}
                title={`Reprodução de ${player.title}`}
                allow="autoplay *; encrypted-media *; picture-in-picture *; fullscreen *; clipboard-write *; accelerometer *; gyroscope *; web-share *"
                allowFullScreen
              />
            </div>
            <div className="player-note"><span>i</span><p>O vídeo é fornecido pelo parceiro com os links externos ocultos pelo CineLume.</p></div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

function Rail({ title, eyebrow, items, onOpen, library = false }: { title: string; eyebrow: string; items: SavedItem[]; onOpen: (item: PlayerTarget) => void; library?: boolean }) {
  return (
    <section className={`content-row library-row ${library ? "library-page-row" : ""}`}>
      {title ? <div className="row-heading"><div><p>{eyebrow}</p><h2>{title}</h2></div></div> : null}
      <div className="media-rail">
        {items.map((item) => (
          <article className="media-card rail" key={item.key}>
            <button className="media-art" type="button" onClick={() => onOpen(item)} aria-label={`Abrir ${item.title}`}>
              <Poster src={item.image} alt={item.title} className="media-poster" />
              <span className="card-play" aria-hidden="true">▶</span>
            </button>
            <div className="media-meta"><strong title={item.title}>{item.title}</strong><span>{item.meta}</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function InlineError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div className="inline-error"><span>!</span><p>{message}</p>{onRetry ? <button type="button" onClick={onRetry}>Tentar de novo</button> : null}</div>;
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="empty-state"><span>◌</span><h2>{title}</h2><p>{detail}</p></div>;
}

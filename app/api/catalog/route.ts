const BASE_URL = "https://superflixapi.pro";

type ContentType = "movie" | "series" | "anime" | "dorama";

const PAGE_SIZE = 40;
const TYPE_CONFIG: Record<ContentType, { path: string; searchCode: string; listCategory: string; label: string }> = {
  movie: { path: "filmes", searchCode: "1", listCategory: "filme", label: "Filme" },
  series: { path: "series", searchCode: "2", listCategory: "serie", label: "Série" },
  anime: { path: "animes", searchCode: "3", listCategory: "anime", label: "Anime" },
  dorama: { path: "doramas", searchCode: "5", listCategory: "dorama", label: "Dorama" },
};

const CARD_START = /<div\s+x-data="\{\s*open:\s*false\s*\}"/gi;
const IMAGE = /<img[\s\S]*?src="([^"]+)"[\s\S]*?alt="([^"]*)"[\s\S]*?>/i;
const CONTENT_LINK = /data-copy="https:\/\/(?:www\.)?superflixapi\.pro\/(filme|serie|anime|dorama)\/([^"/?#]+)(?:[/?#][^"]*)?"/i;
const YEAR = /<div\s+class="mt-3[^"]*"[\s\S]*?<span>(\d{4})<\/span>/i;

function isContentType(value: string | null): value is ContentType {
  return value === "movie" || value === "series" || value === "anime" || value === "dorama";
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .trim();
}

function safePoster(rawPoster: string) {
  const decoded = decodeHtml(rawPoster).replace("/t/p/original/", "/t/p/w500/");
  try {
    return new URL(decoded, BASE_URL).toString();
  } catch {
    return "";
  }
}

function parseCatalog(html: string, type: ContentType) {
  const starts = Array.from(html.matchAll(CARD_START), (match) => match.index ?? 0);
  if (!starts.length) {
    const normalized = html.toLocaleLowerCase("pt-BR");
    if (normalized.includes("nenhum resultado") || normalized.includes("nenhum filme") || normalized.includes("0 itens")) return [];
    throw new Error("O formato do catálogo mudou. Tente atualizar novamente.");
  }

  const unique = new Map<string, { id: string; title: string; poster: string; year: string; type: ContentType }>();
  for (let index = 0; index < starts.length; index += 1) {
    const card = html.slice(starts[index], starts[index + 1] ?? html.length);
    const image = card.match(IMAGE);
    const link = card.match(CONTENT_LINK);
    if (!image || !link) continue;

    const id = decodeURIComponent(link[2]);
    const title = decodeHtml(image[2]);
    const poster = safePoster(image[1]);
    const year = card.match(YEAR)?.[1] || "";
    if (id && title && poster) unique.set(`${type}:${id}`, { id, title, poster, year, type });
  }

  if (!unique.size) throw new Error("O catálogo respondeu em um formato inesperado.");
  return [...unique.values()];
}

async function readCatalogIds(type: ContentType, genre: string) {
  const config = TYPE_CONFIG[type];
  const endpoint = new URL(`${BASE_URL}/lista`);
  endpoint.searchParams.set("category", config.listCategory);
  endpoint.searchParams.set("type", "tmdb");
  endpoint.searchParams.set("format", "json");
  endpoint.searchParams.set("order", "asc");
  if (genre) endpoint.searchParams.set("genero", genre);

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.6",
      "User-Agent": "Mozilla/5.0 (compatible; CineLume Web/1.0)",
    },
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`A lista de ${config.label.toLocaleLowerCase("pt-BR")} respondeu HTTP ${response.status}.`);
  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) throw new Error("A API retornou uma lista de catálogo inválida.");

  return payload.filter((value): value is string => typeof value === "string" && value.trim().length > 0);
}

function buildIdFallback(ids: string[], type: ContentType, page: number) {
  const config = TYPE_CONFIG[type];
  const start = (page - 1) * PAGE_SIZE;
  return ids.slice(start, start + PAGE_SIZE).map((id) => ({
    id,
    title: `${config.label} ${id}`,
    poster: "/og.png",
    year: "",
    type,
  }));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedType = url.searchParams.get("type");
  if (!isContentType(requestedType)) {
    return Response.json({ error: "Tipo de catálogo inválido." }, { status: 400 });
  }

  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") || "1", 10) || 1);
  const query = (url.searchParams.get("q") || "").trim();
  const genre = (url.searchParams.get("genre") || "").trim();
  const config = TYPE_CONFIG[requestedType];
  const upstream = query
    ? new URL(`${BASE_URL}/pesquisar`)
    : new URL(`${BASE_URL}/${config.path}`);

  upstream.searchParams.set("page", String(page));
  if (query) {
    upstream.searchParams.set("s", query);
    upstream.searchParams.set("type", config.searchCode);
  } else if (genre) {
    upstream.searchParams.set("genre", genre);
  }

  try {
    const response = await fetch(upstream, {
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.6",
        "User-Agent": "Mozilla/5.0 (compatible; CineLume Web/1.0)",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok && !query) {
      const ids = await readCatalogIds(requestedType, genre);
      const fallbackItems = buildIdFallback(ids, requestedType, page);
      return Response.json(
        { items: fallbackItems, page, type: requestedType },
        { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
      );
    }

    if (!response.ok) throw new Error(`O catálogo respondeu HTTP ${response.status}.`);
    let items;
    if (response.ok) {
      const html = await response.text();
      items = parseCatalog(html, requestedType);
    } else if (!query) {
      const ids = await readCatalogIds(requestedType, genre);
      items = buildIdFallback(ids, requestedType, page);
    } else {
      throw new Error(`Catalog upstream HTTP ${response.status}.`);
    }
    return Response.json(
      { items, page, type: requestedType },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Não foi possível acessar o catálogo agora." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}

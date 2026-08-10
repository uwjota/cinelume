import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const BASE_URL = "https://superflixapi.pro";
const PAGE_COUNT = Math.max(1, Number.parseInt(process.env.CINELUME_CACHE_PAGES || "5", 10) || 5);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "data");

const TYPES = {
  movie: "filmes",
  series: "series",
  anime: "animes",
  dorama: "doramas",
};

const CARD_START = /<div\s+x-data="\{\s*open:\s*false\s*\}"/gi;
const IMAGE = /<img[\s\S]*?src="([^"]+)"[\s\S]*?alt="([^"]*)"[\s\S]*?>/i;
const CONTENT_LINK = /data-copy="https:\/\/(?:www\.)?superflixapi\.pro\/(filme|serie|anime|dorama)\/([^"/?#]+)(?:[/?#][^"]*)?"/i;
const YEAR = /<div\s+class="mt-3[^"]*"[\s\S]*?<span>(\d{4})<\/span>/i;

function decodeHtml(value) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .trim();
}

function safePoster(rawPoster) {
  const decoded = decodeHtml(rawPoster).replace("/t/p/original/", "/t/p/w500/");
  try {
    return new URL(decoded, BASE_URL).toString();
  } catch {
    return "";
  }
}

function parseCatalog(html, type) {
  const starts = Array.from(html.matchAll(CARD_START), (match) => match.index ?? 0);
  const items = [];
  for (let index = 0; index < starts.length; index += 1) {
    const card = html.slice(starts[index], starts[index + 1] ?? html.length);
    const image = card.match(IMAGE);
    const link = card.match(CONTENT_LINK);
    if (!image || !link) continue;

    const id = decodeURIComponent(link[2]);
    const title = decodeHtml(image[2]);
    const poster = safePoster(image[1]);
    const year = card.match(YEAR)?.[1] || "";
    if (id && title && poster) items.push({ id, title, poster, year, type });
  }
  return items;
}

async function fetchProvider(url, accept) {
  const response = await fetch(url, {
    headers: {
      Accept: accept,
      "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.6",
      "User-Agent": "Mozilla/5.0 (compatible; CineLume Cache Sync/1.0)",
    },
  });
  if (!response.ok) throw new Error(`${url} respondeu HTTP ${response.status}.`);
  return response;
}

async function syncCatalog() {
  const catalog = { updatedAt: new Date().toISOString(), movie: [], series: [], anime: [], dorama: [] };
  for (const [type, pathname] of Object.entries(TYPES)) {
    const unique = new Map();
    for (let page = 1; page <= PAGE_COUNT; page += 1) {
      const url = new URL(`${BASE_URL}/${pathname}`);
      url.searchParams.set("page", String(page));
      const response = await fetchProvider(url, "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8");
      const items = parseCatalog(await response.text(), type);
      for (const item of items) unique.set(item.id, item);
    }
    catalog[type] = [...unique.values()];
  }
  return catalog;
}

async function syncChannels() {
  const [channelResponse, categoryResponse] = await Promise.all([
    fetchProvider(`${BASE_URL}/lista?category=canais&format=json&limit=999`, "application/json"),
    fetchProvider(`${BASE_URL}/lista?category=channel_categories&format=json&limit=999`, "application/json"),
  ]);
  const [channelRoot, categoryRoot] = await Promise.all([channelResponse.json(), categoryResponse.json()]);

  const channels = Array.isArray(channelRoot.data)
    ? channelRoot.data
        .filter((item) => item && item.is_active !== false && item.id && item.name && String(item.category || "").toLocaleLowerCase("pt-BR") !== "adulto")
        .map((item) => ({
          id: String(item.id),
          name: String(item.name),
          description: String(item.description || ""),
          logo: String(item.logo_url || ""),
          embedUrl: String(item.embed_url || `${BASE_URL}/canal/${encodeURIComponent(String(item.id))}`),
          category: String(item.category || ""),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
    : [];

  const categories = Array.isArray(categoryRoot.data)
    ? categoryRoot.data
        .filter((item) => item && item.id && item.name && String(item.id).toLocaleLowerCase("pt-BR") !== "adulto")
        .map((item) => ({ id: String(item.id), name: String(item.name) }))
        .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
    : [];

  return { updatedAt: new Date().toISOString(), channels, categories };
}

await mkdir(DATA_DIR, { recursive: true });
const [catalog, channels] = await Promise.all([syncCatalog(), syncChannels()]);
await Promise.all([
  writeFile(path.join(DATA_DIR, "catalog-cache.json"), `${JSON.stringify(catalog, null, 2)}\n`, "utf8"),
  writeFile(path.join(DATA_DIR, "channels-cache.json"), `${JSON.stringify(channels, null, 2)}\n`, "utf8"),
]);

console.log(`Cache atualizado: ${Object.values(TYPES).length} catálogos, ${channels.channels.length} canais.`);

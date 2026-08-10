import channelsCache from "../../../data/channels-cache.json";

const BASE_URL = "https://superflixapi.pro";

type ApiRecord = Record<string, unknown>;

function asRecord(value: unknown): ApiRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as ApiRecord) : null;
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isAdult(value: string) {
  return value.toLocaleLowerCase("pt-BR") === "adulto";
}

function trustedEmbed(value: string, id: string) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol === "https:" && parsed.hostname === "superflixapi.pro") return parsed.toString();
  } catch {
    // Falls back to the provider's public channel endpoint below.
  }
  return `${BASE_URL}/canal/${encodeURIComponent(id)}`;
}

async function readProvider(path: string) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: "application/json,text/plain;q=0.9,*/*;q=0.8",
      "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.6",
      "User-Agent": "Mozilla/5.0 (compatible; CineLume Web/1.0)",
    },
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`A lista de canais respondeu HTTP ${response.status}.`);
  return response.json() as Promise<{ success?: boolean; data?: unknown }>;
}

export async function GET() {
  if (process.env.VERCEL === "1") {
    return Response.json(
      {
        channels: channelsCache.channels,
        categories: channelsCache.categories,
        source: "cache",
        updatedAt: channelsCache.updatedAt,
      },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" } },
    );
  }

  try {
    const [channelRoot, categoryRoot] = await Promise.all([
      readProvider("/lista?category=canais&format=json&limit=999"),
      readProvider("/lista?category=channel_categories&format=json&limit=999"),
    ]);
    const channelData = Array.isArray(channelRoot.data) ? channelRoot.data : [];
    const categoryData = Array.isArray(categoryRoot.data) ? categoryRoot.data : [];
    const channels = new Map<string, { id: string; name: string; description: string; logo: string; embedUrl: string; category: string }>();

    for (const raw of channelData) {
      const item = asRecord(raw);
      if (!item || item.is_active === false) continue;
      const id = text(item.id);
      const name = text(item.name);
      const category = text(item.category);
      if (!id || !name || isAdult(category)) continue;
      channels.set(id, {
        id,
        name,
        description: text(item.description),
        logo: text(item.logo_url),
        embedUrl: trustedEmbed(text(item.embed_url), id),
        category,
      });
    }

    const categories = new Map<string, { id: string; name: string }>();
    for (const raw of categoryData) {
      const item = asRecord(raw);
      if (!item) continue;
      const id = text(item.id);
      const name = text(item.name);
      if (id && name && !isAdult(id)) categories.set(id.toLocaleLowerCase("pt-BR"), { id, name });
    }

    return Response.json(
      {
        channels: [...channels.values()].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
        categories: [...categories.values()].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
      },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  } catch (error) {
    if (channelsCache.channels.length) {
      return Response.json(
        {
          channels: channelsCache.channels,
          categories: channelsCache.categories,
          source: "cache",
          updatedAt: channelsCache.updatedAt,
        },
        { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" } },
      );
    }
    return Response.json(
      { error: error instanceof Error ? error.message : "Não foi possível acessar a TV ao vivo agora." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}

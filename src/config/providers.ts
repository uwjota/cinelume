/**
 * Centralized Provider Configuration for Cinelume.
 * Reads environment variables with authorized fallbacks from API specifications.
 */

export const PROVIDER_CONFIG = {
  tmdb: {
    apiKey: process.env.TMDB_API_KEY || "",
    accessToken: process.env.TMDB_ACCESS_TOKEN || "",
    apiBaseUrl: "https://api.themoviedb.org/3",
    imageBaseUrl:
      process.env.NEXT_PUBLIC_METADATA_IMAGE_BASE_URL ||
      "https://image.tmdb.org/t/p",
  },
  liveTv: {
    // Rei dos Embeds Public API
    providerUrl:
      process.env.NEXT_PUBLIC_LIVE_PROVIDER_URL ||
      "https://reidosembeds.online/api",
  },
  players: {
    superflixBaseUrl:
      process.env.NEXT_PUBLIC_SUPERFLIX_PLAYER_URL ||
      "https://superflixapi.quest",
    warezCdnBaseUrl:
      process.env.NEXT_PUBLIC_WAREZCDN_PLAYER_URL || "https://warezcdn.sbs",
    allowedDomains: [
      "superflixapi.quest",
      "warezcdn.sbs",
      "v1.rdembed.sbs",
      "v2.rdembed.sbs",
      "reidosembeds.online",
      "youtube.com",
    ],
  },
  timeouts: {
    metadata: 5000,
    live: 6000,
  },
} as const;

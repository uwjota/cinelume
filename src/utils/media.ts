import type { Media, MediaType } from "@/types";

/**
 * Returns a human-readable label for a media type.
 */
export function getMediaTypeLabel(type: MediaType): string {
  const labels: Record<MediaType, string> = {
    movie: "Filme",
    series: "Série",
    anime: "Anime",
    dorama: "Dorama",
  };
  return labels[type];
}

/**
 * Returns the route prefix for a given media type.
 */
export function getMediaRoute(type: MediaType): string {
  const routes: Record<MediaType, string> = {
    movie: "/filme",
    series: "/serie",
    anime: "/anime",
    dorama: "/dorama",
  };
  return routes[type];
}

/**
 * Returns the detail URL for a media item.
 */
export function getMediaDetailUrl(media: Media): string {
  return `${getMediaRoute(media.type)}/${media.id}`;
}

/**
 * Compares category labels without being affected by accents or TMDB subgenres.
 * For example, the "Ação" filter also matches "Ação e Aventura".
 */
export function matchesGenre(itemGenre: string, selectedGenre: string): boolean {
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");

  const item = normalize(itemGenre);
  const selected = normalize(selectedGenre);
  return item.includes(selected) || selected.includes(item);
}

/**
 * Returns the watch URL for a media item.
 */
export function getWatchUrl(
  media: Media,
  season?: number,
  episode?: number
): string {
  const base = `/assistir/${media.type === "movie" ? "filme" : "serie"}/${media.id}`;
  if (season !== undefined && episode !== undefined) {
    return `${base}?season=${season}&episode=${episode}`;
  }
  return base;
}

/**
 * Formats a rating to one decimal place.
 */
export function formatRating(rating: number | undefined): string {
  if (rating === undefined || rating === null) return "N/A";
  return rating.toFixed(1);
}

/**
 * Formats runtime in minutes to hours and minutes.
 */
export function formatRuntime(minutes: number | undefined): string {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

/**
 * Calculates progress percentage.
 */
export function getProgressPercentage(
  progress: number,
  duration: number
): number {
  if (duration <= 0) return 0;
  return Math.min(Math.round((progress / duration) * 100), 100);
}

/**
 * Generates a unique string ID.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Truncates a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1).trimEnd() + "…";
}

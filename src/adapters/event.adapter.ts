import type { LiveEvent } from "@/types";

/**
 * Normalizes raw external sports event data into the Cinelume LiveEvent model.
 */
export function toEventModel(raw: {
  id: string | number;
  title?: string;
  sport?: string;
  competition?: string;
  status?: "upcoming" | "live" | "finished";
  start_time?: string;
  poster?: string;
  description?: string;
  home_team?: { name: string; logo?: string };
  away_team?: { name: string; logo?: string };
  streams?: Array<{
    id: string;
    name: string;
    quality?: string;
    url: string;
  }>;
}): LiveEvent {
  return {
    id: String(raw.id),
    title: raw.title || "Evento Esportivo",
    sport: raw.sport || "Outros",
    competition: raw.competition,
    status: raw.status || "upcoming",
    startTime: raw.start_time,
    poster: raw.poster,
    description: raw.description,
    homeTeam: raw.home_team,
    awayTeam: raw.away_team,
    streams: raw.streams || [],
  };
}

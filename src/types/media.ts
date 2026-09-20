export type MediaType = "movie" | "series" | "anime" | "dorama";

export interface Media {
  id: string;
  tmdbId?: number;
  imdbId?: string;
  title: string;
  originalTitle?: string;
  overview?: string;
  poster?: string;
  backdrop?: string;
  year?: number;
  rating?: number;
  genres?: string[];
  type: MediaType;
}

export interface Person {
  id: string;
  name: string;
  character?: string;
  profilePath?: string;
}

export interface Season {
  number: number;
  name: string;
  episodeCount: number;
  poster?: string;
  overview?: string;
}

export interface Episode {
  id: string;
  number: number;
  seasonNumber: number;
  title: string;
  overview?: string;
  thumbnail?: string;
  runtime?: number;
  airDate?: string;
}

export interface MediaDetails extends Media {
  runtime?: number;
  cast?: Person[];
  directors?: Person[];
  seasons?: Season[];
  episodes?: Episode[];
  recommendations?: Media[];
  trailer?: string;
}

export interface WatchProgress {
  mediaId: string;
  mediaType: MediaType;
  season?: number;
  episode?: number;
  progress: number;
  duration: number;
  updatedAt: string;
  poster?: string;
  title: string;
  episodeTitle?: string;
}

export interface Favorite {
  mediaId: string;
  type: MediaType;
  title: string;
  poster?: string;
  addedAt: string;
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
}

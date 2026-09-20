import Dexie, { type Table } from "dexie";
import type {
  Favorite,
  WatchProgress,
  RecentSearch,
  MediaType,
} from "@/types";

export interface HistoryItem {
  id?: number;
  mediaId: string;
  mediaType: MediaType;
  title: string;
  poster?: string;
  season?: number;
  episode?: number;
  progress: number;
  duration: number;
  watchedAt: string;
}

export interface UserSetting {
  key: string;
  value: string | number | boolean;
}

export class CinelumeDB extends Dexie {
  favorites!: Table<Favorite, string>;
  watchProgress!: Table<WatchProgress, string>;
  history!: Table<HistoryItem, number>;
  recentSearches!: Table<RecentSearch, string>;
  settings!: Table<UserSetting, string>;

  constructor() {
    super("CinelumeDB");

    this.version(1).stores({
      favorites: "mediaId, type, title, addedAt",
      watchProgress: "mediaId, mediaType, updatedAt",
      history: "++id, mediaId, mediaType, watchedAt",
      recentSearches: "id, query, timestamp",
      settings: "key",
    });
  }
}

// Client-safe singleton
export const db =
  typeof window !== "undefined"
    ? new CinelumeDB()
    : (null as unknown as CinelumeDB);

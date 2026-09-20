import { db } from "@/lib/db";
import type { RecentSearch } from "@/types";

const MAX_RECENT_SEARCHES = 10;

function searchId(query: string): string {
  return query.trim().toLocaleLowerCase("pt-BR");
}

export class RecentSearchesService {
  private isAvailable(): boolean {
    return typeof window !== "undefined" && Boolean(db);
  }

  async getAll(): Promise<RecentSearch[]> {
    if (!this.isAvailable()) return [];

    try {
      const items = await db.recentSearches.toArray();
      return items
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, MAX_RECENT_SEARCHES);
    } catch {
      return [];
    }
  }

  async add(query: string): Promise<void> {
    const trimmed = query.trim();
    if (!this.isAvailable() || trimmed.length < 2) return;

    try {
      await db.transaction("rw", db.recentSearches, async () => {
        await db.recentSearches.put({
          id: searchId(trimmed),
          query: trimmed,
          timestamp: new Date().toISOString(),
        });

        const items = await db.recentSearches
          .orderBy("timestamp")
          .reverse()
          .toArray();
        const staleIds = items
          .slice(MAX_RECENT_SEARCHES)
          .map((item) => item.id);

        if (staleIds.length > 0) {
          await db.recentSearches.bulkDelete(staleIds);
        }
      });
    } catch {
      // Storage errors must not break search.
    }
  }

  async remove(id: string): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      await db.recentSearches.delete(id);
    } catch {
      // Storage errors must not break search.
    }
  }

  async clear(): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      await db.recentSearches.clear();
    } catch {
      // Storage errors must not break search.
    }
  }
}

export const recentSearchesService = new RecentSearchesService();

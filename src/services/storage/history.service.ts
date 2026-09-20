import { db, type HistoryItem } from "@/lib/db";

export class HistoryService {
  private readonly maxItems = 100;

  private isAvailable(): boolean {
    return typeof window !== "undefined" && Boolean(db);
  }

  async getAll(): Promise<HistoryItem[]> {
    if (!this.isAvailable()) return [];
    try {
      const items = await db.history.toArray();
      return items.sort(
        (a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()
      );
    } catch {
      return [];
    }
  }

  async add(item: Omit<HistoryItem, "id" | "watchedAt">): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      await db.transaction("rw", db.history, async () => {
        await db.history.add({
          ...item,
          watchedAt: new Date().toISOString(),
        });

        const overflow = (await db.history.count()) - this.maxItems;
        if (overflow > 0) {
          const oldestKeys = await db.history
            .orderBy("watchedAt")
            .limit(overflow)
            .primaryKeys();
          await db.history.bulkDelete(oldestKeys);
        }
      });
    } catch {
      // Storage error ignored
    }
  }

  async remove(id: number): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      await db.history.delete(id);
    } catch {
      // Storage error ignored
    }
  }

  async clear(): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      await db.history.clear();
    } catch {
      // Storage error ignored
    }
  }
}

export const historyService = new HistoryService();

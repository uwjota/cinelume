import { db } from "@/lib/db";
import type { WatchProgress } from "@/types";

export class WatchProgressService {
  private isAvailable(): boolean {
    return typeof window !== "undefined" && Boolean(db);
  }

  async getAll(limit = 10): Promise<WatchProgress[]> {
    if (!this.isAvailable()) return [];
    try {
      const items = await db.watchProgress.toArray();
      return items
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit);
    } catch {
      return [];
    }
  }

  async get(mediaId: string): Promise<WatchProgress | undefined> {
    if (!this.isAvailable()) return undefined;
    try {
      return await db.watchProgress.get(mediaId);
    } catch {
      return undefined;
    }
  }

  async save(progress: Omit<WatchProgress, "updatedAt">): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      await db.watchProgress.put({
        ...progress,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // Storage error ignored
    }
  }

  async remove(mediaId: string): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      await db.watchProgress.delete(mediaId);
    } catch {
      // Storage error ignored
    }
  }

  async clear(): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      await db.watchProgress.clear();
    } catch {
      // Storage error ignored
    }
  }
}

export const watchProgressService = new WatchProgressService();

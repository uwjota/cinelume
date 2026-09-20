import { db } from "@/lib/db";
import type { Favorite, Media, MediaType } from "@/types";

export class FavoritesService {
  private isAvailable(): boolean {
    return typeof window !== "undefined" && Boolean(db);
  }

  async getAll(): Promise<Favorite[]> {
    if (!this.isAvailable()) return [];
    try {
      return await db.favorites.orderBy("addedAt").reverse().toArray();
    } catch {
      return [];
    }
  }

  async isFavorite(mediaId: string): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      const item = await db.favorites.get(mediaId);
      return Boolean(item);
    } catch {
      return false;
    }
  }

  async add(media: Media | { id: string; title: string; poster?: string; type: MediaType }): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      await db.favorites.put({
        mediaId: media.id,
        type: media.type,
        title: media.title,
        poster: media.poster,
        addedAt: new Date().toISOString(),
      });
    } catch {
      // Storage error ignored
    }
  }

  async remove(mediaId: string): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      await db.favorites.delete(mediaId);
    } catch {
      // Storage error ignored
    }
  }

  async toggle(media: Media): Promise<boolean> {
    if (!this.isAvailable()) return false;
    const exists = await this.isFavorite(media.id);
    if (exists) {
      await this.remove(media.id);
      return false;
    } else {
      await this.add(media);
      return true;
    }
  }

  async clear(): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      await db.favorites.clear();
    } catch {
      // Storage error ignored
    }
  }
}

export const favoritesService = new FavoritesService();

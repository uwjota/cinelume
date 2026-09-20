import { db } from "@/lib/db";

export class SettingsService {
  private isAvailable(): boolean {
    return typeof window !== "undefined" && Boolean(db);
  }

  async get<T extends string | number | boolean>(key: string, defaultValue: T): Promise<T> {
    if (!this.isAvailable()) return defaultValue;
    try {
      const record = await db.settings.get(key);
      return record ? (record.value as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  async set(key: string, value: string | number | boolean): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      await db.settings.put({ key, value });
    } catch {
      // Storage error ignored
    }
  }

  async clearAllData(): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      await Promise.all([
        db.favorites.clear(),
        db.watchProgress.clear(),
        db.history.clear(),
        db.recentSearches.clear(),
        db.settings.clear(),
      ]);
      localStorage.removeItem("cinelume_recent_searches");
    } catch {
      // Storage error ignored
    }
  }
}

export const settingsService = new SettingsService();

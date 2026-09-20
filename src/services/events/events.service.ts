import { reiDosEmbedsEventsProvider } from "@/providers/events/reidosembeds.events";
import type { LiveEvent } from "@/types";

export class CinelumeEventsService {
  async getEvents(category?: string, status?: string): Promise<LiveEvent[]> {
    const events = await reiDosEmbedsEventsProvider.getEvents(category, status);

    // Sort order prioritized: 1. ao vivo, 2. próximos, 3. demais (finished)
    const statusPriority: Record<string, number> = {
      live: 1,
      upcoming: 2,
      finished: 3,
    };

    return events.sort((a, b) => {
      const pA = statusPriority[a.status] || 4;
      const pB = statusPriority[b.status] || 4;
      if (pA !== pB) return pA - pB;
      // Secondary sort: earliest start time
      if (a.startTime && b.startTime) {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      }
      return 0;
    });
  }

  async getCategories(): Promise<string[]> {
    return reiDosEmbedsEventsProvider.getCategories();
  }

  async getEventById(id: string): Promise<LiveEvent | null> {
    return reiDosEmbedsEventsProvider.getEventById(id);
  }
}

export const eventsService = new CinelumeEventsService();

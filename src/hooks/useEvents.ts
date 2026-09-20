"use client";

import { useQuery } from "@tanstack/react-query";
import { eventsService } from "@/services/events/events.service";

export function useEvents(category?: string, status?: string) {
  return useQuery({
    queryKey: ["events", category || "all", status || "all"],
    queryFn: () => eventsService.getEvents(category, status),
    staleTime: 1000 * 60 * 2, // 2 minutes fresh for sports
    refetchInterval: 1000 * 60 * 2, // Auto-refetch live score/status every 2 mins
  });
}

export function useEventCategories() {
  return useQuery({
    queryKey: ["events", "categories"],
    queryFn: () => eventsService.getCategories(),
    staleTime: 1000 * 60 * 60,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["events", "event", id],
    queryFn: () => eventsService.getEventById(id),
    enabled: Boolean(id),
  });
}

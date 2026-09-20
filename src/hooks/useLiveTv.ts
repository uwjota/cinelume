"use client";

import { useQuery } from "@tanstack/react-query";
import { liveTvService } from "@/services/live-tv/live-tv.service";

export function useChannels(category?: string) {
  return useQuery({
    queryKey: ["live-tv", "channels", category || "all"],
    queryFn: () => liveTvService.getChannels(category),
    staleTime: 1000 * 60 * 3, // 3 minutes fresh for live channels
  });
}

export function useChannelCategories() {
  return useQuery({
    queryKey: ["live-tv", "categories"],
    queryFn: () => liveTvService.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour fresh
  });
}

export function useChannel(id: string) {
  return useQuery({
    queryKey: ["live-tv", "channel", id],
    queryFn: () => liveTvService.getChannelById(id),
    enabled: Boolean(id),
  });
}

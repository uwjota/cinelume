"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/storage/settings.service";
import { DEFAULT_PLAYER_SERVER_ID } from "@/services/players/player.service";

export function useSettings() {
  const queryClient = useQueryClient();

  const { data: autoplayNext = true } = useQuery<boolean>({
    queryKey: ["local", "settings", "autoplayNext"],
    queryFn: () => settingsService.get("autoplayNext", true),
  });

  const setAutoplayMutation = useMutation({
    mutationFn: (val: boolean) => settingsService.set("autoplayNext", val),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["local", "settings", "autoplayNext"],
      });
    },
  });

  const { data: defaultPlayerServer = DEFAULT_PLAYER_SERVER_ID } = useQuery<string>({
    queryKey: ["local", "settings", "defaultPlayerServer"],
    queryFn: () =>
      settingsService.get("defaultPlayerServer", DEFAULT_PLAYER_SERVER_ID),
  });

  const setDefaultPlayerServerMutation = useMutation({
    mutationFn: (serverId: string) =>
      settingsService.set("defaultPlayerServer", serverId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["local", "settings", "defaultPlayerServer"],
      });
    },
  });

  const clearAllDataMutation = useMutation({
    mutationFn: () => settingsService.clearAllData(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["local"] });
    },
  });

  return {
    autoplayNext,
    setAutoplayNext: setAutoplayMutation.mutate,
    defaultPlayerServer,
    setDefaultPlayerServer: setDefaultPlayerServerMutation.mutate,
    clearAllData: clearAllDataMutation.mutate,
  };
}

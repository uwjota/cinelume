"use client";

import { useQuery } from "@tanstack/react-query";
import { catalogService } from "@/services/catalog/catalog.service";

export function useTrending() {
  return useQuery({
    queryKey: ["catalog", "trending"],
    queryFn: () => catalogService.getTrending(),
  });
}

export function usePopularMovies() {
  return useQuery({
    queryKey: ["catalog", "movies", "popular"],
    queryFn: () => catalogService.getPopularMovies(),
  });
}

export function usePopularSeries() {
  return useQuery({
    queryKey: ["catalog", "series", "popular"],
    queryFn: () => catalogService.getPopularSeries(),
  });
}

export function usePopularAnimes() {
  return useQuery({
    queryKey: ["catalog", "animes", "popular"],
    queryFn: () => catalogService.getPopularAnimes(),
  });
}

export function usePopularDoramas() {
  return useQuery({
    queryKey: ["catalog", "doramas", "popular"],
    queryFn: () => catalogService.getPopularDoramas(),
  });
}

export function useNewReleases() {
  return useQuery({
    queryKey: ["catalog", "movies", "releases"],
    queryFn: () => catalogService.getNewReleases(),
  });
}

import { QueryClient } from "@tanstack/react-query";

/**
 * Creates or retrieves a configured TanStack Query Client.
 * Configured with 5 minutes stale time, 30 minutes cache time, and limited retries.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes fresh
        gcTime: 1000 * 60 * 30, // 30 minutes in cache
        retry: 1, // Limited retry to prevent infinite hanging
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnReconnect: "always",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

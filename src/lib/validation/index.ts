/**
 * Input sanitization and validation utilities for query params, IDs, seasons, episodes.
 */

export * from "./schemas";

/**
 * Sanitizes an alphanumeric ID string.
 */
export function sanitizeId(id: unknown): string {
  if (typeof id !== "string") return "";
  return id.replace(/[^a-zA-Z0-9_-]/g, "");
}

/**
 * Safely parses a positive integer from string or number.
 */
export function parsePositiveInt(val: unknown, fallback = 1): number {
  const parsed = Number.parseInt(String(val), 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

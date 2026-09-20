import type { ZodType } from "zod";

export class HttpTimeoutError extends Error {
  constructor(url: string, timeoutMs: number) {
    super(`Request to ${url} timed out after ${timeoutMs}ms`);
    this.name = "HttpTimeoutError";
  }
}

export class HttpApiError extends Error {
  public status: number;
  public url: string;

  constructor(message: string, status: number, url: string) {
    super(message);
    this.name = "HttpApiError";
    this.status = status;
    this.url = url;
  }
}

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
}

/**
 * Robust fetch wrapper with configurable timeout and abort controller.
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeoutMs = 8000, ...fetchInit } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchInit,
      signal: controller.signal,
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new HttpTimeoutError(url, timeoutMs);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Safely fetches and validates JSON with Zod schema.
 * Tolerates HTTP 500, HTML responses, timeouts, and malformed data without throwing uncaught crashes.
 */
export async function safeFetchJson<T>(
  url: string,
  schema: ZodType<T>,
  options: FetchOptions = {}
): Promise<{ data: T | null; error: Error | null; status: number }> {
  try {
    const response = await fetchWithTimeout(url, options);

    if (!response.ok) {
      return {
        data: null,
        error: new HttpApiError(
          `HTTP error ${response.status} from ${url}`,
          response.status,
          url
        ),
        status: response.status,
      };
    }

    const contentType = response.headers.get("content-type") || "";
    // If external server returns HTML instead of JSON
    if (!contentType.includes("application/json") && !contentType.includes("text/json")) {
      const text = await response.text();
      try {
        const parsed = JSON.parse(text);
        const validated = schema.safeParse(parsed);
        if (validated.success) {
          return { data: validated.data, error: null, status: response.status };
        }
      } catch {
        return {
          data: null,
          error: new Error(`Expected JSON but received ${contentType} from ${url}`),
          status: response.status,
        };
      }
    }

    const json = await response.json();
    const validated = schema.safeParse(json);

    if (!validated.success) {
      return {
        data: null,
        error: new Error(
          `Validation failed for ${url}: ${validated.error.issues.map((i) => i.message).join(", ")}`
        ),
        status: response.status,
      };
    }

    return { data: validated.data, error: null, status: response.status };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
      status: 0,
    };
  }
}

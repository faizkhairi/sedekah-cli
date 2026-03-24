import type { Institution, InstitutionListResponse } from "../types.js";

const BASE_URL = "https://sedekah.je/api";
const DEFAULT_TIMEOUT_MS = 10_000;

class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithTimeout(
  url: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let body = "";
    try {
      body = await response.text();
    } catch {
      // ignore
    }
    throw new ApiError(
      response.status,
      `HTTP ${response.status}: ${response.statusText}${body ? ` — ${body}` : ""}`,
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Failed to parse API response as JSON");
  }
}

export interface ListParams {
  search?: string;
  state?: string;
  category?: string;
  limit?: number;
  page?: number;
}

export async function listInstitutions(
  params: ListParams = {},
): Promise<InstitutionListResponse> {
  const url = new URL(`${BASE_URL}/institutions`);

  if (params.search) url.searchParams.set("search", params.search);
  if (params.state) url.searchParams.set("state", params.state);
  if (params.category) url.searchParams.set("category", params.category);
  if (params.limit != null) url.searchParams.set("limit", String(params.limit));
  if (params.page != null) url.searchParams.set("page", String(params.page));

  const response = await fetchWithTimeout(url.toString());
  return parseJson<InstitutionListResponse>(response);
}

export async function randomInstitution(): Promise<Institution> {
  const response = await fetchWithTimeout(`${BASE_URL}/random`);
  return parseJson<Institution>(response);
}

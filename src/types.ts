export interface Institution {
  id: number;
  name: string;
  slug: string;
  category: string;
  state: string;
  city: string;
  qrContent: string;
  qrImage: string | null;
  supportedPayment: string[];
  description: string | null;
  coords: [number, number];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  totalPages: number;
}

export interface InstitutionListResponse {
  institutions: Institution[];
  pagination: Pagination;
}

export interface SearchOptions {
  query?: string;
  state?: string;
  category?: string;
  limit?: number;
  page?: number;
  json?: boolean;
}

export interface RandomOptions {
  json?: boolean;
}

export interface QrOptions {
  // no extra options beyond the positional name arg
}

/** All valid Malaysian states as the API expects them (case-sensitive). */
export const VALID_STATES: readonly string[] = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "W.P. Kuala Lumpur",
  "W.P. Labuan",
  "W.P. Putrajaya",
] as const;

/** All valid categories as the API expects them. */
export const VALID_CATEGORIES: readonly string[] = [
  "masjid",
  "surau",
  "tahfiz",
  "kebajikan",
  "lain-lain",
] as const;

/** Normalise user-provided state string to the API-expected casing. */
export function normaliseState(input: string): string | null {
  const lower = input.toLowerCase();
  const match = VALID_STATES.find((s) => s.toLowerCase() === lower);
  return match ?? null;
}

/** Normalise user-provided category string to the API-expected casing. */
export function normaliseCategory(input: string): string | null {
  const lower = input.toLowerCase();
  const match = VALID_CATEGORIES.find((c) => c.toLowerCase() === lower);
  return match ?? null;
}

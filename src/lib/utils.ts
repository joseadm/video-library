import { SearchParams } from "@/types";
import { PAGINATION, SEARCH } from "@/lib/constants";

// Parse and normalize search parameters with defaults
export function parseSearchParams(searchParams: SearchParams) {
  return {
    sort: (searchParams.sort as string) || SEARCH.DEFAULT_SORT,
    q: (searchParams.q as string) || "",
    tag: (searchParams.tag as string) || "",
    from: (searchParams.from as string) || "",
    to: (searchParams.to as string) || "",
    page: Number(searchParams.page ?? PAGINATION.DEFAULT_PAGE),
    perPage: PAGINATION.DEFAULT_PAGE_SIZE,
  };
}

// Build query parameters for pagination
export function buildPageQueryParams(
  currentParams: ReturnType<typeof parseSearchParams>, 
  nextPage: number
): Record<string, string> {
  const queryParams: Record<string, string> = {};
  
  // Add current search parameters
  if (currentParams.q) queryParams.q = currentParams.q;
  if (currentParams.sort) queryParams.sort = currentParams.sort;
  if (currentParams.tag) queryParams.tag = currentParams.tag;
  if (currentParams.from) queryParams.from = currentParams.from;
  if (currentParams.to) queryParams.to = currentParams.to;
  
  // Add pagination parameters
  queryParams.page = String(nextPage);
  queryParams.perPage = String(currentParams.perPage);
  
  return queryParams;
}

// Build API URL with search parameters
export function buildApiUrl(baseUrl: string, endpoint: string, params: SearchParams): string {
  const url = new URL(endpoint, baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  });

  // Set defaults
  if (!url.searchParams.has('sort')) {
    url.searchParams.set('sort', SEARCH.DEFAULT_SORT);
  }
  if (!url.searchParams.has('page')) {
    url.searchParams.set('page', String(PAGINATION.DEFAULT_PAGE));
  }
  if (!url.searchParams.has('perPage')) {
    url.searchParams.set('perPage', String(PAGINATION.DEFAULT_PAGE_SIZE));
  }

  return url.toString();
} 
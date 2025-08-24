import { useState, useEffect, useMemo, useCallback } from "react";
import { VideoData, SearchParams } from "@/types";
import { PAGINATION, SEARCH } from "@/lib/constants";

// Types for internal use
interface ParsedSearchParams {
  sort: string;
  q: string;
  tag: string;
  from: string;
  to: string;
  page: number;
  perPage: number;
}

interface UseVideoPageReturn {
  // Data
  data: VideoData | null;
  isLoading: boolean;
  error: Error | null;
  
  // Current values
  sort: string;
  q: string;
  tag: string;
  from: string;
  to: string;
  page: number;
  perPage: number;
  totalPages: number;
  currentPage: number;
  
  // Functions
  buildPageQuery: (nextPage: number) => Record<string, string>;
}

// Parse and normalize search parameters with defaults
function parseSearchParams(searchParams: SearchParams): ParsedSearchParams {
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

// Build API URL with search parameters
function buildApiUrl(params: ParsedSearchParams): URL {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const url = new URL("/videos", apiUrl);
  
  // Add non-empty parameters to URL
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, v));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  });
  
  return url;
}

// Fetch videos from API
async function fetchVideosFromApi(params: ParsedSearchParams): Promise<VideoData> {
  const url = buildApiUrl(params);
  const response = await fetch(url, { cache: "no-store" });
  
  if (!response.ok) {
    throw new Error("Failed to load videos");
  }
  
  return response.json();
}

// Build query parameters for pagination
function buildPageQueryParams(
  currentParams: ParsedSearchParams, 
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

export function useVideoPage(
  searchParams: SearchParams, 
  initialData?: VideoData
): UseVideoPageReturn {
  // State management
  const [data, setData] = useState<VideoData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  // Parse and memoize search parameters
  const parsedParams = useMemo(
    () => parseSearchParams(searchParams),
    [searchParams.sort, searchParams.q, searchParams.tag, searchParams.from, searchParams.to, searchParams.page]
  );

  // Memoized fetch function
  const fetchVideos = useCallback(async (params: ParsedSearchParams) => {
    try {
      return await fetchVideosFromApi(params);
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to load");
    }
  }, []);

  // Memoized page query builder
  const buildPageQuery = useCallback(
    (nextPage: number) => buildPageQueryParams(parsedParams, nextPage),
    [parsedParams]
  );
  
  // Fetch data when parameters change
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await fetchVideos(parsedParams);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load"));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [parsedParams, fetchVideos]);

  // Computed values
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? parsedParams.page;

  return {
    // Data
    data,
    isLoading,
    error,
    
    // Current values
    sort: parsedParams.sort,
    q: parsedParams.q,
    tag: parsedParams.tag,
    from: parsedParams.from,
    to: parsedParams.to,
    page: parsedParams.page,
    perPage: parsedParams.perPage,
    totalPages,
    currentPage,
    
    // Functions
    buildPageQuery,
  };
} 
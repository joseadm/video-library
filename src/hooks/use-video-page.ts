import { useState, useEffect, useMemo, useCallback } from "react";
import { VideoData, SearchParams } from "@/types";
import { apiClient } from "@/lib/api-client";
import { parseSearchParams, buildPageQueryParams } from "@/lib/utils";

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
        
        // Convert parsed params to SearchParams format
        const apiParams: SearchParams = {
          sort: parsedParams.sort,
          q: parsedParams.q,
          tag: parsedParams.tag,
          from: parsedParams.from,
          to: parsedParams.to,
          page: String(parsedParams.page),
          perPage: String(parsedParams.perPage),
        };
        
        const result = await apiClient.fetchVideos(apiParams);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load"));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [parsedParams]);

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
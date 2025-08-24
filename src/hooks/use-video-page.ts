import { useState, useEffect, useMemo, useCallback } from "react";
import { VideoData, SearchParams } from "@/types";
import { PAGINATION, SEARCH } from "@/lib/constants";

export function useVideoPage(
  searchParams: SearchParams, 
  initialData?: VideoData
) {
  const [data, setData] = useState<VideoData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  // Memoize parsed search params to prevent unnecessary re-renders
  const parsedParams = useMemo(() => ({
    sort: (searchParams.sort as string) || SEARCH.DEFAULT_SORT,
    q: (searchParams.q as string) || "",
    tag: (searchParams.tag as string) || "",
    from: (searchParams.from as string) || "",
    to: (searchParams.to as string) || "",
    page: Number(searchParams.page ?? PAGINATION.DEFAULT_PAGE),
    perPage: PAGINATION.DEFAULT_PAGE_SIZE,
  }), [searchParams.sort, searchParams.q, searchParams.tag, searchParams.from, searchParams.to, searchParams.page]);

  // Memoize fetch function to prevent unnecessary re-renders
  const fetchVideos = useCallback(async (params: SearchParams) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const url = new URL("/videos", apiUrl);
      
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((v) => url.searchParams.append(key, v));
          } else {
            url.searchParams.set(key, value);
          }
        }
      }
      
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load videos");
      return res.json();
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to load");
    }
  }, []);

  // Memoize buildPageQuery function
  const buildPageQuery = useCallback((nextPage: number): Record<string, string> => {
    const base: Record<string, string> = {};
    if (parsedParams.q) base.q = parsedParams.q;
    if (parsedParams.sort) base.sort = parsedParams.sort;
    if (parsedParams.tag) base.tag = parsedParams.tag;
    if (parsedParams.from) base.from = parsedParams.from;
    if (parsedParams.to) base.to = parsedParams.to;
    base.page = String(nextPage);
    base.perPage = String(parsedParams.perPage);
    return base;
  }, [parsedParams.q, parsedParams.sort, parsedParams.tag, parsedParams.from, parsedParams.to, parsedParams.perPage]);
  
  // This useEffect will now properly trigger when any search param changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Build the params object with all current values
        const fetchParams = {
          sort: parsedParams.sort,
          q: parsedParams.q,
          tag: parsedParams.tag,
          from: parsedParams.from,
          to: parsedParams.to,
          page: String(parsedParams.page),
          perPage: String(parsedParams.perPage)
        };
        
        const result = await fetchVideos(fetchParams);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load"));
      } finally {
        setIsLoading(false);
      }
    };

    // Always fetch when params change (don't check initialData)
    loadData();
  }, [parsedParams, fetchVideos]); // Dependencies include all parsed params

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
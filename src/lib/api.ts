import { VideoRecord, VideoData, SearchParams } from "@/types";
import { PAGINATION, SEARCH, API } from "@/lib/constants";
import { VideoFetchError, TimeoutError, NetworkError } from "@/lib/errors";

export async function fetchVideos(searchParams: SearchParams): Promise<VideoData> {
  try {

    console.log("TESTER...");


    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const url = new URL('/videos', apiUrl);
    
    // Add search params to URL
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, v));
        } else {
          url.searchParams.set(key, value);
        }
      }
    });

    // Set defaults if not provided
    if (!url.searchParams.has('sort')) url.searchParams.set('sort', SEARCH.DEFAULT_SORT);
    if (!url.searchParams.has('page')) url.searchParams.set('page', String(PAGINATION.DEFAULT_PAGE));
    if (!url.searchParams.has('perPage')) url.searchParams.set('perPage', String(PAGINATION.DEFAULT_PAGE_SIZE));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API.DEFAULT_TIMEOUT);

    console.log('URL: ', url.toString())

    const response = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    console.log('Fetch response: ', response)

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new VideoFetchError(
        `Failed to fetch videos: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();

    console.log('RESPONSE: ', data)

    return data;
  } catch (error) {
    if (error instanceof VideoFetchError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError(
        'Request timeout - video service is not responding'
      );
    }

    console.log('Error: ', error)
    
    // Network or other errors
    throw new NetworkError(
      'Failed to connect to video service'
    );
  }
} 
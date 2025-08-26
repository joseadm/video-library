import { VideoData, SearchParams, CreateVideoInput } from "@/types";
import { API } from "@/lib/constants";
import { VideoFetchError, TimeoutError, NetworkError } from "@/lib/errors";
import { buildApiUrl } from "@/lib/utils";

// Base API client configuration
class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    const isDocker = process.env.DOCKER_ENV === "true";

    if (isDocker) {
      // Running in Docker container: use host.docker.internal
      this.baseUrl =
        process.env.NEXT_DOCKER_API_URL || "http://host.docker.internal:4000";
    } else {
      // Running locally on host machine: use localhost
      this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    }

    this.timeout = API.DEFAULT_TIMEOUT;
  }

  // Generic request method with timeout and error handling
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Handle both full URLs and relative endpoints
      const url = endpoint.startsWith("http")
        ? endpoint
        : `${this.baseUrl}${endpoint}`;

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new VideoFetchError(
          `Failed to fetch videos: ${response.statusText}`,
          response.status
        );
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof VideoFetchError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new TimeoutError(
          "Request timeout - video service is not responding"
        );
      }

      throw new NetworkError("Failed to connect to video service");
    }
  }

  // Video API methods
  async fetchVideos(searchParams: SearchParams): Promise<VideoData> {
    const url = buildApiUrl(this.baseUrl, "/videos", searchParams);
    return this.request<VideoData>(url, {
      cache: "no-store",
    });
  }

  async createVideo(videoData: CreateVideoInput): Promise<VideoData> {
    return this.request<VideoData>("/videos", {
      method: "POST",
      body: JSON.stringify(videoData),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Convenience functions for backward compatibility
export const fetchVideos = (searchParams: SearchParams) =>
  apiClient.fetchVideos(searchParams);

export const createVideo = (videoData: CreateVideoInput) =>
  apiClient.createVideo(videoData);

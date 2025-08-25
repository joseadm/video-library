export interface VideoRecord {
  id: string;
  title: string;
  thumbnail_url: string;
  created_at: string; 
  duration: number; 
  views: number;
  tags: string[];
}

export interface CreateVideoInput {
  title: string;
  tags?: string[];
  thumbnail_url?: string; 
  duration?: number;
  views?: number;
}

// API response types
export interface VideoData {
  items: VideoRecord[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  pages: number[];
  hasPrev: boolean;
  hasNext: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface SearchParams {
  sort?: string;
  q?: string;
  tag?: string;
  from?: string;
  to?: string;
  page?: string;
  perPage?: string;
}
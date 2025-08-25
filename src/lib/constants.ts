// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 6,
  MAX_PAGE_SIZE: 50,
  DEFAULT_PAGE: 1,
} as const;

export const PLACEHOLDER_URL = "https://placehold.co/600x400/png?text=Image+Not+Found";

// Search constants
export const SEARCH = {
  DEFAULT_SORT: 'desc',
  SORT_OPTIONS: ['asc', 'desc'] as const,
  MIN_SEARCH_LENGTH: 2,
} as const;

// API constants
export const API = {
  DEFAULT_TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

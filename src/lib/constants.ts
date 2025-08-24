// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 6,
  MAX_PAGE_SIZE: 50,
  DEFAULT_PAGE: 1,
} as const;

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

// UI constants
export const UI = {
  SPACING: {
    XS: '0.25rem',    // 4px
    SM: '0.5rem',     // 8px
    MD: '1rem',       // 16px
    LG: '1.5rem',     // 24px
    XL: '2rem',       // 32px
  },
  SIZES: {
    INPUT_HEIGHT: '2.5rem',    // 40px
    BUTTON_HEIGHT: '2.5rem',   // 40px
    ICON_SIZE: '1rem',         // 16px
  },
  RADIUS: {
    SM: '0.375rem',   // 6px
    MD: '0.5rem',     // 8px
    LG: '0.75rem',    // 12px
    FULL: '9999px',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
} as const;

// Form validation constants
export const VALIDATION = {
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  TAGS: {
    MAX_COUNT: 10,
    MAX_LENGTH: 20,
  },
  URL: {
    MAX_LENGTH: 500,
  },
  DURATION: {
    MIN: 0,
    MAX: 86400, // 24 hours in seconds
  },
  VIEWS: {
    MIN: 0,
    MAX: 999999999,
  },
} as const; 
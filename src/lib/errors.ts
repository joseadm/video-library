// Base error class for the application
export abstract class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// API related errors
export class VideoFetchError extends AppError {
  constructor(message: string, statusCode: number, details?: unknown) {
    super(message, statusCode, 'VIDEO_FETCH_ERROR', details);
  }
}

export class VideoCreateError extends AppError {
  constructor(message: string, statusCode: number, details?: unknown) {
    super(message, statusCode, 'VIDEO_CREATE_ERROR', details);
  }
}

export class VideoUpdateError extends AppError {
  constructor(message: string, statusCode: number, details?: unknown) {
    super(message, statusCode, 'VIDEO_UPDATE_ERROR', details);
  }
}

export class VideoDeleteError extends AppError {
  constructor(message: string, statusCode: number, details?: unknown) {
    super(message, statusCode, 'VIDEO_DELETE_ERROR', details);
  }
}

// Validation errors
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

// Network errors
export class NetworkError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 503, 'NETWORK_ERROR', details);
  }
}

export class TimeoutError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 408, 'TIMEOUT_ERROR', details);
  }
}

// Authentication/Authorization errors
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access', details?: unknown) {
    super(message, 401, 'UNAUTHORIZED_ERROR', details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden', details?: unknown) {
    super(message, 403, 'FORBIDDEN_ERROR', details);
  }
}

// Resource errors
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details?: unknown) {
    super(message, 404, 'NOT_FOUND_ERROR', details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', details?: unknown) {
    super(message, 409, 'CONFLICT_ERROR', details);
  }
}

// Server errors
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: unknown) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details);
  }
}

// Error handler utility
export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new InternalServerError(error.message, error);
  }
  
  return new InternalServerError('An unknown error occurred', error);
}

// Error response formatter
export function formatErrorResponse(error: AppError) {
  const baseError = {
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
  };
  
  if (error.details) {
    return {
      error: {
        ...baseError,
        details: error.details,
      },
    };
  }
  
  return {
    error: baseError,
  };
} 
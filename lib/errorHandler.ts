import { NextRequest, NextResponse } from 'next/server';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Standard error response
 */
export function errorResponse(
  message: string,
  statusCode: number = 500,
  details?: any
): NextResponse {
  const response = {
    error: message,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: statusCode });
}

/**
 * Success response
 */
export function successResponse(data: any, statusCode: number = 200): NextResponse {
  return NextResponse.json(data, { status: statusCode });
}

/**
 * Handle errors in API routes
 */
export function handleError(error: unknown, request: NextRequest): NextResponse {
  // Log error
  console.error('API Error:', {
    url: request.url,
    method: request.method,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  // Handle known errors
  if (error instanceof AppError) {
    return errorResponse(error.message, error.statusCode, error.details);
  }

  // Handle unknown errors
  const message = error instanceof Error ? error.message : 'Internal server error';
  return errorResponse(
    process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : message,
    500
  );
}

/**
 * Validate required fields
 */
export function validateFields(data: any, fields: string[]): string | null {
  for (const field of fields) {
    if (!data[field] || data[field] === '') {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Async wrapper for error handling
 */
export function asyncHandler(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      return handleError(error, request);
    }
  };
}







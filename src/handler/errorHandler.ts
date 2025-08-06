import { NextResponse } from 'next/server';
import { AuthError } from '@supabase/supabase-js';

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(
      this,
      this.constructor
    );
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(
    message: string = 'Resource not found'
  ) {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export const handleError = (
  error: unknown
): NextResponse<ErrorResponse> => {
  console.error('Error occurred:', error);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof AuthError) {
    statusCode = 401;
    message =
      error.message || 'Authentication error';
  } else if (error instanceof Error) {
    message = error.message;
  }

  const errorResponse: ErrorResponse = {
    error: 'Error',
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(errorResponse, {
    status: statusCode,
  });
};

export const asyncHandler = (
  fn: (
    req: Request,
    context?: any
  ) => Promise<NextResponse>
) => {
  return async (
    req: Request,
    context?: any
  ): Promise<NextResponse> => {
    try {
      return await fn(req, context);
    } catch (error) {
      return handleError(error);
    }
  };
};

// Handler específico para erros do cliente
export const handleClientError = (
  error: unknown
): string => {
  if (error instanceof AppError) {
    return error.message;
  } else if (error instanceof AuthError) {
    return (
      error.message || 'Erro de autenticação'
    );
  } else if (error instanceof Error) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado';
};

// Validador de entrada para APIs
export const validateBody = <T>(
  body: unknown,
  validator: (data: unknown) => T
): T => {
  try {
    return validator(body);
  } catch (error) {
    throw new ValidationError(
      error instanceof Error
        ? error.message
        : 'Invalid request body'
    );
  }
};

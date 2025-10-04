import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/api.types';

/**
 * Global error handling middleware
 * Catches all errors and returns a consistent error response
 */
export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Mark intentionally unused parameters to satisfy noUnusedParameters
  void _req;
  void _next;
  console.error('Error:', error);

  // Default error response
  const errorResponse: ErrorResponse = {
    error: 'Internal Server Error',
    message: error.message || 'An unexpected error occurred',
    statusCode: 500,
  };

  // Handle specific error types
  if (error.name === 'ValidationError') {
    errorResponse.error = 'Validation Error';
    errorResponse.statusCode = 400;
  }

  if (error.name === 'UnauthorizedError') {
    errorResponse.error = 'Unauthorized';
    errorResponse.statusCode = 401;
  }

  // Send error response
  res.status(errorResponse.statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Mark intentionally unused parameter to satisfy noUnusedParameters
  void _next;
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404,
  });
};


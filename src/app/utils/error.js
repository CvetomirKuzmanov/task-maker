// /app/utils/error.js
'use client';

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error) => {
  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode
    };
  }
  console.error('Server error:', error);
  return {
    error: 'Internal server error',
    statusCode: 500
  };
};
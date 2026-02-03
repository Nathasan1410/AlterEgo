import { APIResponse, APIError, APIMetadata } from "../types/api";
import { ERROR_CODES } from "../lib/constants";

let requestIdCounter = 0;

function generateRequestId(): string {
  return `req_${Date.now()}_${++requestIdCounter}`;
}

export function createResponse<T>(data: T, error?: APIError, duration?: number): APIResponse<T> {
  return {
    success: !error,
    data,
    error: error || null,
    meta: {
      requestId: generateRequestId(),
      timestamp: new Date().toISOString(),
      duration: duration || 0,
      version: "3.0.0",
    },
  };
}

export function createErrorResponse(
  message: string,
  code: string = ERROR_CODES.API_ERROR,
  details?: unknown
): APIResponse<null> {
  return createResponse<null>(null, { code, message, details }, 0);
}

export function createValidationErrorResponse(field: string, message: string): APIResponse<null> {
  return createResponse<null>(
    null,
    {
      code: ERROR_CODES.VALIDATION_ERROR,
      message: `Invalid ${field}: ${message}`,
    },
    0
  );
}

import { NextResponse } from "next/server";
import { GenerationError, ValidationError, APIError, RateLimitError } from "../types/errors";
import { logger } from "./logger";
import { ERROR_CODES } from "../lib/constants";
import { LogLevel } from "./logger";

export function handleError(error: unknown): NextResponse {
  if (error instanceof GenerationError) {
    const context = {
      code: error.code,
      details: error.details,
    };
    (logger as any).log(LogLevel.ERROR, "Generation error occurred", error, context);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: 400 }
    );
  }

  if (error instanceof ValidationError) {
    const context = {
      field: error.field,
      value: String(error.value).slice(0, 100),
    };
    (logger as any).log(LogLevel.ERROR, "Validation error occurred", error, context);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: `Invalid ${error.field}: ${error.message}`,
        },
      },
      { status: 400 }
    );
  }

  if (error instanceof APIError) {
    const context = {
      status: error.status,
      code: error.code,
    };
    (logger as any).log(LogLevel.ERROR, "API error occurred", error, context);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code || ERROR_CODES.API_ERROR,
          message: error.message,
        },
      },
      { status: error.status }
    );
  }

  if (error instanceof RateLimitError) {
    const context = {
      retryAfter: error.retryAfter,
    };
    (logger as any).log(LogLevel.WARN, "Rate limit exceeded", undefined, context);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
          message: error.message,
          retryAfter: error.retryAfter,
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": error.retryAfter.toString(),
        },
      }
    );
  }

  if (error instanceof Error) {
    (logger as any).log(LogLevel.ERROR, `Unhandled error occurred: ${error.message}`, error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ERROR_CODES.GENERATION_ERROR,
          message: error.message,
        },
      },
      { status: 500 }
    );
  }

  const errorString = String(error);
  const wrappedError = new Error(errorString);
  const context = {
    error: errorString.slice(0, 100),
  };
  (logger as any).log(LogLevel.ERROR, "Unknown error occurred", wrappedError, context);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: ERROR_CODES.API_ERROR,
        message: "An unexpected error occurred",
      },
    },
    { status: 500 }
  );
}

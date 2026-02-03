export class GenerationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "GenerationError";
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class RateLimitError extends Error {
  constructor(
    public retryAfter: number,
    message = "Rate limit exceeded"
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

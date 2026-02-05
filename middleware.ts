import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimiter } from "@/src/middleware/rateLimit";
import { RateLimitError } from "@/src/types/errors";

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const identifier =
    request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous";

  try {
    const { remaining, resetAt } = rateLimiter.check(identifier);
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", "10");
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", resetAt.toString());
    return response;
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: error.message,
            retryAfter: error.retryAfter,
          },
        },
        { status: 429, headers: { "Retry-After": error.retryAfter.toString() } }
      );
    }
    return NextResponse.next();
  }
}

export const config = { matcher: "/api/:path*" };

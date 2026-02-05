// API Client for AlterEgo LinkedIn Post Generator
// All API calls to /api/generate endpoint

import type { APIResponse, GeneratedOption } from "../types/api";
import { logger } from "../utils/logger";

export type GenerationType = "topics" | "hooks" | "body" | "cta";

export type { GeneratedOption };

interface GenerateContentParams {
  input?: string;
  topic?: string;
  hook?: string;
  body?: string;
  context?: string;
  intent?: string;
  length?: string;
  tone?: number;
  researchDepth?: number;
  styleGuidance?: string;
}

interface GenerateContentResponse {
  result: GeneratedOption[] | string[];
  error?: string;
}

interface PolishParams {
  content: string;
  tone: number;
  emojiDensity: number;
  language: string;
}

interface PolishResponse {
  result: string;
  scores?: unknown[];
  error?: string;
}

/**
 * Generate content (topics, hooks, body, or CTA options)
 * Uses Opik tracing on the backend for observability
 */
export async function generateContent(
  type: GenerationType,
  params: GenerateContentParams
): Promise<GenerateContentResponse> {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        ...params,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate content");
    }

    const apiResponse: APIResponse<{
      result: GeneratedOption[] | string[];
      options?: GeneratedOption[];
    }> = await response.json();

    if (!apiResponse.success || apiResponse.error) {
      throw new Error(apiResponse.error?.message || "API returned error");
    }

    const result = apiResponse.data.result || apiResponse.data.options || [];
    return { result };
  } catch (error) {
    logger.error(`Error generating ${type}`, error instanceof Error ? error : undefined, {
      type,
      params,
    });
    return {
      result: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Polish final post with tone, emoji density, and language adjustments
 * Uses Opik tracing on the backend for observability
 */
export async function polishPost(params: PolishParams): Promise<PolishResponse> {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "polish",
        ...params,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to polish post");
    }

    const apiResponse: APIResponse<
      { polished: string; scores?: unknown[] } | { result: string; scores?: unknown[] }
    > = await response.json();

    if (!apiResponse.success || apiResponse.error) {
      throw new Error(apiResponse.error?.message || "API returned error");
    }

    const data = apiResponse.data as unknown;
    const text =
      (data as { polished: string }).polished || (data as { result: string }).result || "";
    const scores = (data as { scores?: unknown[] }).scores;

    return {
      result: text,
      scores,
    };
  } catch (error) {
    logger.error("Error polishing post", error instanceof Error ? error : undefined, { params });
    return {
      result: "",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Generate a complete post in one call (for faster generation)
 * Uses Opik tracing with parent span on the backend
 */
export async function generateCompletePost(params: {
  topic: string;
  intent: string;
  length: string;
  tone: number;
  emojiDensity: number;
  language: string;
}): Promise<{ result: string; scores?: unknown[]; error?: string }> {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "complete",
        ...params,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate complete post");
    }

    const apiResponse: APIResponse<{ result: string; scores?: unknown[] }> = await response.json();

    if (!apiResponse.success || apiResponse.error) {
      throw new Error(apiResponse.error?.message || "API returned error");
    }

    return {
      result: apiResponse.data.result,
      scores: apiResponse.data.scores,
    };
  } catch (error) {
    logger.error("Error generating complete post", error instanceof Error ? error : undefined, {
      params,
    });
    return {
      result: "",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

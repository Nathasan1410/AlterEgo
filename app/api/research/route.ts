// Research API - Tavily Web Search
import { NextRequest, NextResponse } from "next/server";
import { searchTopic, getTrendingNews, getPostContext } from "@/src/lib/tavily-client";
import { createResponse, createErrorResponse } from "@/src/utils/apiResponse";
import { validateRequest } from "@/src/utils/validation";
import { ResearchInputSchema } from "@/src/schemas/generation";
import { ERROR_CODES } from "@/src/lib/constants";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    const validated = validateRequest(ResearchInputSchema, body);
    if (!validated.success) {
      return NextResponse.json(
        createResponse(null, { code: ERROR_CODES.VALIDATION_ERROR, message: validated.error! }, 0),
        { status: 400 }
      );
    }

    const validatedData = validated.data;
    const type = validatedData.type || "search";
    const query = validatedData.query;
    const industry = validatedData.industry;

    console.log("[Research] Type:", type, "Query:", query || industry);

    let result;

    switch (type) {
      case "trending":
        result = await getTrendingNews(industry || query || "");
        break;
      case "context":
        const context = await getPostContext(query || "");
        result = { context, query: query || "" };
        break;
      case "search":
      default:
        result = await searchTopic(query || "", 5);
        break;
    }

    console.log("[Research] Found", result.results?.length || 0, "results");

    return NextResponse.json(createResponse(result, undefined, Date.now() - startTime));
  } catch (error) {
    console.error("Research error:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to fetch research",
        ERROR_CODES.API_ERROR
      ),
      { status: 500 }
    );
  }
}

// Research API - Tavily Web Search
import { NextRequest, NextResponse } from "next/server";
import { searchTopic, getTrendingNews, getPostContext } from "@/src/lib/tavily-client";
import { createResponse } from "@/src/utils/apiResponse";
import { validateRequest } from "@/src/utils/validation";
import { ResearchInputSchema } from "@/src/schemas/generation";
import { handleError } from "@/src/utils/errorHandler";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    const validated = validateRequest(ResearchInputSchema, body);
    if (!validated.success) {
      return NextResponse.json(
        createResponse(null, { code: "VALIDATION_ERROR", message: validated.error! }, 0),
        { status: 400 }
      );
    }

    const validatedData = validated.data;
    const type = validatedData.type || "search";
    const query = validatedData.query;
    const industry = validatedData.industry;

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

    return NextResponse.json(createResponse(result, undefined, Date.now() - startTime));
  } catch (error) {
    return handleError(error);
  }
}

// Style Analysis API - Extract user's writing DNA
import { NextRequest, NextResponse } from "next/server";
import { analyzeUserStyle, generateStylePrompt } from "@/src/lib/style-analyzer";
import { createResponse, createErrorResponse } from "@/src/utils/apiResponse";
import { validateRequest } from "@/src/utils/validation";
import { StyleAnalysisInputSchema } from "@/src/schemas/generation";
import { ERROR_CODES } from "@/src/lib/constants";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    const validated = validateRequest(StyleAnalysisInputSchema, body);
    if (!validated.success) {
      return NextResponse.json(
        createResponse(null, { code: ERROR_CODES.VALIDATION_ERROR, message: validated.error! }, 0),
        { status: 400 }
      );
    }

    const validatedData = validated.data;
    const postsArray = validatedData.posts;
    console.log("[Style Analysis] Analyzing", postsArray.length, "posts");

    // Analyze user's writing style
    const styleProfile = await analyzeUserStyle(postsArray);

    // Generate the style injection prompt
    const stylePrompt = generateStylePrompt(styleProfile);

    console.log("[Style Analysis] Profile extracted:", styleProfile.tone);

    return NextResponse.json(
      createResponse({ profile: styleProfile, stylePrompt }, undefined, Date.now() - startTime)
    );
  } catch (error) {
    console.error("Style analysis error:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to analyze style",
        ERROR_CODES.API_ERROR
      ),
      { status: 500 }
    );
  }
}

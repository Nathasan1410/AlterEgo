// Style Analysis API - Extract user's writing DNA
import { NextRequest, NextResponse } from "next/server";
import { analyzeUserStyle, generateStylePrompt } from "@/src/lib/style-analyzer";
import { createResponse } from "@/src/utils/apiResponse";
import { validateRequest } from "@/src/utils/validation";
import { StyleAnalysisInputSchema } from "@/src/schemas/generation";
import { handleError } from "@/src/utils/errorHandler";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    const validated = validateRequest(StyleAnalysisInputSchema, body);
    if (!validated.success) {
      return NextResponse.json(
        createResponse(null, { code: "VALIDATION_ERROR", message: validated.error! }, 0),
        { status: 400 }
      );
    }

    const validatedData = validated.data;
    const postsArray = validatedData.posts;

    // Analyze user's writing style
    const styleProfile = await analyzeUserStyle(postsArray);

    // Generate style injection prompt
    const stylePrompt = generateStylePrompt(styleProfile);

    return NextResponse.json(
      createResponse({ profile: styleProfile, stylePrompt }, undefined, Date.now() - startTime)
    );
  } catch (error) {
    return handleError(error);
  }
}

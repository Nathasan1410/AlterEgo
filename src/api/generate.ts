/**
 * Modular API Handler for Generation
 * Replaces legacy route with orchestrator-based logic
 */

import { NextRequest, NextResponse } from "next/server";
import { getOrchestrator } from "../services/orchestration";
import {
  createResponse,
  createValidationErrorResponse,
  createErrorResponse,
} from "../utils/apiResponse";
import { validateRequest, formatZodError } from "../utils/validation";
import {
  TopicInputSchema,
  HookInputSchema,
  BodyInputSchema,
  CTAInputSchema,
  PolishInputSchema,
  CompleteInputSchema,
} from "../schemas/generation";
import { ERROR_CODES } from "../lib/constants";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { type } = body;

    if (!type) {
      return NextResponse.json(
        createValidationErrorResponse("type", "Generation type is required"),
        { status: 400 }
      );
    }

    const orchestrator = getOrchestrator();

    switch (type) {
      case "topics": {
        const validated = validateRequest(TopicInputSchema, body);
        if (!validated.success) {
          return NextResponse.json(
            createResponse(
              null,
              { code: ERROR_CODES.VALIDATION_ERROR, message: validated.error! },
              0
            ),
            { status: 400 }
          );
        }
        const result = await orchestrator.generateTopics(validated.data);
        return NextResponse.json(
          createResponse({ result, options: result }, undefined, Date.now() - startTime)
        );
      }

      case "hooks": {
        const validated = validateRequest(HookInputSchema, body);
        if (!validated.success) {
          return NextResponse.json(
            createResponse(
              null,
              { code: ERROR_CODES.VALIDATION_ERROR, message: validated.error! },
              0
            ),
            { status: 400 }
          );
        }
        const result = await orchestrator.generateHooks(validated.data);
        return NextResponse.json(
          createResponse({ result, options: result }, undefined, Date.now() - startTime)
        );
      }

      case "body": {
        const validated = validateRequest(BodyInputSchema, body);
        if (!validated.success) {
          return NextResponse.json(
            createResponse(
              null,
              { code: ERROR_CODES.VALIDATION_ERROR, message: validated.error! },
              0
            ),
            { status: 400 }
          );
        }
        const result = await orchestrator.generateBody(validated.data);
        return NextResponse.json(
          createResponse({ result, options: result }, undefined, Date.now() - startTime)
        );
      }

      case "cta": {
        const validated = validateRequest(CTAInputSchema, body);
        if (!validated.success) {
          return NextResponse.json(
            createResponse(
              null,
              { code: ERROR_CODES.VALIDATION_ERROR, message: validated.error! },
              0
            ),
            { status: 400 }
          );
        }
        const result = await orchestrator.generateCTA(validated.data);
        return NextResponse.json(
          createResponse({ result, options: result }, undefined, Date.now() - startTime)
        );
      }

      case "polish": {
        const validated = validateRequest(PolishInputSchema, body);
        if (!validated.success) {
          return NextResponse.json(
            createResponse(
              null,
              { code: ERROR_CODES.VALIDATION_ERROR, message: validated.error! },
              0
            ),
            { status: 400 }
          );
        }
        const polishRes = await orchestrator.polishContent(validated.data);
        const result = {
          polished: polishRes.content,
          scores: polishRes.scores,
        };
        return NextResponse.json(createResponse(result, undefined, Date.now() - startTime));
      }

      case "complete": {
        const validated = validateRequest(CompleteInputSchema, body);
        if (!validated.success) {
          return NextResponse.json(
            createResponse(
              null,
              { code: ERROR_CODES.VALIDATION_ERROR, message: validated.error! },
              0
            ),
            { status: 400 }
          );
        }
        const completeRes = await orchestrator.generateCompletePost(validated.data.topic, {
          intent: validated.data.intent,
          length: validated.data.length,
          tone: validated.data.tone,
          emojiDensity: validated.data.emojiDensity,
          language: validated.data.language,
        });
        const result = {
          result: completeRes.result,
          scores: completeRes.scores,
        };
        return NextResponse.json(createResponse(result, undefined, Date.now() - startTime));
      }

      default:
        return NextResponse.json(
          createValidationErrorResponse("type", `Invalid generation type: ${type}`),
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Modular API Error:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Unknown error",
        ERROR_CODES.GENERATION_ERROR
      ),
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "CommitToCareer AI API (Modular)",
    version: "3.0.0",
    timestamp: new Date().toISOString(),
  });
}

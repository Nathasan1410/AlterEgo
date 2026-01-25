// app/api/generate/route.ts
// API Route with Opik Tracing for LinkedIn Post Generation

import { NextRequest, NextResponse } from 'next/server';
import {
  generateTopics,
  generateHooks,
  generateBody,
  generateCTA,
  generateFinal,
  generateCompletePost,
  polishPostContent
} from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type, // 'topics', 'hooks', 'body', 'cta', 'polish', 'complete'
      input, // Main input (topic, hook, body, etc.)
      context, // Additional context (e.g., topic for body gen)
      intent = 'viral',
      length = 'medium',
      tone = 5,
      emojiDensity = 5, // api-client sends emojiDensity, service uses emojiLevel (string) or number
      emojiLevel, // fallback
      language = 'id',
      ctaType = 'value',
      styleProfile, // Ultra-Personalization
      researchDepth = 3,
      researchContext // Tavily Research
    } = body;

    // Normalize emoji level
    const finalEmojiLevel = emojiLevel || emojiDensity || 'moderate';

    console.log(`[API] Generating ${type}...`, { input: input?.substring(0, 50) });

    let result;

    switch (type) {
      case 'topics':
        result = await generateTopics(input, researchDepth);
        break;

      case 'hooks':
        result = await generateHooks(input, intent);
        break;

      case 'body':
        // input = hook, context = topic
        result = await generateBody(
          input,
          context || '',
          intent,
          length,
          tone,
          finalEmojiLevel,
          language,
          styleProfile, // Pass style profile
          researchContext // Pass research context
        );
        break;

      case 'cta':
        // input = body
        result = await generateCTA(input, intent);
        break;

      case 'polish':
        // input = full content
        result = await polishPostContent(
          input || body.content, // handle both
          tone,
          typeof finalEmojiLevel === 'number' ? finalEmojiLevel : 5,
          language
        );
        break;

      case 'final':
        // Old action, kept for compatibility if needed
        result = await generateFinal(body.hook, body.selectedBody, body.topic, ctaType);
        break;

      case 'complete':
        result = await generateCompletePost(input, {
          intent, length, tone, emojiLevel: finalEmojiLevel, language, ctaType
        });
        break;

      default:
        return NextResponse.json(
          { error: `Invalid generation type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result: result,
      options: Array.isArray(result) ? result : undefined // For client compatibility
    });

  } catch (error) {
    console.error('API Generation Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'AlterEgo AI API',
    version: '2.0.0',
    opik: process.env.OPIK_API_KEY ? 'configured' : 'missing'
  });
}

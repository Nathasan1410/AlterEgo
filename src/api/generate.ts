/**
 * Modular API Handler for Generation
 * Replaces the legacy route with orchestrator-based logic
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrchestrator } from '../services/orchestration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, // 'topics', 'hooks', 'body', 'cta', 'polish', 'complete'
      input,
      context, 
      intent,
      length,
      tone,
      emojiDensity,
      emojiLevel,
      language,
      styleProfile,
      researchDepth,
      researchContext
    } = body;

    const orchestrator = getOrchestrator();
    const finalEmojiLevel = emojiLevel || emojiDensity || 'moderate';

    let result;

    switch (type) {
      case 'topics':
        result = await orchestrator.generateTopics({ 
          idea: input, 
          researchDepth 
        });
        break;

      case 'hooks':
        result = await orchestrator.generateHooks({ 
          topic: input, 
          intent 
        });
        break;

      case 'body':
        // input = hook, context = topic
        result = await orchestrator.generateBody({
          hook: input,
          topic: context || '',
          intent,
          length,
          tone,
          emojiLevel: finalEmojiLevel,
          language,
          styleProfile,
          researchContext
        });
        break;

      case 'cta':
        // input = body
        result = await orchestrator.generateCTA({
          body: input,
          intent
        });
        break;

      case 'polish':
        const polishRes = await orchestrator.polishContent({
          content: input,
          tone: tone || 5,
          emojiDensity: typeof finalEmojiLevel === 'number' ? finalEmojiLevel : 5,
          language: language || 'id'
        });
        // Match api-client expectation: { polished: string, scores: any[] }
        result = { 
          polished: polishRes.content, 
          scores: polishRes.scores 
        };
        break;

      case 'complete':
        const completeRes = await orchestrator.generateCompletePost(input, {
          intent, length, tone, emojiDensity: finalEmojiLevel, language
        });
        // completeRes is { result: string, scores: any[] }
        // We return it directly as result, or flatten it?
        // api-client expects: data.result to be the string?
        // If we return { result: completeRes }, then data.result = { result: "...", scores: ... }
        // Let's flatten for clarity if needed, or keep structure.
        // Legacy api-client expects data.result to be string.
        // Let's return result as string, and attach scores elsewhere?
        // No, let's update api-client later if needed. For now, mimic legacy behavior.
        // Legacy: { result: "string" }
        // New: { result: "string", scores: [] } (top level)
        
        // Let's return payload
        return NextResponse.json({
          success: true,
          result: completeRes.result,
          scores: completeRes.scores
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
      options: Array.isArray(result) ? result : undefined 
    });

  } catch (error) {
    console.error('Modular API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    service: 'CommitToCareer AI API (Modular)',
    version: '3.0.0',
    timestamp: new Date().toISOString()
  });
}

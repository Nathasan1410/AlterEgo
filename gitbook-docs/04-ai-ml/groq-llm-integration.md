# Groq LLM Integration

## Overview

AlterEgo uses Groq's fast inference API for AI content generation, powered by Meta's Llama 3.3 70B model.

## Why Groq?

- **Speed**: Sub-second inference (10-100x faster than competitors)
- **Quality**: State-of-the-art open-source LLM
- **Cost**: Affordable, predictable pricing
- **Open Source**: Transparent, customizable model
- **Scalability**: Handle concurrent requests efficiently

## Model Details

| Property | Value |
|----------|-------|
| Model | Llama 3.3 70B |
| Provider | Groq |
| API Endpoint | `https://api.groq.com/openai/v1/chat/completions` |
| Context Window | 128K tokens |
| Max Tokens | 4096 tokens per request |
| Supported Languages | 100+ (including Indonesian and English) |

## Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│            Application Layer                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │  API Routes (/api/generate)                     │   │
│  └───────────────┬──────────────────────────────────┘   │
└──────────────────┼──────────────────────────────────────┘
                   │
┌──────────────────┼──────────────────────────────────────┐
│         Orchestrator Layer                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │  GroqAdapter (Adapter Pattern)                │   │
│  │  - Interface Implementation                    │   │
│  │  - Request/Response Handling                  │   │
│  │  - Error Handling                            │   │
│  └───────────────┬──────────────────────────────────┘   │
└──────────────────┼──────────────────────────────────────┘
                   │
┌──────────────────┼──────────────────────────────────────┐
│         Adapter Layer                                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Groq SDK Client                               │   │
│  │  - HTTP Client                                 │   │
│  │  - Retry Logic                                 │   │
│  │  - Timeout Handling                             │   │
│  └───────────────┬──────────────────────────────────┘   │
└──────────────────┼──────────────────────────────────────┘
                   │
┌──────────────────┼──────────────────────────────────────┐
│         External API                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Groq API                                     │   │
│  │  - Chat Completions Endpoint                  │   │
│  │  - Model: llama-3.3-70b-versatile          │   │
│  └──────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

## Implementation

### GroqAdapter

Location: `src/services/adapters/groqAdapter.ts`

```typescript
import { Groq } from "groq-sdk";
import { PromptBuilder } from "../prompts/promptBuilder";
import { IModelAdapter } from "./interfaces";
import { JSONParser } from "../../utils/jsonParser";
import { logger } from "../../utils/logger";
import type {
  GeneratedOption,
  TopicInput,
  HookInput,
  BodyInput,
  CTAInput,
  PolishInput,
  TraceContext,
} from "../../models/generated";

export class GroqAdapter implements IModelAdapter {
  readonly name = "Groq";
  readonly version = "llama-3.3-70b-versatile";

  private client: Groq;
  private model: string;

  constructor(apiKey: string, model: string = "llama-3.3-70b-versatile") {
    this.client = new Groq({ apiKey });
    this.model = model;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.chat.completions.create({
        messages: [{ role: "user", content: "Hi" }],
        model: this.model,
        max_tokens: 1,
      });
      return true;
    } catch {
      return false;
    }
  }

  async generateTopics(input: TopicInput, context?: TraceContext): Promise<GeneratedOption[]> {
    const prompt = PromptBuilder.buildTopicsPrompt(input);
    return this.generateWithFallback(prompt, 6);
  }

  async generateHooks(input: HookInput, context?: TraceContext): Promise<GeneratedOption[]> {
    const prompt = PromptBuilder.buildHooksPrompt(input);
    return this.generateWithFallback(prompt, 3);
  }

  async generateBody(input: BodyInput, context?: TraceContext): Promise<GeneratedOption[]> {
    const prompt = PromptBuilder.buildBodyPrompt(input);
    return this.generateWithFallback(prompt, 2);
  }

  async generateCTA(input: CTAInput, context?: TraceContext): Promise<GeneratedOption[]> {
    const prompt = PromptBuilder.buildCTAPrompt(input);
    return this.generateWithFallback(prompt, 4);
  }

  async polishContent(
    input: PolishInput,
    context?: TraceContext
  ): Promise<{ content: string; scores?: any[] }> {
    const prompt = PromptBuilder.buildPolishPrompt(input);

    try {
      const completion = await this.client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: this.model,
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content || input.content;
      return { content };
    } catch (error) {
      logger.error("Polish error", error instanceof Error ? error : undefined, { input });
      return { content: input.content };
    }
  }

  // Helper method with robust JSON parsing
  private async generateWithFallback(
    prompt: string,
    expectedCount: number
  ): Promise<GeneratedOption[]> {
    try {
      const completion = await this.client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: this.model,
        temperature: 0.8,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content || "[]";
      return JSONParser.parseGeneratedContent(content, "array");
    } catch (error) {
      logger.error("Generation error", error instanceof Error ? error : undefined, {
        prompt,
        expectedCount,
      });
      return Array(expectedCount)
        .fill(null)
        .map((_, i) => ({
          content: `Option ${String.fromCharCode(65 + i)} (Fallback)`,
          score: 70,
          reasoning: "Fallback due to error",
        }));
    }
  }
}
```

### Prompt Engineering

Location: `src/services/prompts/promptTemplates.ts`

```typescript
export const PROMPT_TEMPLATES = {
  TOPICS: `
Generate 6 engaging LinkedIn post topics based on: "{{idea}}".
Research Depth: {{researchDepth}} (1=Simple, 5=Deep Dive)

Return ONLY valid JSON array:
[
  { "content": "Topic text", "score": 90, "reasoning": "Why this works" }
]
`,

  HOOKS: `
Write 3 distinct, high-engagement "Hooks" (opening lines) for a post about: "{{topic}}".
Intent: {{intent}}

RULES:
1. Styles: Storytelling, Educational, Promotional, Viral
2. Keep it punchy and scroll-stopping.

Return ONLY valid JSON array:
[
  { "content": "Hook text", "score": 85, "reasoning": "Why this hook works" }
]
`,

  BODY: `
You are a LinkedIn Ghostwriter. Write the MAIN BODY for a LinkedIn post.
Hook: "{{hook}}"
Topic: "{{topic}}"
Length: {{length}}
Tone: {{tone}}/10
Style Context: {{styleProfile}}
Research Context: {{researchContext}}

CRITICAL INSTRUCTIONS:
1. Return a JSON ARRAY of exactly 2 objects
2. Each object MUST have three fields: "content", "score", "reasoning"
3. The "content" field MUST contain the FULL POST BODY TEXT (3-5 sentences minimum, actual post content)
4. The "score" field MUST be a number between 1-100
5. The "reasoning" field MUST be a brief explanation (10-20 words) of why this body works
6. DO NOT put the reasoning text in the content field
7. DO NOT put a number in the content field
8. The content must be actual post content, not a description or summary

Correct Format:
[
  {
    "content": "The full post body text goes here. Write actual engaging content that readers would see in a LinkedIn post. Multiple sentences with valuable insights and clear narrative.",
    "score": 88,
    "reasoning": "Strong opening hook maintains reader interest throughout the narrative"
  },
  {
    "content": "Another distinct body variation here. Different approach or angle on the same topic. Engaging and valuable content for LinkedIn audience.",
    "score": 92,
    "reasoning": "Clear value proposition with actionable insights for professionals"
  }
]
`,

  CTA: `
Generate 4 distinct Call-to-Actions (CTAs) for this post body:
"{{bodyExcerpt}}..."
Intent: {{intent}}

Types: Engagement (Question), Value (Offer), Debate, Soft Sell.

Return ONLY valid JSON array:
[
  { "content": "CTA text", "score": 82, "reasoning": "Conversion power" }
]
`,

  POLISH: `
Polish this LinkedIn post.
Content:
{{content}}

Instructions:
Tone: {{tone}}/10
Emoji Density: {{emojiDensity}}
Language: {{language}}

- Fix grammar and flow.
- Improve readability with line breaks.
- Add 3 relevant hashtags at the bottom.

Return ONLY the final polished text string.
`,
};
```

### Request/Response Handling

**Request Structure:**
```typescript
interface GroqRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  response_format?: { type: 'json_object' | 'text' };
}
```

**Response Structure:**
```typescript
interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

## Performance Optimization

### Caching Strategy

The orchestrator implements caching at the orchestration layer:

```typescript
private async withCache<T>(key: string, generator: () => Promise<T>): Promise<T> {
  if (!this.cacheAdapter) return generator();

  const cached = await this.cacheAdapter.get<T>(key);
  if (cached) {
    return cached;
  }

  const result = await generator();
  await this.cacheAdapter.set(key, result);
  return result;
}
```

### Fallback Mechanism

When generation fails, the adapter returns fallback options:

```typescript
private async generateWithFallback(
  prompt: string,
  expectedCount: number
): Promise<GeneratedOption[]> {
  try {
    // Try to generate
    const completion = await this.client.chat.completions.create({...});
    return JSONParser.parseGeneratedContent(content, "array");
  } catch (error) {
    // Return fallback options
    return Array(expectedCount)
      .fill(null)
      .map((_, i) => ({
        content: `Option ${String.fromCharCode(65 + i)} (Fallback)`,
        score: 70,
        reasoning: "Fallback due to error",
      }));
  }
}
```

## Error Handling

```typescript
import { GenerationError, APIError } from '../../types/errors';

try {
  const topics = await groqAdapter.generateTopics(input);
} catch (error) {
  if (error instanceof Groq.APIError) {
    throw new APIError(
      'Groq API error',
      error.status,
      'GROQ_API_ERROR'
    );
  }
  throw new GenerationError(
    'Failed to generate topics',
    'GENERATION_FAILED',
    { originalError: error }
  );
}
```

## Best Practices

### Temperature Tuning

- **Topics**: 0.8 (balance creativity and relevance)
- **Hooks**: 0.8 (more creative, attention-grabbing)
- **Body**: 0.8 (more focused, consistent)
- **CTA**: 0.8 (more predictable, actionable)
- **Polish**: 0.7 (refining existing content)

### Token Management

- **Topics**: 200-400 tokens per response
- **Hooks**: 300-500 tokens per response
- **Body**: 800-1500 tokens per response
- **CTA**: 100-200 tokens per response

### Prompt Optimization

- Be specific about requirements
- Provide examples of desired output
- Use clear formatting instructions
- Specify JSON output format
- Include score and reasoning fields

## Monitoring

OPIK AI integration provides real-time monitoring:

- **Request Latency**: Track generation time
- **Token Usage**: Monitor token consumption
- **Error Rate**: Track API failures
- **Quality Metrics**: Monitor output quality

[Learn more about OPIK AI Integration](../06-observability/opik-ai-integration)

## Cost Optimization

- Use caching for repeated prompts
- Batch similar requests
- Optimize token usage
- Monitor free tier limits

## Integration with OPIK AI

All Groq requests are traced with OPIK:

```typescript
async generateTopics(input: TopicInput): Promise<GeneratedOption[]> {
  const trace = this.observabilityAdapter.trace("Generate_Topics", input, {
    tags: ["orchestrator", "topics", "groq"],
  });

  const result = await this.modelAdapter.generateTopics(input);

  trace.end();
  return result;
}
```

## Next Steps

- Learn about [OPIK AI Integration](../06-observability/opik-ai-integration)
- Explore [Prompt Engineering](./prompt-engineering)
- Understand [Model Tuning](./model-tuning)
- See [API Reference](../05-api)

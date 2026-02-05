# Data Flow

## Overview

Understanding the data flow in AlterEgo is crucial for debugging, optimizing performance, and adding new features. This document details how data moves through the system from user input to AI-generated output.

## High-Level Data Flow

```
User Input
    ↓
Frontend (React Components)
    ↓
API Route (Next.js)
    ↓
Validation (Zod Schemas)
    ↓
Orchestrator (Business Logic)
    ↓
OPIK Tracing (Observability)
    ↓
Cache Check (Optional)
    ↓
Adapters (External Services)
    ↓
External APIs (Groq, Tavily, OPIK)
    ↓
Response Processing
    ↓
Quality Evaluation
    ↓
Cache Update (Optional)
    ↓
Response Formatting
    ↓
Frontend Update (React)
```

## Detailed Data Flow by Phase

### Phase 1: User Input

```
┌─────────────────────────────────────────┐
│         User Interface               │
│  ┌───────────────────────────────┐ │
│  │  PostGeneratorWizard.tsx     │ │
│  │                           │ │
│  │  ┌─────────────────────┐   │ │
│  │  │  InputPhase       │   │ │
│  │  │                   │   │ │
│  │  │  [Input Field]     │   │ │
│  │  │  "AI productivity" │   │ │
│  │  └─────────────────────┘   │ │
│  │                           │ │
│  │  [Generate Button]          │ │
│  └───────────────────────────────┘ │
└───────────────┬───────────────────┘
                │
                ↓
        User enters topic
                │
                ↓
        useState("AI productivity")
```

**Data Structures**:

```typescript
interface UserInput {
  input: string;              // User's topic idea
  researchDepth?: number;       // 1-5, how deep to research
  intent?: string;            // "educational", "promotional", etc.
  length?: string;            // "short", "medium", "long"
  tone?: number;              // 1-10, professional to casual
  emojiDensity?: string;       // "none", "low", "medium", "high"
  language?: string;          // "en", "id", etc.
  styleProfile?: any;         // Analyzed user's writing style
}
```

### Phase 2: API Route

```
┌─────────────────────────────────────────┐
│         API Route Handler          │
│  ┌───────────────────────────────┐ │
│  │  app/api/generate/route.ts  │ │
│  │   - Re-exports from src/api  │ │
│  └───────────────────────────────┘ │
└───────────────┬───────────────────┘
                │
                ↓
        POST /api/generate
        Body: {
          type: "topics",
          input: "AI productivity",
          researchDepth: 3
        }
```

**API Request Flow**:

```typescript
// Frontend
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'topics',
    input: 'AI productivity',
    researchDepth: 3
  })
});

const data = await response.json();
```

### Phase 3: Validation

```
┌─────────────────────────────────────────┐
│         Validation Layer          │
│  ┌───────────────────────────────┐ │
│  │  Zod Schemas             │ │
│  │  src/schemas/generation.ts │ │
│  └───────────────────────────────┘ │
└───────────────┬───────────────────┘
                │
                ↓
        Validate Input
                │
        ┌─────────┴─────────┐
        ↓                   ↓
   Valid              Invalid
        ↓                   ↓
   Continue          Return 400 Error
```

**Validation Process**:

```typescript
// src/api/generate.ts
import { TopicInputSchema } from '../schemas/generation';
import { validateRequest } from '../utils/validation';

const validated = validateRequest(TopicInputSchema, body);

if (!validated.success) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: validated.error
      },
      duration: 0
    },
    { status: 400 }
  );
}

// Proceed with validated.data
const { input, researchDepth } = validated.data;
```

**Schema Definition**:

```typescript
// src/schemas/generation.ts
export const TopicInputSchema = z.object({
  input: z.string().min(1, "Input is required").max(500, "Input too long"),
  researchDepth: z.number().min(1).max(5).optional(),
});

export const HookInputSchema = z.object({
  topic: z.string().min(1, "Topic is required").max(200),
  intent: z.string().optional(),
});

export const BodyInputSchema = z.object({
  hook: z.string().min(1, "Hook is required").max(300),
  topic: z.string().min(1, "Topic is required").max(200),
  intent: z.string().optional(),
  length: z.enum(["short", "medium", "long"]).optional(),
  tone: z.number().min(1).max(10).optional(),
  emojiDensity: z.enum(["none", "low", "medium", "high"]).optional(),
  language: z.enum(["en", "id"]).optional(),
  styleProfile: z.any().optional(),
  researchContext: z.string().optional(),
});

export const CTAInputSchema = z.object({
  body: z.string().min(1, "Body is required"),
  intent: z.string().optional(),
});
```

### Phase 4: Orchestration

```
┌─────────────────────────────────────────┐
│    Generation Orchestrator         │
│  ┌───────────────────────────────┐ │
│  │  generationOrchestrator.ts  │ │
│  │  src/services/orchestration/ │ │
│  └───────────────────────────────┘ │
└───────────────┬───────────────────┘
                │
                ↓
    generateTopics(input)
                │
                ↓
    Generate Cache Key
                │
                ↓
    Check Cache
```

**Orchestration Flow**:

```typescript
// src/services/orchestration/generationOrchestrator.ts
async generateTopics(input: TopicInput): Promise<GeneratedOption[]> {
  return this.withCache(this.getCacheKey("topics", input), async () => {
    const trace = this.observabilityAdapter.trace("Generate_Topics", input, {
      tags: ["orchestrator", "topics", "groq"],
    });

    const result = await this.modelAdapter.generateTopics(input);

    trace.end();
    return result;
  });
}

private getCacheKey(prefix: string, input: any): string {
  return `${prefix}:${JSON.stringify(input)}`;
}

private async withCache<T>(
  key: string,
  generator: () => Promise<T>
): Promise<T> {
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

### Phase 5: OPIK Tracing

```
┌─────────────────────────────────────────┐
│         OPIK Adapter              │
│  ┌───────────────────────────────┐ │
│  │  opikAdapter.ts           │ │
│  │  src/services/adapters/    │ │
│  └───────────────────────────────┘ │
└───────────────┬───────────────────┘
                │
                ↓
        Start Trace
                │
                ↓
    Trace: "Generate_Topics"
    - Input: {topic: "AI productivity"}
    - Tags: ["orchestrator", "topics", "groq"]
    - Metadata: {researchDepth: 3}
```

**OPIK Trace Structure**:

```typescript
// Trace Creation
const trace = this.observabilityAdapter.trace(
  "Generate_Topics",  // Trace name
  input,              // Input data
  {
    tags: ["orchestrator", "topics", "groq"],
    metadata: {
      researchDepth: input.researchDepth,
      userId: userId  // If authenticated
    }
  }
);

// During generation
const span = trace.span("Groq_API_Call", "llm");
// ... API call happens
span.end();

// End trace
trace.end({
  output: result,  // Final result
  metadata: {
    optionsGenerated: result.length,
    avgScore: calculateAverageScore(result),
    duration: Date.now() - startTime
  }
});
```

### Phase 6: Adapter Call

```
┌─────────────────────────────────────────┐
│         Groq Adapter               │
│  ┌───────────────────────────────┐ │
│  │  groqAdapter.ts           │ │
│  │  src/services/adapters/    │ │
│  └───────────────────────────────┘ │
└───────────────┬───────────────────┘
                │
                ↓
        Build Prompt
                │
                ↓
        Call Groq API
                │
                ↓
        Parse Response
```

**Groq Adapter Flow**:

```typescript
// src/services/adapters/groqAdapter.ts
async generateTopics(input: TopicInput): Promise<GeneratedOption[]> {
  const prompt = PromptBuilder.buildTopicsPrompt(input);

  try {
    const completion = await this.client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: this.model,  // "llama-3.3-70b-versatile"
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content || "[]";
    return JSONParser.parseGeneratedContent(content, "array");
  } catch (error) {
    // Fallback mechanism
    return Array(6)
      .fill(null)
      .map((_, i) => ({
        content: `Option ${String.fromCharCode(65 + i)} (Fallback)`,
        score: 70,
        reasoning: "Fallback due to error",
      }));
  }
}
```

**Prompt Building**:

```typescript
// src/services/prompts/promptBuilder.ts
export const PROMPT_TEMPLATES = {
  TOPICS: `
Generate 6 engaging LinkedIn post topics based on: "{{idea}}".
Research Depth: {{researchDepth}} (1=Simple, 5=Deep Dive)

Return ONLY valid JSON array:
[
  { "content": "Topic text", "score": 90, "reasoning": "Why this works" }
]
`
};

export class PromptBuilder {
  static buildTopicsPrompt(input: TopicInput): string {
    return PROMPT_TEMPLATES.TOPICS
      .replace("{{idea}}", input.input)
      .replace("{{researchDepth}}", input.researchDepth || 3);
  }
}
```

### Phase 7: External API

```
┌─────────────────────────────────────────┐
│         Groq API                  │
│  ┌───────────────────────────────┐ │
│  │  api.groq.com             │ │
│  │  /openai/v1/chat/completions │ │
│  └───────────────────────────────┘ │
└───────────────┬───────────────────┘
                │
                ↓
        HTTP POST Request
                │
                ↓
        Headers:
        - Authorization: Bearer GROQ_API_KEY
        - Content-Type: application/json
                │
                ↓
        Body:
        {
          "model": "llama-3.3-70b-versatile",
          "messages": [{"role": "user", "content": "..."}],
          "temperature": 0.8,
          "response_format": {"type": "json_object"}
        }
```

**Groq Response**:

```json
{
  "id": "gen-abc123",
  "object": "chat.completion",
  "created": 1709823456,
  "model": "llama-3.3-70b-versatile",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "[\n  {\"content\": \"I wish someone told me this 5 years ago...\", \"score\": 92, \"reasoning\": \"Strong hook\"},\n  {\"content\": \"The AI productivity secret nobody talks about\", \"score\": 88, \"reasoning\": \"Curiosity\"},\n  ...\n]"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 342,
    "total_tokens": 387
  }
}
```

### Phase 8: Response Processing

```
┌─────────────────────────────────────────┐
│         JSON Parser                │
│  ┌───────────────────────────────┐ │
│  │  jsonParser.ts             │ │
│  │  src/utils/                │ │
│  └───────────────────────────────┘ │
└───────────────┬───────────────────┘
                │
                ↓
        Parse JSON
                │
                ↓
        Validate Structure
                │
        ┌─────────┴─────────┐
        ↓                   ↓
    Valid              Invalid
        ↓                   ↓
   Return Array        Fix & Retry
```

**JSON Parsing**:

```typescript
// src/utils/jsonParser.ts
export class JSONParser {
  static parseGeneratedContent(content: string, expectedType: 'array' | 'object'): any {
    try {
      const parsed = JSON.parse(content);

      if (expectedType === 'array' && !Array.isArray(parsed)) {
        throw new Error('Expected array');
      }

      if (expectedType === 'object' && typeof parsed !== 'object') {
        throw new Error('Expected object');
      }

      return parsed;
    } catch (error) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        return JSONParser.parseGeneratedContent(jsonMatch[1], expectedType);
      }

      // Return fallback
      return expectedType === 'array' ? [] : {};
    }
  }
}
```

### Phase 9: Quality Evaluation

```
┌─────────────────────────────────────────┐
│       Evaluators                   │
│  ┌───────────────────────────────┐ │
│  │  evaluators/index.ts        │ │
│  │  src/evaluators/           │ │
│  └───────────────────────────────┘ │
└───────────────┬───────────────────┘
                │
                ↓
    Evaluate Content
                │
        ┌─────────┴─────────┐
        ↓                   ↓
   Virality          Engagement
   Score              Score
        ↓                   ↓
        └─────────┬─────────┘
                  ↓
            Combine Scores
                  ↓
            Log to OPIK
```

**Quality Evaluation**:

```typescript
// src/evaluators/index.ts
export const evaluateVirality = (content: string): EvaluationResult => {
  let score = 0.3; // Base score

  const firstLine = content.split("\n")[0] || "";
  const hasHook = firstLine.length < 100 && firstLine.length > 10;
  const hasNumbers = /\d+/.test(content);
  const hasEmoji = /[\u{1F600}-\u{1F64F}]/u.test(content);
  const hasCTA = /comment|share|follow|agree|thoughts/i.test(content);
  const hasStory = /I |my |when I|years ago/i.test(content);

  if (hasHook) score += 0.2;
  if (hasNumbers) score += 0.1;
  if (hasEmoji) score += 0.05;
  if (hasCTA) score += 0.15;
  if (hasStory) score += 0.2;

  return {
    metricName: "Virality Prediction",
    score: Math.min(score, 1),
    reasoning: `Hook strength, storytelling elements, and call-to-action presence`,
  };
};

export const evaluateEngagement = (content: string): EvaluationResult => {
  let score = 0.4;

  const hasQuestion = content.includes("?");
  const hasControversial = /but |however|disagree|unpopular/i.test(content);
  const hasValue = /tip|learn|secret|mistake|how to/i.test(content);
  const endsWithQuestion = content.trim().endsWith("?");

  if (hasQuestion) score += 0.15;
  if (hasControversial) score += 0.15;
  if (hasValue) score += 0.2;
  if (endsWithQuestion) score += 0.1;

  return {
    metricName: "Engagement Potential",
    score: Math.min(score, 1),
    reasoning: `Questions, value propositions, and conversational triggers`,
  };
};

// Used in orchestrator
const scores = await evaluateContent(result.content);
this.observabilityAdapter.logEvaluation(input, result.content, scores);
```

### Phase 10: Cache Update

```
┌─────────────────────────────────────────┐
│         Cache                      │
│  ┌───────────────────────────────┐ │
│  │  simpleCache.ts            │ │
│  │  src/cache/                │ │
│  └───────────────────────────────┘ │
└───────────────┬───────────────────┘
                │
                ↓
        Store Result
                │
                ↓
    Key: "topics:{"input":"AI productivity","researchDepth":3}"
    Value: [...]
    TTL: 3600 (1 hour)
```

**Cache Implementation**:

```typescript
// src/cache/simpleCache.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  async set<T>(key: string, data: T, ttl: number = 3600): Promise<void> {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl * 1000, // Convert to milliseconds
    });
  }
}
```

### Phase 11: Response Formatting

```
┌─────────────────────────────────────────┐
│     API Response Builder          │
│  ┌───────────────────────────────┐ │
│  │  apiResponse.ts             │ │
│  │  src/utils/                │ │
│  └───────────────────────────────┘ │
└───────────────┬───────────────────┘
                │
                ↓
        Format Response
                │
                ↓
    {
      success: true,
      data: {result: [...]},
      error: null,
      duration: 1245
    }
```

**Response Builder**:

```typescript
// src/utils/apiResponse.ts
export function createResponse<T>(
  data: T,
  error: { code: string; message: string } | null,
  duration: number
): ApiResponse<T> {
  return {
    success: !error,
    data,
    error,
    duration,
  };
}

export function createValidationErrorResponse(
  field: string,
  message: string
): ApiResponse<null> {
  return createResponse(
    null,
    {
      code: 'VALIDATION_ERROR',
      message: `Validation failed for field '${field}': ${message}`
    },
    0
  );
}
```

### Phase 12: Frontend Update

```
┌─────────────────────────────────────────┐
│         React State                │
│  ┌───────────────────────────────┐ │
│  │  usePostGeneration.ts      │ │
│  │  src/hooks/                │ │
│  └───────────────────────────────┘ │
└───────────────┬───────────────────┘
                │
                ↓
        Update State
                │
                ↓
    setTopics(result)
                │
                ↓
        Re-render UI
```

**State Update**:

```typescript
// src/hooks/usePostGeneration.ts
export function usePostGeneration() {
  const [topics, setTopics] = useState<GeneratedOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTopics = async (input: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'topics',
          input,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTopics(data.data.result);
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError('Failed to generate topics');
    } finally {
      setLoading(false);
    }
  };

  return { topics, loading, error, generateTopics };
}
```

## Error Flow

### When Errors Occur

```
Error Detected (e.g., Groq API timeout)
    ↓
┌─────────────────────────────────────┐
│  Adapter Error Handler         │
│  src/adapters/groqAdapter.ts   │
└───────────────┬─────────────────┘
                │
                ↓
        Log to OPIK
                │
                ↓
        Generate Fallback
                │
                ↓
    Return Fallback Data
                │
                ↓
┌─────────────────────────────────────┐
│  Orchestrator                 │
└───────────────┬─────────────────┘
                │
                ↓
    End Trace with Error
                │
                ↓
    Return to API
                │
                ↓
┌─────────────────────────────────────┐
│  API Route                    │
└───────────────┬─────────────────┘
                │
                ↓
    Return 500 or Fallback
                │
                ↓
┌─────────────────────────────────────┐
│  Frontend                    │
└───────────────┬─────────────────┘
                │
                ↓
    Show Error Message
```

**Error Handling**:

```typescript
try {
  const result = await groqAdapter.generateTopics(input);
  trace.end({ output: result });
  return result;
} catch (error) {
  // Log to OPIK
  trace.end({
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    }
  });

  // Generate fallback
  const fallback = generateFallbackOptions();

  // Log fallback usage
  logger.warn('Using fallback options', { originalError: error });

  return fallback;
}
```

## Complete Generation Flow

```
User: "Generate a post about AI productivity"
    ↓
[Frontend] PostGeneratorWizard shows InputPhase
    ↓
[Frontend] User enters topic, clicks "Generate"
    ↓
[API] POST /api/generate with {type: "complete", topic: "AI productivity"}
    ↓
[Validation] Zod validates input
    ↓
[Orchestrator] generateCompletePost() called
    ↓
[OPIK] Trace started: "Generate_Complete_Post"
    ↓
[Orchestrator] generateHooks() called
    ↓
[OPIK] Span: "Generate_Hooks"
    ↓
[Adapter] GroqAdapter.generateHooks()
    ↓
[Groq API] LLM generates hooks
    ↓
[Adapter] Parse and return hooks
    ↓
[OPIK] Span ended, evaluation logged
    ↓
[Orchestrator] generateBody() called
    ↓
[OPIK] Span: "Generate_Body"
    ↓
[Adapter] GroqAdapter.generateBody()
    ↓
[Groq API] LLM generates body
    ↓
[Adapter] Parse and return body
    ↓
[OPIK] Span ended, evaluation logged
    ↓
[Orchestrator] generateCTA() called
    ↓
[OPIK] Span: "Generate_CTA"
    ↓
[Adapter] GroqAdapter.generateCTA()
    ↓
[Groq API] LLM generates CTAs
    ↓
[Adapter] Parse and return CTAs
    ↓
[OPIK] Span ended, evaluation logged
    ↓
[Orchestrator] polishContent() called
    ↓
[OPIK] Span: "Polish_Content"
    ↓
[Adapter] GroqAdapter.polishContent()
    ↓
[Groq API] LLM polishes content
    ↓
[Evaluators] Evaluate quality
    ↓
[OPIK] Evaluation logged, Span ended
    ↓
[OPIK] Main trace ended
    ↓
[API] Return {success: true, data: {result: "...", scores: [...]}}
    ↓
[Frontend] Update state, show ResultPhase
    ↓
[UI] Display generated post with quality scores
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    User Flow                          │
│                                                        │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐   │
│  │   Phase   │ --> │   Phase   │ --> │   Phase   │   │
│  │     1     │     │     2     │     │     3     │   │
│  │  Input    │     │  Generate  │     │  Select   │   │
│  └──────────┘     └──────────┘     └──────────┘   │
│                                                        │
│              (Data flows through API)                      │
│                                                        │
│  ┌──────────────────────────────────────────┐            │
│  │         Backend Flow               │            │
│  │                                      │            │
│  │  [API Route]                         │            │
│  │       ↓                              │            │
│  │  [Validation]                       │            │
│  │       ↓                              │            │
│  │  [Orchestrator]                    │            │
│  │       ↓                              │            │
│  │  [OPIK Trace]                      │            │
│  │       ↓                              │            │
│  │  [Cache Check] → (miss)            │            │
│  │       ↓                              │            │
│  │  [Groq Adapter]                    │            │
│  │       ↓                              │            │
│  │  [Groq API]                       │            │
│  │       ↓                              │            │
│  │  [Response Processing]               │            │
│  │       ↓                              │            │
│  │  [Quality Evaluation]               │            │
│  │       ↓                              │            │
│  │  [OPIK Log]                       │            │
│  │       ↓                              │            │
│  │  [Cache Store]                     │            │
│  │       ↓                              │            │
│  │  [Response Format]                 │            │
│  │                                      │            │
│  └──────────────────────────────────────────┘            │
│                                                        │
└──────────────────────────────────────────────────────────────┘
```

## Summary

AlterEgo's data flow is:

- ✅ **Linear**: Clear, predictable flow
- ✅ **Validated**: Multiple validation layers
- ✅ **Observable**: OPIK tracing throughout
- ✅ **Cached**: Intelligent caching strategy
- ✅ **Fault-Tolerant**: Fallback mechanisms
- ✅ **Evaluated**: Quality metrics at each step
- ✅ **Performant**: Optimized for speed

This data flow ensures reliability, quality, and performance—key factors for a winning hackathon submission.

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI**

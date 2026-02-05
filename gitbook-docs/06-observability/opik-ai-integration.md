# OPIK AI Integration Guide

## Overview

This guide explains how to integrate OPIK AI into AlterEgo for AI observability, quality monitoring, and debugging.

## Prerequisites

- **OPIK API Key**: Get from [OPIK Console](https://console.opik.ai/)
- **Node.js 18+**: Required for OPIK SDK
- **Project Setup**: AlterEgo project initialized

## Installation

### Install OPIK SDK

```bash
npm install opik
```

Already included in `package.json`:

```json
{
  "dependencies": {
    "opik": "^1.0.0"
  }
}
```

## Configuration

### Environment Variables

Add to `.env`:

```env
OPIK_API_KEY=your_opik_api_key_here
OPIK_WORKSPACE=default
```

### Initialize OPIK Client

Location: `src/lib/opik-client.ts`

```typescript
// lib/opik-client.ts
import { Opik } from "opik";

// Singleton instance
let opikInstance: Opik | null = null;

export const getOpikClient = (): Opik => {
  if (!opikInstance) {
    if (!process.env.OPIK_API_KEY) {
      console.warn("OPIK_API_KEY not set - using Opik with defaults");
    }

    opikInstance = new Opik({
      apiKey: process.env.OPIK_API_KEY,
      projectName: "commit-to-career",
    });
  }
  return opikInstance;
};

// Flush all pending traces
export const flushOpik = async () => {
  if (opikInstance) {
    await opikInstance.flush();
  }
};
```

## Architecture Integration

### Adapter Pattern Implementation

Location: `src/services/adapters/opikAdapter.ts`

```typescript
// services/adapters/opikAdapter.ts
import { Opik } from "opik";
import { IObservabilityAdapter, ITrace, ISpan } from "./interfaces";

export class OpikAdapter implements IObservabilityAdapter {
  readonly projectName: string;
  private client: Opik;

  constructor(apiKey: string, projectName: string) {
    this.projectName = projectName;
    this.client = new Opik({
      apiKey,
      projectName,
    });
  }

  trace(name: string, input: any, options?: { tags?: string[]; metadata?: any }): ITrace {
    const traceInstance = this.client.trace({
      name,
      input,
      tags: options?.tags,
      metadata: options?.metadata,
    });

    return {
      id: "trace-id-placeholder",
      span: (spanName: string, type: string = "general", spanInput?: any): ISpan => {
        const spanInstance = traceInstance.span({
          name: spanName,
          type: type as any,
          input: spanInput,
        });

        return {
          id: "span-id-placeholder",
          end: () => spanInstance.end(),
        };
      },
      end: () => traceInstance.end(),
    };
  }

  logEvaluation(input: any, output: any, evaluations: any[], traceId?: string): void {
    this.client.trace({
      name: "Evaluation",
      input: { original_input: input, output },
      output: evaluations,
      tags: ["evaluation"],
    });
  }

  async flush(): Promise<void> {
    await this.client.flush();
  }
}
```

### Orchestration Integration

Location: `src/services/orchestration/generationOrchestrator.ts`

```typescript
// services/orchestration/generationOrchestrator.ts
export class GenerationOrchestrator {
  private modelAdapter: IModelAdapter;
  private researchAdapter: IResearchAdapter;
  private observabilityAdapter: IObservabilityAdapter;
  private cacheAdapter?: ICacheAdapter;

  constructor(
    modelAdapter: IModelAdapter,
    researchAdapter: IResearchAdapter,
    observabilityAdapter: IObservabilityAdapter,
    cacheAdapter?: ICacheAdapter
  ) {
    this.modelAdapter = modelAdapter;
    this.researchAdapter = researchAdapter;
    this.observabilityAdapter = observabilityAdapter;
    this.cacheAdapter = cacheAdapter;
  }

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

  async generateBody(input: BodyInput): Promise<GeneratedOption[]> {
    return this.withCache(this.getCacheKey("body", input), async () => {
      const trace = this.observabilityAdapter.trace("Generate_Body", input, {
        tags: ["orchestrator", "body", "groq"],
        metadata: {
          length: input.length,
          tone: input.tone,
          language: input.language
        }
      });

      const result = await this.modelAdapter.generateBody(input);

      trace.end();
      return result;
    });
  }

  async polishContent(input: PolishInput): Promise<{ content: string; scores?: any[] }> {
    return this.withCache(this.getCacheKey("polish", input), async () => {
      const trace = this.observabilityAdapter.trace("Polish_Content", input, {
        tags: ["orchestrator", "polish"],
      });

      const result = await this.modelAdapter.polishContent(input);

      // Evaluate content quality
      const scores = await evaluateContent(result.content);

      // Log evaluation to OPIK
      this.observabilityAdapter.logEvaluation(input, result.content, scores);

      trace.end();
      return { content: result.content, scores };
    });
  }

  async generateCompletePost(topic: string, params: any): Promise<any> {
    const trace = this.observabilityAdapter.trace(
      "Generate_Complete_Post",
      { topic, params },
      { tags: ["orchestrator", "complete"] }
    );

    const hooks = await this.generateHooks({ topic, intent: params.intent });
    const selectedHook = hooks[0]?.content || topic;

    const bodies = await this.generateBody({
      hook: selectedHook,
      topic,
      intent: params.intent,
      length: params.length,
      tone: params.tone,
      emojiDensity: params.emojiDensity,
      language: params.language,
    });
    const selectedBody = bodies[0]?.content || "";

    const ctas = await this.generateCTA({ body: selectedBody, intent: params.intent });
    const selectedCTA = ctas[0]?.content || "";

    const draft = `${selectedHook}\n\n${selectedBody}\n\n${selectedCTA}`;
    const final = await this.polishContent({
      content: draft,
      tone: params.tone,
      emojiDensity: params.emojiDensity,
      language: params.language,
    });

    trace.end();
    await this.observabilityAdapter.flush();

    return {
      result: final.content,
      scores: final.scores,
    };
  }
}
```

## Tracking AI Generations

### Basic Tracing

```typescript
import { getOpikClient } from '@/lib/opik-client';

const opik = getOpikClient();

const trace = opik.trace({
  name: "Generate_Topics",
  input: { topic: "AI productivity" },
  tags: ["generation", "topics"],
  metadata: {
    model: "llama-3.3-70b-versatile",
    temperature: 0.8
  }
});

// AI generation happens here
const result = await generateTopics(input);

trace.end({
  output: result,
  metadata: {
    optionsGenerated: result.length,
    avgScore: result.reduce((acc, opt) => acc + opt.score, 0) / result.length
  }
});
```

### Nested Spans

```typescript
const trace = opik.trace({
  name: "Generate_Complete_Post",
  input: { topic: "AI productivity" }
});

// Create nested spans
const hooksSpan = trace.span({
  name: "Generate_Hooks",
  type: "llm"
});

const hooks = await generateHooks({ topic });
hooksSpan.end({ output: hooks });

const bodySpan = trace.span({
  name: "Generate_Body",
  type: "llm"
});

const body = await generateBody({ topic, hook: hooks[0].content });
bodySpan.end({ output: body });

trace.end({ output: { hooks, body } });
```

## Quality Monitoring

### Evaluation Integration

Location: `src/evaluators/index.ts`

```typescript
// evaluators/index.ts
export const evaluateVirality = (content: string): EvaluationResult => {
  let score = 0.3;
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

  if (hasQuestion) score += 0.15;
  if (hasControversial) score += 0.15;
  if (hasValue) score += 0.2;

  return {
    metricName: "Engagement Potential",
    score: Math.min(score, 1),
    reasoning: `Questions, value propositions, and conversational triggers`,
  };
};

export const evaluateContent = async (
  content: string,
  styleProfile?: any
): Promise<EvaluationResult[]> => {
  const results = [evaluateVirality(content), evaluateEngagement(content)];

  if (styleProfile) {
    results.push(await evaluateStyle(content, styleProfile));
  }

  return results;
};
```

### Log Evaluations

```typescript
// After generating content
const result = await generateContent(input);

// Evaluate quality
const scores = await evaluateContent(result.content);

// Log to OPIK
opikClient.trace({
  name: "Content_Evaluation",
  input: { originalInput: input },
  output: result.content,
  metadata: {
    scores: scores,
    averageScore: scores.reduce((acc, s) => acc + s.score, 0) / scores.length
  }
});
```

## Error Tracking

### Trace Errors

```typescript
const trace = opik.trace({
  name: "Generate_Topics",
  input: { topic: input }
});

try {
  const result = await generateTopics(input);
  trace.end({ output: result });
} catch (error) {
  trace.end({
    error: {
      type: error.name,
      message: error.message,
      stack: error.stack
    }
  });
}
```

### Error Tags

```typescript
const trace = opik.trace({
  name: "Generate_Topics",
  input: { topic: input },
  tags: ["generation", "topics"],
  metadata: {
    errorCategory: "generation_failure",
    errorCode: "GROQ_API_ERROR"
  }
});
```

## Performance Metrics

### Track Latency

```typescript
const startTime = Date.now();

const trace = opik.trace({
  name: "Generate_Topics",
  input: { topic: input }
});

const result = await generateTopics(input);

trace.end({
  output: result,
  metadata: {
    latency: Date.now() - startTime,
    latencyMs: Date.now() - startTime
  }
});
```

### Track Token Usage

```typescript
const trace = opik.trace({
  name: "Generate_Topics",
  input: { topic: input }
});

const response = await groqClient.chat.completions.create({...});

trace.end({
  output: response.choices[0].message.content,
  metadata: {
    promptTokens: response.usage.prompt_tokens,
    completionTokens: response.usage.completion_tokens,
    totalTokens: response.usage.total_tokens
  }
});
```

## Best Practices

### 1. Always Use Traces

Wrap all AI generations in traces:

```typescript
const trace = opik.trace({
  name: "Generate_X",
  input: { /* ... */ }
});

try {
  const result = await generate(input);
  trace.end({ output: result });
} catch (error) {
  trace.end({ error });
}
```

### 2. Use Descriptive Names

```typescript
// Good
opik.trace({ name: "Generate_Topics", input: {...} })

// Bad
opik.trace({ name: "gen", input: {...} })
```

### 3. Add Contextual Tags

```typescript
opik.trace({
  name: "Generate_Topics",
  input: {...},
  tags: ["generation", "topics", "groq", "v2"]
});
```

### 4. Include Metadata

```typescript
opik.trace({
  name: "Generate_Topics",
  input: {...},
  metadata: {
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
    maxTokens: 1000,
    language: "en"
  }
});
```

### 5. Flush Periodically

Ensure traces are sent:

```typescript
// After generating complete post
await opik.flush();
```

### 6. Handle Errors Gracefully

```typescript
try {
  await opik.trace({...});
} catch (error) {
  console.error("OPIK tracing failed:", error);
  // Continue with application logic
}
```

## Verification

### Check Integration

Run the application and check OPIK Console:

1. Navigate to [OPIK Console](https://console.opik.ai/)
2. Select project: "commit-to-career"
3. Check traces appear under "Traces" tab
4. Verify metadata is correct
5. Check latency and token usage metrics

### Example Trace

```
Name: Generate_Topics
Input: { topic: "AI productivity", researchDepth: 3 }
Output: [
  { content: "Topic 1...", score: 85, reasoning: "..." },
  { content: "Topic 2...", score: 92, reasoning: "..." }
]
Tags: ["orchestrator", "topics", "groq"]
Metadata:
  Model: llama-3.3-70b-versatile
  Temperature: 0.8
  Latency: 845ms
  OptionsGenerated: 6
  AverageScore: 87.5
```

## Troubleshooting

### No Traces Appearing

1. **Check API Key**: Verify `OPIK_API_KEY` is correct
2. **Network Access**: Ensure outbound connections to OPIK are allowed
3. **Flush**: Ensure `await opik.flush()` is called
4. **Project Name**: Check project name matches in OPIK Console

### High Latency

1. **Network**: Check network connectivity
2. **Batch Size**: Reduce number of traces
3. **Asynchronous**: Flush asynchronously in background

### Memory Issues

1. **Flush Frequently**: Flush traces after each generation
2. **Buffer Size**: Adjust OPIK SDK buffer settings
3. **Truncate Input**: Don't trace large inputs

## Next Steps

- [Tracking Generation](./tracking-generation) - Advanced tracking techniques
- [Quality Monitoring](./quality-monitoring) - Quality metrics and monitoring
- [Debugging with OPIK](./debugging-with-opik) - Debugging tools and techniques
- [Performance Optimization](./performance-optimization) - Performance optimization with OPIK

## Resources

- [OPIK AI Documentation](https://docs.opik.ai/)
- [OPIK AI Console](https://console.opik.ai/)
- [OPIK AI GitHub](https://github.com/opik-ai/opik)
- [Support](mailto:support@opik.ai)

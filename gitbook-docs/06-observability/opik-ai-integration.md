# OPIK AI Integration Guide

## Overview

Comprehensive guide for integrating OPIK AI into AlterEgo for AI observability, quality monitoring, and debugging.

## Why OPIK AI?

OPIK AI is an observability platform designed specifically for AI applications. It provides:

- **Real-Time Monitoring**: Track every AI generation in real-time
- **Quality Assessment**: AI-powered quality evaluation
- **Debugging Tools**: Trace and debug AI behavior
- **Performance Metrics**: Track latency, token usage, error rates
- **Data-Driven Improvement**: Use data to optimize models

## Getting Started

### 1. Get API Key

Visit [https://console.opik.ai/](https://console.opik.ai/)
1. Create account or login
2. Create new project
3. Go to API Keys
4. Generate new API key
5. Add to `.env`

```env
OPIK_API_KEY=your_opik_api_key_here
OPIK_WORKSPACE=default
```

### 2. Install OPIK SDK

```bash
npm install opik
```

Or include in `package.json`:

```json
{
  "dependencies": {
    "opik": "^1.0.0"
  }
}
```

### 3. Initialize OPIK Client

Create `src/lib/opik-client.ts`:

```typescript
import { Opik } from "opik";

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

export const flushOpik = async (): Promise<void> => {
  if (opikInstance) {
    await opikInstance.flush();
  }
};
```

### 4. Create OPIK Adapter

Create `src/services/adapters/opikAdapter.ts`:

```typescript
import { Opik } from "opik";
import { IObservabilityAdapter, ITrace, ISpan } from "./interfaces";
import { logger } from "../../utils/logger";

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
      id: "trace-id-placeholder", // SDK doesn't always expose ID synchronously
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
    // OPIK might have specific evaluation logging
    this.client.trace({
      name: "Content_Evaluation",
      input: { original_input: input, output },
      output: evaluations,
      tags: ["evaluation"],
      metadata: {
        traceId: traceId || "trace-id-placeholder",
      },
    });
  }

  async flush(): Promise<void> {
    await this.client.flush();
  }
}
```

### 5. Update Orchestrator

Use OPIK adapter in `src/services/orchestration/generationOrchestrator.ts`:

```typescript
import { getOpikClient } from "@/lib/opik-client";
import { IObservabilityAdapter } from "@/services/adapters/interfaces";

export class GenerationOrchestrator {
  // ... existing code ...

  constructor(
    modelAdapter: IModelAdapter,
    researchAdapter: IResearchAdapter,
    observabilityAdapter: IObservabilityAdapter,
    cacheAdapter?: ICacheAdapter
  ) {
    this.modelAdapter = modelAdapter;
    this.researchAdapter = researchAdapter;
    this. this.observabilityAdapter = observabilityAdapter;
    this.cacheAdapter = cacheAdapter;
  }

  async generateTopics(input: TopicInput): Promise<GeneratedOption[]> {
    const trace = this.observabilityAdapter.trace("Generate_Topics", input, {
      tags: ["orchestrator", "topics", "groq"],
    });

    const result = await this.withCache(this.getCacheKey("topics", input), async () => {
      const result = await this.modelAdapter.generateTopics(input);
      trace.end();
      return result;
    });
  }

  // ... other methods
}
```

## Usage Examples

### 1. Trace Generation

```typescript
const opik = getOpikClient();
const trace = opik.trace({
  name: "Generate_Topics",
  input: { topic: "AI productivity", researchDepth: 3 },
  tags: ["orchestrator", "topics", "groq"],
});

// Generate topics
const result = await groqAdapter.generateTopics({ input: "AI productivity", researchDepth: 3 });

// End trace with output
trace.end({
  output: result,
  metadata: {
    resultCount: result.length,
    averageScore: result.reduce((sum, t) => sum + t.score, 0) / result.length,
  },
});
```

### 2. Log Evaluation

```typescript
const opik = getOpikClient();

// After generating content
const scores = await evaluateContent(result.content);

opik.trace({
  name: "Content_Evaluation",
  input: { originalInput: input, generatedContent: result.content },
  output: scores,
  tags: ["evaluation", "quality"],
});

// Log evaluation
this.observabilityAdapter.logEvaluation(
  { topic: input },
  result: result.content,
  scores,
);
```

### 3. Monitor Performance

```typescript
const opik = getOpikClient();
const startTime = Date.now();

const result = await groqAdapter.generateTopics(input);

trace.end({
  output: {
    duration: Date.now() - startTime,
    tokensPerSecond: tokensUsed / (duration / 1000),
  },
  metadata: {
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
  },
});
```

## Advanced Features

### 1. Custom Metrics

```typescript
// Define custom metrics
interface CustomMetric {
  name: string;
  value: number;
  description: string;
}

// Log custom metric
const metric: CustomMetric = {
  name: "Viral_Score_Accuracy",
  value: 0.85,
  description: "How accurate is the viral score prediction?",
};

opik.trace({
  name: "Custom_Metric_Update",
  input: metric,
  tags: ["custom-metric"],
  metadata: { description: metric.description },
});
```

### 2. Batch Operations

```typescript
// Batch trace multiple generations
const traces = [];

for (let i = 0; i < 5; i++) {
  const trace = opik.trace({
    name: `Batch_Generation_${i}`,
    input: { topics: inputs[i] },
    tags: ["batch", "generation", "groq"],
  });

  traces.push(trace);
}

// End all traces
traces.forEach(t => t.end());
```

### 3. Error Context

```typescript
try {
  const result = await groqAdapter.generateTopics(input);
  trace.end({ output: result });
} catch (error) {
  trace.end({
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: error.name === 'GenerationError' ? 'GENERATION_FAILED' : 'API_ERROR',
    },
  });
}
```

## Best Practices

### 1. Always Trace

```typescript
// ✅ Good - Always wrap operations in traces
const result = await groqAdapter.generateTopics(input);
const trace = this.observabilityAdapter.trace("Generate_Topics", input);

// Add nested spans for detailed operations
const apiCallSpan = trace.span("Groq_API_Call", "api", {
  input: { model: 'llama-3.3-70b-versatile', url: 'https://api.groq.com/openai/v1/chat/completions' }
});

await groqClient.chat.completions.create({...});
apiCallSpan.end();

trace.end();
```

### 2. Use Descriptive Names

```typescript
// ✅ Good - Clear, descriptive trace names
const trace = this.observabilityAdapter.trace(
  "Generate_Topics", // What are we doing?
  { topic: "AI productivity" }  // What inputs
  { researchDepth: 3 },      // Parameters used
);

// ❌ Bad - Vague names
const trace = this.observabilityAdapter.trace(
  "Gen", // What is this?
  { data }    // Too generic
);
```

### 3. Include Context

```typescript
// ✅ Good - Add relevant metadata
const trace = this.observabilityAdapter.trace("Generate_Topics", input, {
  metadata: {
    userId: userId || 'anonymous',
    sessionId: generateId,
    model: 'llama-3.3-70b-versatile',
    temperature: 0.8,
    researchDepth: input.researchDepth,
  },
});

// ❌ Bad - Missing context
const trace = this.observabilityAdapter.trace("Generate_Topics", input);
// No metadata provided - hard to debug without context
```

### 4. Log Quality Metrics

```typescript
// ✅ Good - Track quality scores
const scores = [
  {
    metricName: "Virality Prediction",
    score: 0.85,
    reasoning: "Hook strength, storytelling elements",
  },
  {
    metricName: "Engagement Potential",
    score: 0.78,
    reasoning: "Questions, value propositions",
  },
];

scores.forEach(score => {
  trace.end({
    output: scores,
    metadata: {
      averageScore: scores.reduce((sum, s) => sum + s.score, 0) / scores.length,
    },
  });
});

// ❌ Bad - Not logging scores
const result = await groqAdapter.generateTopics(input);
// No quality tracking - how do we know if content is good?
```

## Testing OPIK Integration

### Unit Tests

```typescript
// __tests__/services/adapters/opikAdapter.test.ts
import { Opik } from "opik";
import { OpikAdapter } from "@/services/adapters/opikAdapter';

describe("OpikAdapter", () => {
  beforeEach(() => {
    // Reset environment
    process.env.OPIK_API_KEY = 'test-opik-api-key';
    opikInstance = null; // Reset instance
  });

  describe("trace", () => {
    it("should create trace with correct parameters", () => {
      const opik = new Opik({
        apiKey: "test-key",
        projectName: "commit-to-career",
      });

      const trace = opik.trace({
        name: "Test_Trace",
        input: { topic: "test" },
        tags: ["test"],
      });

      expect(opik.trace).toHaveBeenCalledWith(
        "Test_Trace",
        expect.objectContaining({
          name: "Test_Trace",
          input: { topic: "test" },
        tags: ["test"],
        })
      );
    });

    it("should create span", () => {
      const opik = new Opik({
        apiKey: "test-key",
        projectName: "commit-to-career",
      });

      const trace = opik.trace("Test_Trace", { topic: "test" });

      const span = trace.span("Test_Span", "api");

      expect(span).toBeDefined();
      expect(span.id).toBeTruthy();
      expect(span.end).toBeDefined();
      expect(typeof span.end).toBe("function");
    });

    it("should end span", () => {
      const opik = new Opik({
        apiKey: "test-key",
        projectName: "commit-to-career",
      });

      const trace = opik.trace("Test_Trace_End", {});
      const span = trace.span("Test_Span_2", "api");

      span.end();
      trace.end();

      expect(span.end).toHaveBeenCalledTimes(1);
    });
  });

  describe("end", () => {
    it("should flush all traces", async () => {
      const opik = new Opik({
        apiKey: "test-key",
        projectName: "commit-to-career",
      });

      const trace1 = opik.trace("Trace_1", { input: {} });
      const trace2 = opik.trace("Trace_2", { input: {} });
      const trace3 = opik.trace("Trace_3", { input: {} });

      // End traces
      trace1.end();
      trace2.end();
      trace3.end();

      await opik.flush();

      expect(opik.flush).toHaveBeenCalledTimes(3);
    });
  });
});
```

### Integration Tests

```typescript
// __tests__/services/orchestration/generationOrchestrator.test.ts
import { GenerationOrchestrator } from "@/services/orchestration/generationOrchestrator';
import * as api from "@/api/generate';
import { OpikAdapter } from "@/services/adapters/opikAdapter';
import { getOpikClient } from "@/lib/opik-client';

// Mock Opik adapter
const mockOpikAdapter: IObservabilityAdapter = {
  readonly projectName: "test-project",
  trace: jest.fn().mockReturnValue({
    id: "trace-id-1",
    name: "Mock Trace",
    span: jest.fn().mockReturnValue({
      id: "span-id-1",
      name: "Mock Span",
      type: "general",
      end: jest.fn(),
    }),
    end: jest.fn(),
  }),
    logEvaluation: jest.fn(),
  } as any,
};

// Mock model adapter
const mockModelAdapter = IModelAdapter as any;
jest.spyOn(mockModelAdapter, 'generateTopics').mockResolvedValueOnce(topicsMock);

// Mock research adapter
const mockResearchAdapter = IResearchAdapter as any;
jest.spyOn(mockResearchAdapter, 'search').mockResolvedValueOnce([]);

describe("GenerationOrchestrator with OPIK", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should trace topic generation with OPIK", async () => {
    const orchestrator = new GenerationOrchestrator(
      mockModelAdapter,
      mockResearchAdapter,
      mockOpikAdapter,
      mockCacheAdapter,
    );

    const input: TopicInput = {
      input: "AI productivity",
      researchDepth: 3,
    };

    await orchestrator.generateTopics(input);

    // Verify OPIK was called
    expect(mockOpikAdapter.trace).toHaveBeenCalledWith(
      "Generate_Topics",
      expect.objectContaining({
        input: { topic: "AI productivity", researchDepth: 3 },
      }),
      expect.objectContaining({
        tags: ["orchestrator", "topics", "groq"],
      }),
    );

    // Verify trace.end was called
    expect(mockOpikAdapter.trace.end).toHaveBeenCalledTimes(1);
  });
  });

  it("should log evaluation after generation", async () => {
    const orchestrator = new GenerationOrchestrator(
      mockModelAdapter,
      mockResearchAdapter,
      mockOpikAdapter,
      mockCacheAdapter,
    );

    const input: TopicInput = {
      input: "AI productivity",
      researchDepth: 3,
    };

    await orchestrator.generateTopics(input);

    // Verify logEvaluation was called
    expect(mockOpikAdapter.logEvaluation).toHaveBeenCalledWith(
      { originalInput: input },
      expect.any(Object),
      expect.any(Array),
      expect.any(Array),
    );
    });

    // Verify flush was called
    expect(mockOpikAdapter.flush).toHaveBeenCalled();
  });
});
```

## Debugging with OPIK

### View Traces in OPIK Console

1. Go to [OPIK Console](https://console.opik.ai/)
2. Select your project: "commit-to-career"
3. Navigate to "Traces" tab
4. Find trace by name: "Generate_Topics"
5. Review input/output
6. Check metadata and tags
7. Identify errors in spans

### Analyze Trace Performance

1. **Find slow traces**
2. Check for long duration
3. Identify bottlenecks
4. Review error traces

### Common Issues

#### No Traces Appearing

**Problem**: Traces not showing in OPIK Console

**Solutions**:
1. Check OPIK API key is correct
2. Verify project name matches
3. Check flush() is called
4. Check network connectivity

#### High Error Rate

**Problem**: Many error traces appearing

**Solutions**:
1. Check API service status
2. Review error messages
3. Check logs for root causes
4. Optimize prompts to reduce errors
5. Implement better error handling

#### Slow Performance

**Problem**: Generations taking too long

**Solutions**:
1. Check Groq API status
2. Reduce prompt complexity
3. Optimize max_tokens
4. Check network latency
5. Consider using lower temperature

## Performance Optimization

### 1. Reduce Trace Overhead

```typescript
// Disable tracing for performance tests
const isProduction = process.env.NODE_ENV === 'production';

// Only trace critical operations
const opik = getOpikClient();

const result = await groqAdapter.generateTopics(input);

if (isProduction) {
  trace = this.observabilityAdapter.trace("Generate_Topics", input);
  const result = await this.modelAdapter.generateTopics(input);
  trace.end();
} else {
  // Development: Still trace everything
}
```

### 2. Batch Operations

```typescript
// Process multiple generations efficiently
const inputs = [
  "AI productivity",
  "Marketing strategies",
  "Sales techniques",
  "HR best practices",
];

const promises = inputs.map(input => 
  opik.trace(`Batch_Generation_${index}`, { topic: input })
    .then(() => groqAdapter.generateTopics({ input }))
    .then(result => {
      trace.end({ output: result });
      return result;
    }),
  );

const results = await Promise.all(promises);

// Process all traces together
for (let i = 0; i < traces.length; i++) {
  traces[i].end();
}

await opik.flush();
```

### 3. Selective Tracing

```typescript
// Only trace operations with issues
const shouldTrace = isError || isErrorRateLimited;

const result = await groqAdapter.generateTopics(input);

if (shouldTrace) {
  const trace = this.observabilityAdapter.trace("Generate_Topics", input);
  const result = await this.modelAdapter.generateTopics(input);
  trace.end();
} else {
  // Don't trace for successful operations
}
```

### 4. Monitoring Production

```typescript
// In production, reduce tracing to critical paths only
const TRACE_CRITICAL_OPERATIONS = ['Generate_Complete_Post', 'Polish_Content'];

const result = await generateCompletePost(topic, params);

if (TRACE_CRITICAL_OPERATIONS.includes(type)) {
  const trace = this.observabilityAdapter.trace(
    `Critical_Generation_${type}`,
    { topic, params }
  );

  const result = await this.modelAdapter.generateCompletePost(topic, params);
  trace.end();
}
```

## Summary

OPIK AI integration ensures:

- ✅ **Real-Time Observability**: Track every generation
- ✅ **Quality Monitoring**: AI-powered evaluation
- ✅ **Performance Tracking**: Monitor metrics and identify bottlenecks
- ✅ **Debugging Tools**: Visual traces and identify issues
- ✅ **Data-Driven Improvement**: Optimize based on real usage data

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI - Ensuring Highest Quality AI Generation**

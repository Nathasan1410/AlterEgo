# Model Tuning

## Overview

Model tuning and optimization ensures AlterEgo generates the highest quality LinkedIn content. This guide covers strategies for improving prompt quality, adjusting parameters, and monitoring performance.

## Model Selection

### Llama 3.3 70B Configuration

```typescript
// src/services/adapters/groqAdapter.ts
export class GroqAdapter implements IModelAdapter {
  readonly name = "Groq";
  readonly version = "llama-3.3-70b-versatile";

  private client: Groq;
  private model: string;

  constructor(apiKey: string, model: string = 'llama-3.3-70b-versatile') {
    this.client = new Groq({ apiKey });
    this.model = model;
  }

  // Default parameters
  private get defaultParameters() {
    return {
      model: this.model,
      temperature: 0.8,
      max_tokens: 4096,
      top_p: 0.9,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };
  }
}
```

### Model Capabilities

| Capability | Value | Usage |
|------------|-------|--------|
| Context Window | 128K tokens | Long-form content generation |
| Max Output Tokens | 4096 tokens | Sufficient for LinkedIn posts |
| Speed | Sub-second inference | Fast, responsive generation |
| Quality | State-of-the-art | High-quality, coherent output |
| Languages | 100+ supported | Indonesian and English |

## Temperature Tuning

### Temperature Guidelines

| Task | Temperature | Reasoning |
|------|-------------|----------|
| Topics | 0.8 | Balance creativity and relevance |
| Hooks | 0.85 | More creative for attention-grabbing |
| Body | 0.75 | Maintain hook promise, add coherent detail |
| CTA | 0.7 | More predictable and actionable |
| Polish | 0.7 | Refine without changing meaning |

### Temperature Effects

```typescript
// Low temperature (0.0-0.3)
- More deterministic
- Repetitive outputs
- Less creative
- Better for factual content

// Medium temperature (0.4-0.7)
- Balanced creativity
- Some variety
- Coherent output
- Good for general content

// High temperature (0.8-1.0)
- More creative
- Higher variety
- Less predictable
- Good for viral content

// Very high temperature (1.0+)
- Very creative
- Unpredictable
- May be incoherent
- Risk of poor quality
```

### Temperature Testing

```typescript
// Test different temperatures
async function testTemperatures() {
  const temperatures = [0.6, 0.7, 0.8, 0.9, 1.0];
  const results = [];

  for (const temp of temperatures) {
    const response = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: temp,
      max_tokens: 400,
    });

    results.push({
      temperature: temp,
      output: response.choices[0].message.content,
    });
  }

  // Evaluate quality
  const bestTemp = selectBestTemperature(results);
  console.log(`Best temperature: ${bestTemp}`);
}
```

## Token Management

### Token Limits

```typescript
// Optimal token counts per generation type
const TOKEN_LIMITS = {
  topics: {
    input: 100,  // Prompt length
    output: 400,  // Expected output
    total: 500,
  },
  hooks: {
    input: 150,
    output: 300,
    total: 450,
  },
  body: {
    input: 300,
    output: 800,
    total: 1100,
  },
  cta: {
    input: 200,
    output: 150,
    total: 350,
  },
};
```

### Token Optimization Strategies

```typescript
// Efficient prompt construction
function buildOptimizedPrompt(input: string, type: string): string {
  const basePrompt = PROMPT_TEMPLATES[type];
  
  // Remove redundant information
  const optimizedPrompt = basePrompt
    .replace(/(\\n)+/g, ' ')  // Remove extra newlines
    .replace(/\s+/g, ' ')  // Remove extra spaces;

  return optimizedPrompt;
}

// Use max_tokens to limit output
const response = await groqClient.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  messages: [{ role: 'user', content: prompt }],
  max_tokens: TOKEN_LIMITS[type].output,
  temperature: 0.8,
});
```

## Prompt Optimization

### A/B Testing Framework

```typescript
// src/services/prompts/abTesting.ts
interface PromptVariant {
  id: string;
  prompt: string;
  temperature: number;
  version: string;
}

interface ABRResult {
  variantId: string;
  quality: number;
  speed: number;
  userPreference: number;
}

const promptVariants: PromptVariant[] = [
  {
    id: 'v1',
    prompt: 'Generate 6 engaging topics...',
    temperature: 0.8,
    version: '1.0',
  },
  {
    id: 'v2',
    prompt: 'Create 6 viral LinkedIn topics...',
    temperature: 0.85,
    version: '1.0',
  },
  {
    id: 'v3',
    prompt: 'Write 6 attention-grabbing topics...',
    temperature: 0.9,
    version: '2.0',
  },
];

async function runABTest(variant: PromptVariant): Promise<ABRResult> {
  const startTime = Date.now();

  const response = await groqClient.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: variant.prompt }],
    temperature: variant.temperature,
    max_tokens: 400,
  });

  const quality = evaluateQuality(response.choices[0].message.content);
  const speed = Date.now() - startTime;

  return {
    variantId: variant.id,
    quality,
    speed,
    userPreference: 0, // To be determined by users
  };
}

// Run all variants
const results = await Promise.all(
  promptVariants.map(variant => runABTest(variant))
);

// Select best variant
const bestVariant = selectBestVariant(results);
```

### Quality Metrics

```typescript
// Evaluators for prompt quality
interface QualityMetrics {
  coherence: number;  // Is content coherent?
  relevance: number;  // Is it relevant to input?
  creativity: number;  // Is it creative?
  virality: number;  // Is it viral-worthy?
  professionalism: number;  // Is it professional?
}

function evaluateQuality(content: string): QualityMetrics {
  return {
    coherence: calculateCoherence(content),
    relevance: calculateRelevance(content),
    creativity: calculateCreativity(content),
    virality: calculateVirality(content),
    professionalism: calculateProfessionalism(content),
  };
}

function calculateCoherence(text: string): number {
  // Check sentence structure
  const sentences = text.split(/[.!?]+/);
  return sentences.reduce((score, s) => {
    return score + (s.length > 10 ? 1 : 0); // Appropriate length
  }, 0);
}

function calculateVirality(text: string): number {
  let score = 0.3;

  // Check for viral indicators
  if (/I |my |when I|years ago/i.test(text)) score += 0.2;
  if (/\d+/.test(text)) score += 0.1;
  if (/secret|hack|nobody|don't tell/i.test(text)) score += 0.2;
  if (/\?/.test(text)) score += 0.15;
  if (/comment|share|follow/i.test(text)) score += 0.15;

  return Math.min(score, 1.0);
}
```

## Performance Monitoring

### Generation Time Tracking

```typescript
// In orchestrator
interface GenerationMetrics {
  type: string;
  startTime: number;
  endTime: number;
  duration: number;
  tokenCount: number;
  outputCount: number;
}

class PerformanceMonitor {
  private metrics: Map<string, GenerationMetrics[]> = new Map();

  startGeneration(type: string, input: any) {
    this.metrics.set(type, [
      ...(this.metrics.get(type) || []),
      {
        type,
        startTime: Date.now(),
        endTime: 0,
        duration: 0,
        tokenCount: 0,
        outputCount: 0,
      },
    ]);
  }

  endGeneration(type: string, output: any, tokenCount: number) {
    const metrics = this.metrics.get(type);
    const lastMetric = metrics[metrics.length - 1];

    lastMetric.endTime = Date.now();
    lastMetric.duration = lastMetric.endTime - lastMetric.startTime;
    lastMetric.tokenCount = tokenCount;
    lastMetric.outputCount = Array.isArray(output) ? output.length : 1;

    this.logToOPIK(type, lastMetric);
  }

  logToOPIK(type: string, metric: GenerationMetrics) {
    this.observabilityAdapter.trace(`Generation_Performance_${type}`, {
      input: metric,
      tags: ['performance', type],
    }).end({
      output: {
        duration: metric.duration,
        tokensPerSecond: metric.tokenCount / (metric.duration / 1000),
        outputQuality: metric.outputCount,
      },
    });
  }
}
```

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Topics Generation | < 2s | TBD |
| Hooks Generation | < 2s | TBD |
| Body Generation | < 3s | TBD |
| CTA Generation | < 1s | TBD |
| Complete Post | < 5s | TBD |

## Caching Strategy

### Cache Keys

```typescript
// Deterministic cache key generation
function getCacheKey(type: string, input: any): string {
  const normalizedInput = JSON.stringify(input)
    return `${type}:${normalizedInput}`;
}

// Cache with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in seconds
}

const CACHE_TTLS = {
  topics: 3600,    // 1 hour
  hooks: 1800,     // 30 minutes
  body: 1800,     // 30 minutes
  cta: 1800,      // 30 minutes
};

async function getCached<T>(
  key: string,
  generator: () => Promise<T>
): Promise<T | null> {
  const cached = cache.get<CacheEntry<T>>(key);

  if (!cached) return null;

  const now = Date.now();
  if (now > cached.timestamp + cached.ttl * 1000) {
    // Expired
    cache.delete(key);
    return null;
  }

  return cached.data;
}

async function setCached<T>(key: string, data: T, ttl: number): Promise<void> {
  await cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}
```

### Cache Invalidation

```typescript
// Strategies for cache invalidation

// Time-based invalidation (TTL)
// Manual invalidation for urgent updates
// Version-based invalidation for prompt changes
// Size-based invalidation for memory management

// Example: Invalidate style profile cache
async function invalidateStyleCache(userId: string) {
  const pattern = new RegExp(`style:${userId}:.*`);
  
  for (const key of cache.keys()) {
    if (pattern.test(key)) {
      await cache.delete(key);
    }
  }
}
```

## OPIK Integration

### Model Performance Tracking

```typescript
// Log model parameters and performance
const trace = this.observabilityAdapter.trace('Model_Performance', {
  input: {
    model: 'llama-3.3-70b-versatile',
    temperature: 0.8,
    maxTokens: 4096,
  },
  tags: ['model', 'performance', 'groq'],
});

// After generation
trace.end({
  output: {
    tokensGenerated: usage.total_tokens,
    tokensPerSecond: usage.total_tokens / (duration / 1000),
    costEstimate: calculateCost(usage.total_tokens),
  },
  metadata: {
    duration,
    cacheHit: wasCached,
  },
});
```

### Quality Comparison

```typescript
// Compare model performance over time
const modelMetrics = {
  '2026-02-05': {
    averageQuality: 85,
    averageTime: 1250,
    cacheHitRate: 0.25,
  },
  '2026-02-06': {
    averageQuality: 87,
    averageTime: 1100,
    cacheHitRate: 0.30,
  },
};

// Log comparison
this.observabilityAdapter.trace('Model_Comparison', {
  input: {
    baseline: modelMetrics['2026-02-05'],
    current: modelMetrics['2026-02-06'],
  },
  tags: ['model', 'comparison', 'optimization'],
}).end();
```

## Testing Optimizations

### A/B Test Framework

```typescript
// src/services/abTesting.ts
export async function abTestPromptVariants(
  basePrompt: string,
  variants: PromptVariant[]
): Promise<{ bestVariant: PromptVariant; results: ABRResult[] }> {
  const results = await Promise.all(
    variants.map(variant => testVariant(variant))
  );

  const bestVariant = results.reduce((best, current) => {
    const currentScore = calculateScore(current);
    const bestScore = calculateScore(best);

    return currentScore > bestScore ? current : best;
  });

  return { bestVariant, results };
}

function calculateScore(result: ABRResult): number {
  // Weighted scoring
  return (
    (result.quality * 0.4) +
    (result.speed * 0.3) +
    (result.userPreference * 0.3)
  );
}
```

## Continuous Improvement

### Feedback Loop

```typescript
// Collect user feedback on generated content
interface UserFeedback {
  contentId: string;
  rating: number; // 1-5 stars
  selected: boolean; // Did user select this option?
  timestamp: number;
}

async function collectFeedback(contentId: string, rating: number) {
  await feedbackCollection.insert({
    contentId,
    rating,
    timestamp: Date.now(),
  });

  // Use feedback to improve prompts
  if (rating >= 4) {
    await markPromptSuccessful(contentId);
  } else {
    await markPromptNeedsImprovement(contentId);
  }
}

// Track successful and failed prompts
const promptStats = new Map<string, { success: number; total: number }>();
```

### OPIK Logging

```typescript
// Log model tuning experiments
this.observabilityAdapter.trace('Model_Tuning_Experiment', {
  input: {
    promptVariantId: variant.id,
    temperature: variant.temperature,
    abTestResults: results,
  },
  tags: ['model-tuning', 'ab-testing', 'optimization'],
});

// After selecting best variant
this.observabilityAdapter.trace('Model_Tuning_Best_Variant_Selected', {
  input: {
    bestVariant: bestVariant.id,
    improvementExpected: calculateExpectedImprovement(bestVariant),
  },
  tags: ['model-tuning', 'optimization'],
});
```

## Best Practices

### 1. Start Simple

- Use proven prompts first
- Test with real user inputs
- Incrementally add complexity
- Document what works and what doesn't

### 2. Measure Everything

- Track generation quality scores
- Monitor response times
- Cache hit rates
- User selection rates
- Error rates

### 3. Iterate Based on Data

- Use OPIK metrics to identify issues
- Adjust temperature based on quality
- Modify prompts based on feedback
- Optimize token usage

### 4. Keep It Simple

- Avoid over-engineering prompts
- Use clear, direct instructions
- Test one change at a time
- Document changes and their impact

### 5. Monitor Production

- Watch quality metrics in OPIK
- Alert on performance degradation
- Track cache effectiveness
- Monitor user satisfaction

## Summary

Model tuning ensures AlterEgo generates:

- ✅ **High-Quality Content**: Optimized prompts and parameters
- ✅ **Consistent Results**: Reliable, predictable outputs
- ✅ **Fast Performance**: Sub-second generation with Groq
- ✅ **Cost Efficiency**: Optimized token usage and caching
- ✅ **Continuous Improvement**: Data-driven optimization with OPIK

**Key Strategies**:
1. Temperature tuning for creativity balance
2. Token management for cost efficiency
3. Caching for speed optimization
4. A/B testing for prompt optimization
5. Quality metrics for monitoring
6. OPIK integration for observability

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI - Ensuring Highest Quality AI Generation**

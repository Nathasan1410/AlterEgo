# Tavily Research

## Overview

AlterEgo integrates Tavily AI for web research, providing up-to-date context for content generation. This enables the AI to incorporate recent trends, statistics, and expert insights into generated posts.

## What is Tavily?

Tavily is an AI-powered search engine designed specifically for LLMs and AI applications. It provides:

- **Real-Time Results**: Latest information from the web
- **AI-Friendly Output**: Results formatted for easy consumption by LLMs
- **Relevance Scoring**: Ranked by relevance and quality
- **Multiple Sources**: Diverse information sources

## Integration Architecture

```
┌─────────────────────────────────────────┐
│         Orchestrator              │
│  generationOrchestrator.ts        │
└───────────────┬───────────────────┘
                │
                ↓
        Research Needed?
                │
        ┌─────────┴─────────┐
        ↓                   ↓
    Yes                  No
        ↓                   ↓
┌─────────────────────┐     ↓
│  Tavily Adapter    │  Skip Research
│  tavilyAdapter.ts  │     ↓
└───────────────┬─────┘  Continue
                │
                ↓
        Search Query
                │
                ↓
┌─────────────────────────────────┐
│         Tavily API             │
│  https://api.tavily.com/    │
└───────────────┬─────────────────┘
                │
                ↓ JSON Response
                │
┌─────────────────────────────────┐
│      Research Results         │
│  [                        │
│    {                      │
│      title: "Article",     │
│      url: "...",           │
│      content: "...",        │
│      score: 0.95          │
│    }                      │
│  ]                        │
└───────────────┬─────────────────┘
                │
                ↓
┌─────────────────────────────────┐
│      Context Building       │
│  Combine results into       │
│  research context string   │
└───────────────┬─────────────────┘
                │
                ↓
┌─────────────────────────────────┐
│      Generation             │
│  Pass context to LLM     │
└─────────────────────────────────┘
```

## Implementation

### Adapter

Location: `src/services/adapters/tavilyAdapter.ts`

```typescript
import { tavily } from "@tavily/core";
import { IResearchAdapter, ResearchResult } from "./interfaces";
import { logger } from "../../utils/logger";

export class TavilyAdapter implements IResearchAdapter {
  readonly name = "Tavily";

  private client: any;

  constructor(apiKey: string) {
    this.client = tavily({ apiKey });
  }

  async search(query: string, maxResults: number = 5): Promise<ResearchResult[]> {
    try {
      const response = await this.client.search(query, {
        searchDepth: "advanced",
        maxResults,
        includeAnswer: true,
        includeRawContent: false,
      });

      return response.results.map((r: any) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score || 0,
      }));
    } catch (error) {
      logger.error("Tavily search error", error instanceof Error ? error : undefined, {
        query,
        maxResults,
      });
      return [];
    }
  }

  async getTrending(industry: string): Promise<ResearchResult[]> {
    const query = `latest trending news ${industry} ${new Date().toISOString().split("T")[0]}`;
    return this.search(query, 3);
  }

  async getPostContext(topic: string): Promise<string> {
    const research = await this.search(topic, 3);

    if (!research.length) return "";

    const contextParts = research.map((r) =>
      `- ${r.title}: ${r.content.slice(0, 200)}...`
    );

    return `Recent information about "${topic}":\n${contextParts.join("\n")}`;
  }
}
```

### Interface

Location: `src/services/adapters/interfaces.ts`

```typescript
export interface IResearchAdapter {
  search(query: string, maxResults?: number): Promise<ResearchResult[]>;
  getTrending(industry: string): Promise<ResearchResult[]>;
  getPostContext(topic: string): Promise<string>;
}

export interface ResearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}
```

### Usage in Orchestrator

```typescript
// src/services/orchestration/generationOrchestrator.ts
async generateBody(input: BodyInput): Promise<GeneratedOption[]> {
  // Research if requested
  let researchContext = "";
  if (input.researchDepth && input.researchDepth > 0) {
    researchContext = await this.researchAdapter.getPostContext(input.topic);
  }

  // Include research in prompt
  const result = await this.modelAdapter.generateBody({
    ...input,
    researchContext,
  });

  return result;
}
```

## Configuration

### Tavily API Setup

#### Get API Key

1. Visit [https://tavily.com/](https://tavily.com/)
2. Sign up (free tier available)
3. Navigate to API Keys
4. Generate new API key
5. Add to `.env`:

```env
TAVILY_API_KEY=your_tavily_api_key_here
```

### Client Initialization

```typescript
// src/lib/tavily-client.ts
import { tavily } from "@tavily/core";

let tavilyClient: any = null;

export const getTavilyClient = () => {
  if (!tavilyClient) {
    tavilyClient = tavily({
      apiKey: process.env.TAVILY_API_KEY,
    });
  }
  return tavilyClient;
};
```

## API Reference

### Search Endpoint

**URL**: `POST https://api.tavily.com/search`

**Request**:
```typescript
{
  query: string;           // Search query
  searchDepth?: "basic" | "advanced";
  maxResults?: number;     // Default: 10
  includeAnswer?: boolean; // Default: true
  includeRawContent?: boolean; // Default: false
  includeImages?: boolean; // Default: false
  includeImageDescriptions?: boolean; // Default: false
}
```

**Response**:
```typescript
{
  answer: string;          // AI-generated answer
  query: string;           // Original query
  results: [
    {
      title: string;       // Result title
      url: string;        // Result URL
      content: string;     // Result content
      score: number;      // Relevance score
      published_date: string; // Publication date
    }
  ];
}
```

## Search Strategies

### Context-Aware Search

```typescript
// Build comprehensive search query
function buildSearchQuery(topic: string, industry?: string): string {
  const parts = [topic];

  if (industry) {
    parts.push(industry);
  }

  parts.push("2026", "trends", "best practices");

  return parts.join(" ");
}

// Example: "AI productivity 2026 trends best practices"
```

### Multi-Stage Search

```typescript
// Stage 1: Broad search
const broadResults = await tavilyAdapter.search(topic, 5);

// Stage 2: Focused search based on results
const topKeywords = extractKeywords(broadResults[0].content);
const focusedResults = await tavilyAdapter.search(
  `${topic} ${topKeywords}`,
  3
);

// Combine results
const allResults = [...broadResults, ...focusedResults];
```

### Trend-Based Search

```typescript
// Search for latest trends
async function searchTrends(topic: string): Promise<string> {
  const query = `${topic} trending 2026`;
  const results = await tavilyAdapter.search(query, 5);

  // Extract trend insights
  const trends = results
    .filter(r => r.score > 0.8)
    .map(r => r.content)
    .join("\n\n");

  return trends;
}
```

## Error Handling

### Common Errors

#### API Key Invalid

**Error**: 401 Unauthorized

**Solution**:
```typescript
try {
  const results = await tavilyAdapter.search(query);
} catch (error) {
  if (error.status === 401) {
    throw new Error("Invalid Tavily API key. Please check .env file.");
  }
}
```

#### Rate Limit Exceeded

**Error**: 429 Too Many Requests

**Solution**:
```typescript
import { sleep } from '@/utils/async';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function searchWithRetry(query: string, retries = 0): Promise<ResearchResult[]> {
  try {
    return await tavilyAdapter.search(query);
  } catch (error) {
    if (error.status === 429 && retries < MAX_RETRIES) {
      await sleep(RETRY_DELAY * (retries + 1));
      return searchWithRetry(query, retries + 1);
    }
    throw error;
  }
}
```

#### No Results Found

**Error**: Empty results array

**Solution**:
```typescript
const results = await tavilyAdapter.search(query);

if (!results.length) {
  // Fallback to broader search
  const broaderQuery = simplifyQuery(query);
  const fallbackResults = await tavilyAdapter.search(broaderQuery);

  if (fallbackResults.length) {
    return fallbackResults;
  }

  // Return empty array - orchestrator handles this
  return [];
}
```

## Caching Strategy

### Cache Research Results

```typescript
// Cache research to reduce API calls
const researchCache = new Map<string, { results: ResearchResult[], timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour

async function getCachedResearch(query: string): Promise<ResearchResult[] | null> {
  const cached = researchCache.get(query);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.results;
  }

  return null;
}

async function setCachedResearch(query: string, results: ResearchResult[]): Promise<void> {
  researchCache.set(query, {
    results,
    timestamp: Date.now(),
  });
}

// Usage
async function searchWithCache(query: string): Promise<ResearchResult[]> {
  // Check cache
  const cached = await getCachedResearch(query);
  if (cached) {
    return cached;
  }

  // Search
  const results = await tavilyAdapter.search(query);

  // Update cache
  await setCachedResearch(query, results);

  return results;
}
```

## Performance Optimization

### Parallel Searches

```typescript
// Search multiple queries in parallel
async function parallelSearch(topics: string[]): Promise<Map<string, ResearchResult[]>> {
  const searches = topics.map(topic =>
    tavilyAdapter.search(topic, 3)
  );

  const results = await Promise.all(searches);

  return new Map(
    topics.map((topic, i) => [topic, results[i]])
  );
}

// Usage
const [topics, hooks, body, cta] = await Promise.all([
  parallelSearch(topics),
  parallelSearch(hooks),
  parallelSearch(body),
  parallelSearch(cta),
]);
```

### Batch Processing

```typescript
// Process multiple research requests efficiently
async function batchResearch(topics: string[]): Promise<string[]> {
  const batchSize = 3; // Max concurrent requests
  const contexts: string[] = [];

  for (let i = 0; i < topics.length; i += batchSize) {
    const batch = topics.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(topic => tavilyAdapter.getPostContext(topic))
    );
    contexts.push(...results);
  }

  return contexts;
}
```

## OPIK Integration

### Trace Research Operations

```typescript
import { getOpikClient } from "@/lib/opik-client";

const opik = getOpikClient();

async function searchWithOPIK(query: string): Promise<ResearchResult[]> {
  const trace = opik.trace({
    name: "Web_Research",
    input: { query },
    tags: ["research", "tavily"],
  });

  try {
    const results = await tavilyAdapter.search(query);

    trace.end({
      output: results,
      metadata: {
        resultCount: results.length,
        avgScore: calculateAverageScore(results),
      }
    });

    return results;
  } catch (error) {
    trace.end({
      error: {
        name: error.name,
        message: error.message,
      }
    });
    throw error;
  }
}
```

### Monitor Research Quality

```typescript
// Track research effectiveness
interface ResearchMetrics {
  query: string;
  resultCount: number;
  avgScore: number;
  usedInGeneration: boolean;
  timestamp: number;
}

const researchMetrics: ResearchMetrics[] = [];

// After generation
function trackResearchEffectiveness(query: string, results: ResearchResult[], used: boolean) {
  researchMetrics.push({
    query,
    resultCount: results.length,
    avgScore: calculateAverageScore(results),
    usedInGeneration: used,
    timestamp: Date.now(),
  });

  // Log to OPIK
  opikClient.trace({
    name: "Research_Quality",
    input: { query },
    output: { used, resultCount: results.length },
  });
}
```

## Best Practices

### Query Construction

1. **Be Specific**: Use precise search terms
2. **Include Context**: Add industry, year, trends
3. **Use Quotes**: For exact phrases
4. **Avoid Stop Words**: Remove common words

### Result Processing

1. **Filter by Score**: Use high-scoring results
2. **Diversify Sources**: Don't use same source multiple times
3. **Validate URLs**: Ensure URLs are accessible
4. **Summarize Content**: Extract key information

### Performance

1. **Cache Results**: Cache for repeated queries
2. **Limit Concurrent**: Don't overload API
3. **Use Appropriate Depth**: Use "basic" for simple queries
4. **Handle Empty Results**: Graceful fallback

## Cost Considerations

### Tavily Pricing

**Free Tier**:
- 1,000 searches/month
- Advanced search depth
- AI-powered results

**Paid Tier**:
- Custom pricing
- Higher limits
- Priority support

### Optimize Costs

1. **Cache Results**: Reduce duplicate searches
2. **Batch Queries**: Process multiple at once
3. **Use Appropriate Depth**: "basic" for simple needs
4. **Limit Result Count**: Only get what you need

## Testing

### Unit Tests

```typescript
// __tests__/tavily.test.ts
describe("TavilyAdapter", () => {
  it("should search and return results", async () => {
    const adapter = new TavilyAdapter(apiKey);
    const results = await adapter.search("AI productivity");

    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("title");
    expect(results[0]).toHaveProperty("url");
    expect(results[0]).toHaveProperty("content");
  });

  it("should handle API errors gracefully", async () => {
    const adapter = new TavilyAdapter("invalid_key");
    const results = await adapter.search("test");

    expect(results).toEqual([]);
  });
});
```

### Integration Tests

```typescript
describe("Research Integration", () => {
  it("should include research context in generation", async () => {
    const orchestrator = new GenerationOrchestrator(...);
    const result = await orchestrator.generateBody({
      topic: "AI productivity",
      researchDepth: 3,
    });

    // Verify research was used
    expect(result).toBeTruthy();
  });
});
```

## Troubleshooting

### Issue: No Results

**Problem**: Search returns empty array

**Solution**:
- Check query is not empty
- Try broader search terms
- Verify API key is valid
- Check internet connection

### Issue: Poor Quality Results

**Problem**: Results are irrelevant

**Solution**:
- Use more specific query
- Add context to query
- Try advanced search depth
- Filter by score

### Issue: Slow Response

**Problem**: Search takes too long

**Solution**:
- Use basic search depth
- Reduce maxResults
- Check internet connection
- Consider caching

## Summary

Tavily research integration provides:

- ✅ **Real-Time Context**: Latest web information
- ✅ **AI-Friendly**: Results formatted for LLMs
- ✅ **Flexible**: Multiple search strategies
- ✅ **Observable**: OPIK integration for monitoring
- ✅ **Scalable**: Caching and batch processing

This feature enhances generation quality by incorporating up-to-date, relevant information.

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI**

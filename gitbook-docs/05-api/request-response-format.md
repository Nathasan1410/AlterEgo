# Request/Response Format

## Overview

All AlterEgo API endpoints use a consistent request and response format for predictability and developer experience.

## Request Format

### Standard Request Structure

```json
{
  "type": string,
  "input": string,
  "researchDepth": number,
  "intent": string,
  "length": string,
  "tone": number,
  "emojiDensity": string,
  "language": string,
  "styleProfile": object,
  "researchContext": string,
  "posts": array,
  "query": string,
  "maxResults": number
}
```

### Request Headers

```http
Content-Type: application/json
Accept: application/json
User-Agent: alterego-api/1.0.0
Authorization: Bearer <token> (future)
X-Request-ID: <unique-identifier>
```

### Request Validation

All requests are validated using Zod schemas before processing.

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
```

## Response Format

### Standard Response Structure

```typescript
// src/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
  duration: number;
}

// Success response example
{
  "success": true,
  "data": {
    "result": [GeneratedOptions],
    "scores": [EvaluationResults],
    "polished": "Final content text"
  },
  "error": null,
  "duration": 1245
}

// Error response example
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'input' is required"
  },
  "duration": 5
}
```

### Generated Option Format

```typescript
// src/types/generated.ts
export interface GeneratedOption {
  content: string;
  score: number; // 0-100
  reasoning: string; // 10-20 words
}
```

### Evaluation Result Format

```typescript
// src/models/generated.ts
export interface EvaluationResult {
  metricName: string;
  score: number; // 0.0-1.0
  reasoning: string;
}

// Example
{
  "metricName": "Virality Prediction",
  "score": 0.85,
  "reasoning": "Hook strength, storytelling elements, and call-to-action presence"
}
```

## Response Data Types

### Topics Response

```typescript
interface TopicsResponseData {
  result: GeneratedOption[]; // Array of 6 topics
}

// Example
{
  "success": true,
  "data": {
    "result": [
      {
        "content": "I wish someone told me this 5 years ago...",
        "score": 92,
        "reasoning": "Strong hook, curiosity-inducing, relatable"
      },
      // ... 5 more topics
    ]
  },
  "error": null,
  "duration": 850
}
```

### Hooks Response

```typescript
interface HooksResponseData {
  result: GeneratedOption[]; // Array of 3 hooks
}

// Example
{
  "success": true,
  "data": {
    "result": [
      {
        "content": "Stop scrolling if you want to know...",
        "score": 88,
        "reasoning": "Creates curiosity, makes promise"
      },
      // ... 2 more hooks
    ]
  },
  "error": null,
  "duration": 620
}
```

### Body Response

```typescript
interface BodyResponseData {
  result: GeneratedOption[]; // Array of 2 body posts
}

// Example
{
  "success": true,
  "data": {
    "result": [
      {
        "content": "The full post body text goes here...",
        "score": 90,
        "reasoning": "Clear value proposition, strong opening hook"
      },
      // ... 1 more body
    ]
  },
  "error": null,
  "duration": 1580
}
```

### CTA Response

```typescript
interface CTAResponseData {
  result: GeneratedOption[]; // Array of 4 CTAs
}

// Example
{
  "success": true,
  "data": {
    "result": [
      {
        "content": "What's your take?",
        "score": 82,
        "reasoning": "Encourages engagement, creates conversation"
      },
      // ... 3 more CTAs
    ]
  },
  "error": null,
  "duration": 480
}
```

### Complete Post Response

```typescript
interface CompletePostResponseData {
  result: string; // Final polished post content
  scores: EvaluationResult[]; // Quality scores
}

// Example
{
  "success": true,
  "data": {
    "result": "AI productivity is crucial for career growth...",
    "scores": [
      {
        "metricName": "Virality Prediction",
        "score": 0.92,
        "reasoning": "Strong hook, compelling content"
      },
      // ... more scores
    ]
  },
  "error": null,
  "duration": 3850
}
```

### Research Response

```typescript
interface ResearchResponseData {
  results: ResearchResult[]; // Array of research results
}

// Example
{
  "success": true,
  "data": [
    {
      "title": "Article title",
      "url": "https://example.com/article",
      "content": "Article excerpt...",
      "score": 0.95
    }
  ],
  "error": null,
  "duration": 1250
}
```

### Transcription Response

```typescript
interface TranscriptionResponseData {
  text: string; // Transcribed text
  language: string; // Detected language
  duration: number; // Duration in seconds
}

// Example
{
  "success": true,
  "data": {
    "text": "Transcribed text here",
    "language": "en",
    "duration": 5.2
  },
  "error": null,
  "duration": 3250
}
```

### Style Analysis Response

```typescript
interface StyleAnalysisResponseData {
  profile: StyleProfile; // Analyzed style profile
}

// Example
{
  "success": true,
  "data": {
    "profile": {
      "emojiUsage": "Medium",
      "paragraphLength": "Short",
      "tone": "Professional",
      "formatting": [
        "Bullets",
        "Short paragraphs"
      ],
      "closings": [
        "Question",
        "Call to action"
      ],
      "vocabulary": {
        "level": "Professional",
        "commonWords": ["productivity"],
        "industryTerms": ["AI"]
      }
    }
  },
  "error": null,
  "duration": 1850
}
```

## HTTP Status Codes

| Code | Status | Description | Retry |
|------|--------|----------|--------|
| 200 | Success | No retry |
| 400 | Bad Request | Fix request and retry |
| 401 | Unauthorized | Check API key |
| 403 | Forbidden | Check permissions |
| 429 | Rate Limited | Wait and retry |
| 500 | Server Error | Retry after delay |
| 502 | Service Unavailable | Check service status |
| 503 | Service Unavailable | Retry after delay |

## Request Examples

### Generate Topics

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "topics",
    "input": "AI productivity",
    "researchDepth": 3
  }' \
  -w
```

### Generate Hooks

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "hooks",
    "topic": "AI productivity for professionals",
    "intent": "educational"
  }' \
  -w
```

### Generate Complete Post

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "complete",
    "topic": "AI productivity",
    "intent": "educational",
    "length": "medium",
    "tone": 7,
    "emojiDensity": "medium",
    "language": "en"
  }' \
  -w
```

### Web Research

```bash
curl -X POST http://localhost:3000/api/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "AI productivity trends",
    "maxResults": 5
  }' \
  -w
```

## Error Handling

### Validation Errors

```typescript
// Client-side validation
if (!input || input.trim().length === 0) {
  setError('Input is required');
  return;
}

// API response validation
if (!response.success) {
  setError(response.error.message);
  return;
}

// Network error handling
try {
  const result = await fetch('/api/generate', options);
  const data = await result.json();
} catch (error) {
  setError('Network error. Please try again.');
  console.error('API error:', error);
}
```

### Response Timeouts

```typescript
// Set timeout for requests
const TIMEOUT = 10000; // 10 seconds

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

try {
  const response = await fetch(url, {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
} catch (error) {
  if (error.name === 'AbortError') {
    setError('Request timeout. Please try again.');
  } else {
    throw error;
  }
}
```

## Best Practices

### 1. Always Validate Input

```typescript
// Client-side validation before sending
if (!input || input.trim().length === 0) {
  return showError('Input is required');
}

// Server-side validation using Zod
const validated = TopicInputSchema.parse(requestBody);
```

### 2. Handle Errors Gracefully

```typescript
// Provide helpful error messages
const errorMessages = {
  INPUT_REQUIRED: 'Please provide a topic idea',
  INPUT_TOO_LONG: 'Topic must be 500 characters or less',
  API_ERROR: 'Unable to connect to AI service. Please try again.',
  RATE_LIMITED: 'Too many requests. Please wait a minute.',
};
```

### 3. Use TypeScript Types

```typescript
// Use types for all requests and responses
const response: ApiResponse<TopicsResponseData> = await response.json();

// Type-safe property access
if (response.success && response.data) {
  const topics = response.data.result;
  const scores = response.data.scores;
}
```

### 4. Log All Requests

```typescript
// Use OPIK to log all API requests
const trace = getOpikClient().trace('API_Request', {
  input: requestBody,
  tags: ['api', type],
});

// Log response
trace.end({
  output: responseBody,
  metadata: {
    duration: responseTime,
    statusCode: response.status,
  },
});
```

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI - Ensuring Highest Quality AI Generation**

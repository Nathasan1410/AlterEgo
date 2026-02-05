# API Reference

## Overview

The AlterEgo API provides endpoints for AI-powered LinkedIn content generation, research, and transcription. All endpoints are RESTful and return JSON responses.

**Base URL:** `http://localhost:3000/api` (development)

**Version:** 3.0.0 (Modular)

## Authentication

Currently, the API does not require authentication for development. For production deployment, implement:

- API keys or OAuth tokens
- Rate limiting
- Request signing

### Headers

```http
Content-Type: application/json
Authorization: Bearer <token> (when implemented)
```

## Endpoints

### POST /api/generate

Generate LinkedIn content (topics, hooks, body, CTA, or complete post).

**Request Body:**
```json
{
  "type": "topics" | "hooks" | "body" | "cta" | "polish" | "complete",
  "input": "Your topic idea",
  "intent": "educational",
  "length": "medium",
  "tone": 7,
  "emojiDensity": "medium",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "result": [
      {
        "content": "Generated content here",
        "score": 85,
        "reasoning": "Why this works"
      }
    ],
    "options": [...]
  },
  "error": null,
  "duration": 1250
}
```

**Types:**

| Type | Description | Required Fields |
|------|-------------|-----------------|
| `topics` | Generate 6 topics | `input` |
| `hooks` | Generate 3 hooks | `topic` |
| `body` | Generate 2 body posts | `hook`, `topic` |
| `cta` | Generate 4 CTAs | `body` |
| `polish` | Polish content | `content` |
| `complete` | Generate full post | `topic` |

### GET /api/generate

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "CommitToCareer AI API (Modular)",
  "version": "3.0.0",
  "timestamp": "2026-02-05T00:00:00.000Z"
}
```

### POST /api/research

Perform web research using Tavily.

**Request Body:**
```json
{
  "query": "AI productivity trends 2026",
  "maxResults": 5
}
```

**Response:**
```json
{
  "results": [
    {
      "title": "Article Title",
      "url": "https://example.com/article",
      "content": "Article excerpt...",
      "score": 0.95
    }
  ]
}
```

### POST /api/transcribe

Transcribe audio input using Whisper.

**Request Body:**
```json
{
  "audio": "base64-encoded-audio"
}
```

**Response:**
```json
{
  "text": "Transcribed text",
  "language": "en",
  "duration": 5.2
}
```

### POST /api/analyze-style

Analyze writing style from LinkedIn posts.

**Request Body:**
```json
{
  "posts": [
    "Post 1 content...",
    "Post 2 content..."
  ]
}
```

**Response:**
```json
{
  "profile": {
    "emojiUsage": "Medium",
    "paragraphLength": "Short",
    "tone": "Professional",
    "formatting": ["Bullets", "Short paragraphs"],
    "closings": ["Question", "Call to action"]
  }
}
```

## Request/Response Format

### Standard Response Format

All endpoints follow this response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
  duration: number; // Request duration in ms
}
```

### Generated Option Format

```typescript
interface GeneratedOption {
  content: string;
  score: number; // 0-100
  reasoning: string;
}
```

### Input Schemas

#### TopicInput
```typescript
{
  input: string;
  researchDepth?: number; // 1-5
}
```

#### HookInput
```typescript
{
  topic: string;
  intent?: string;
}
```

#### BodyInput
```typescript
{
  hook: string;
  topic: string;
  intent?: string;
  length?: string;
  tone?: number; // 1-10
  emojiDensity?: string;
  language?: string;
  styleProfile?: any;
  researchContext?: string;
}
```

#### CTAInput
```typescript
{
  body: string;
  intent?: string;
}
```

#### PolishInput
```typescript
{
  content: string;
  tone?: number; // 1-10
  emojiDensity?: string;
  language?: string;
}
```

## Error Handling

### Error Response Format

```json
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

### Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Invalid request data | 400 |
| `GENERATION_FAILED` | AI generation failed | 500 |
| `API_ERROR` | External API error | 502 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Internal server error | 500 |

### Error Handling Example

```typescript
try {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'topics',
      input: 'AI productivity'
    })
  });

  const data = await response.json();

  if (!data.success) {
    console.error('Error:', data.error.code, data.error.message);
    // Handle error
  }

  const options = data.data.result;
  // Use options
} catch (error) {
  console.error('Network error:', error);
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Default Limit**: 100 requests per minute
- **Burst Limit**: 200 requests per minute
- **Headers Returned**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time (Unix timestamp)

### Rate Limit Response

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 60 seconds."
  },
  "duration": 0
}
```

## Validation

All inputs are validated using Zod schemas:

```typescript
// Example: TopicInputSchema
const TopicInputSchema = z.object({
  input: z.string().min(1, "Input is required"),
  researchDepth: z.number().min(1).max(5).optional()
});
```

Invalid inputs return a 400 error with details.

## Examples

### Generate Topics

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "topics",
    "input": "How AI improves productivity",
    "researchDepth": 3
  }'
```

### Generate Hooks

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "hooks",
    "topic": "AI productivity hacks that changed my life",
    "intent": "educational"
  }'
```

### Generate Body

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "body",
    "hook": "I spent 10,000 hours optimizing my workflow...",
    "topic": "AI productivity",
    "length": "medium",
    "tone": 7,
    "language": "en"
  }'
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
  }'
```

### Web Research

```bash
curl -X POST http://localhost:3000/api/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "AI productivity trends 2026",
    "maxResults": 5
  }'
```

## Monitoring

All API requests are monitored via OPIK AI:

- Request latency
- Success/failure rates
- Token usage
- Quality metrics

[Learn more about OPIK AI Integration](../06-observability/opik-ai-integration)

## Next Steps

- [API Endpoints](./endpoints) - Detailed endpoint documentation
- [Authentication](./authentication) - Authentication implementation guide
- [Error Handling](./error-handling) - Error handling best practices
- [Rate Limiting](./rate-limiting) - Rate limiting configuration

## Support

- **Documentation**: This GitBook
- **GitHub Issues**: [Create Issue](https://github.com/your-repo/commit-to-career/issues)
- **API Status**: Check `/api/generate` for health

# API Endpoints

## Overview

AlterEgo provides RESTful API endpoints for content generation, research, transcription, and style analysis. All endpoints return JSON responses with consistent structure.

## Base URL

**Development**: `http://localhost:3000/api`
**Production**: `https://your-domain.com/api`

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "result": [...],
    "scores": [...],
    "polished": "...",
    // ... other fields
  },
  "error": null,
  "duration": 1250
}
```

### Error Response

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  },
  "duration": 5
}
```

## Endpoints

### POST /api/generate

Generate LinkedIn content (topics, hooks, body, CTA, or complete post).

**Request Body:**
```json
{
  "type": "topics" | "hooks" | "body" | "cta" | "polish" | "complete",
  "input": "Your topic idea",
  "researchDepth": 3,
  "intent": "educational",
  "length": "medium",
  "tone": 7,
  "emojiDensity": "medium",
  "language": "en",
  "styleProfile": { ... },
  "researchContext": "Additional context"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | ✅ | Generation type |
| `input` | string | ✅ | User's topic idea |
| `researchDepth` | number | ❌ | Research depth (1-5) |
| `intent` | string | ❌ | Content intent |
| `length` | string | ❌ | Post length |
| `tone` | number | ❌ | Professionalism (1-10) |
| `emojiDensity` | string | ❌ | Emoji usage |
| `language` | string | ❌ | Language (en/id) |
| `styleProfile` | object | ❌ | User's writing style |
| `researchContext` | string | ❌ | Web research context |

**Type Values:**

| Type | Description |
|------|-------------|
| `topics` | Generate 6 topic ideas |
| `hooks` | Generate 3 opening hooks |
| `body` | Generate 2 body posts |
| `cta` | Generate 4 call-to-actions |
| `polish` | Polish and finalize content |
| `complete` | Generate full post in one call |

**Success Response:**
```json
{
  "success": true,
  "data": {
    "result": [
      {
        "content": "I wish someone told me this 5 years ago...",
        "score": 92,
        "reasoning": "Strong hook, curiosity-inducing, relatable"
      }
    ],
    "scores": [
      {
        "metricName": "Virality Prediction",
        "score": 0.85,
        "reasoning": "Hook strength, storytelling elements, and call-to-action presence"
      },
      {
        "metricName": "Engagement Potential",
        "score": 0.78,
        "reasoning": "Questions, value propositions, and conversational triggers"
      }
    ]
  },
  "error": null,
  "duration": 1245
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "topics",
    "input": "AI productivity for professionals",
    "researchDepth": 3
  }'
```

### POST /api/research

Perform web research using Tavily AI.

**Request Body:**
```json
{
  "query": "AI productivity trends 2026",
  "maxResults": 5
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | ✅ | Search query |
| `maxResults` | number | ❌ | Max results (default: 5) |

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "title": "AI Productivity Trends in 2026",
      "url": "https://example.com/article",
      "content": "AI productivity continues to...",
      "score": 0.95
    }
  ],
  "error": null,
  "duration": 850
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "AI productivity trends",
    "maxResults": 5
  }'
```

### POST /api/transcribe

Transcribe audio input using OpenAI Whisper.

**Request Body:**
```
multipart/form-data
audio: [binary audio data]
```

**Success Response:**
```json
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

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/transcribe \
  -F "audio=@recording.webm" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### POST /api/analyze-style

Analyze user's writing style from LinkedIn posts.

**Request Body:**
```json
{
  "posts": [
    "Post 1 content...",
    "Post 2 content...",
    "Post 3 content..."
  ]
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `posts` | array | ✅ | Array of LinkedIn posts (5-10) |

**Success Response:**
```json
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
        "commonWords": ["productivity", "efficiency", "growth"],
        "industryTerms": ["AI", "automation", "workflow"]
      }
    }
  },
  "error": null,
  "duration": 1850
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/analyze-style \
  -H "Content-Type: application/json" \
  -d '{
    "posts": [
      "I wish someone told me this 5 years ago...",
      "The AI productivity secret nobody talks about...",
      "7 productivity hacks that changed my career"
    ]
  }'
```

## Error Codes

| Code | HTTP Status | Description |
|------|--------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `GENERATION_FAILED` | 500 | AI generation failed |
| `API_ERROR` | 502 | External API error |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded |
| `TRANSCRIPTION_ERROR` | 500 | Transcription failed |
| `INTERNAL_ERROR` | 500 | Internal server error |

### Error Response Examples

**Validation Error (400):**
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

**Generation Failed (500):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "GENERATION_FAILED",
    "message": "Failed to generate content: API error"
  },
  "duration": 250
}
```

**Rate Limit Exceeded (429):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 1 minute.",
    "retryAfter": "2026-02-05T12:01:00.000Z"
  },
  "duration": 2
}
```

## HTTP Methods

| Method | Usage |
|--------|---------|
| `GET` | Health checks, status endpoints |
| `POST` | Content generation, research, transcription, analysis |
| `OPTIONS` | CORS pre-flight requests |
| `PUT` | Future: Update resources |
| `DELETE` | Future: Delete resources |

## Headers

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer <token> (future)
X-Request-ID: <uuid>
```

### Response Headers

```http
Content-Type: application/json
X-Request-ID: <uuid>
X-Response-Time: 1250
X-RateLimit-Limit: <number>
X-RateLimit-Remaining: <number>
X-RateLimit-Reset: <ISO8601 date>
X-RateLimit-Window: <milliseconds>
```

## Examples

### Generate Topics

```bash
# Generate 6 topics about AI productivity
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "topics",
    "input": "AI productivity for professionals",
    "researchDepth": 3
  }'
```

### Generate Complete Post

```bash
# Generate full post in one call
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
# Research AI productivity trends
curl -X POST http://localhost:3000/api/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "AI productivity trends 2026",
    "maxResults": 5
  }'
```

## Testing Endpoints

### GET /api/generate

Health check endpoint to verify API is running.

**Response:**
```json
{
  "status": "ok",
  "service": "CommitToCareer AI API",
  "version": "3.0.0",
  "timestamp": "2026-02-05T00:00:00.000Z"
}
```

**Request:**
```bash
curl http://localhost:3000/api/generate
```

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI - Ensuring Highest Quality AI Generation**

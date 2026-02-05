# System Architecture

## Overview

AlterEgo follows a modern, modular architecture designed for scalability, maintainability, and AI observability. The system is built using Next.js 16 with a clear separation of concerns between presentation, business logic, and external service integration.

## Architecture Principles

### 1. Separation of Concerns

Each layer has a specific responsibility:
- **Presentation Layer**: Next.js App Router and React components
- **Business Logic Layer**: Orchestrators and services
- **Integration Layer**: Adapters for external services
- **Data Layer**: Caching and state management

### 2. Adapter Pattern

External services are abstracted through adapters:
- **GroqAdapter**: LLM generation
- **TavilyAdapter**: Web research
- **OpikAdapter**: Observability and tracing
- **OpenAIAdapter** (optional): Voice transcription

### 3. Orchestration Pattern

Centralized orchestrator coordinates all services:
- Manages flow between services
- Handles errors consistently
- Implements caching strategy
- Provides unified interface

### 4. Observability-First Design

OPIK AI is integrated at every level:
- All AI generations traced
- Quality metrics monitored
- Performance tracked
- Errors logged and analyzed

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Next.js App Router (app/)                       │  │
│  │                                                   │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────┐│  │
│  │  │  Page.tsx   │  │  Layout.tsx │  │  API    ││  │
│  │  │  (Main UI)  │  │  (Shared)   │  │ Routes  ││  │
│  │  └─────────────┘  └─────────────┘  └─────────┘│  │
│  │                                                   │  │
│  │  ┌───────────────────────────────────────────────┐   │  │
│  │  │  React Components (src/components/)        │   │  │
│  │  │  - UI Primitives                          │   │  │
│  │  │  - Feature Components                     │   │  │
│  │  │  - Layout Components                    │   │  │
│  │  └───────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                      │ HTTP/WebSocket
                      │
┌─────────────────────┴───────────────────────────────────────┐
│                  Business Logic Layer                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  API Handlers (src/api/)                         │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │  Generation Orchestrator                  │   │  │
│  │  │  (src/services/orchestration/)           │   │  │
│  │  │                                           │   │  │
│  │  │  ┌───────────────────────────────────┐   │   │  │
│  │  │  │  Request Validation           │   │   │  │
│  │  │  │  (Zod Schemas)            │   │   │  │
│  │  │  └───────────────────────────────────┘   │   │  │
│  │  │                                           │   │  │
│  │  │  ┌───────────────────────────────────┐   │   │  │
│  │  │  │  Cache Management             │   │   │  │
│  │  │  │  (src/cache/)               │   │   │  │
│  │  │  └───────────────────────────────────┘   │   │  │
│  │  │                                           │   │   │  │
│  │  │  ┌───────────────────────────────────┐   │   │  │
│  │  │  │  Error Handling              │   │   │  │
│  │  │  │  (src/utils/errorHandler.ts)  │   │   │  │
│  │  │  └───────────────────────────────────┘   │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │
┌─────────────────────┴───────────────────────────────────────┐
│                  Integration Layer                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Adapters (src/services/adapters/)                │  │
│  │                                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐          │  │
│  │  │ GroqAdapter  │  │ TavilyAdapter│          │  │
│  │  │ (LLM)        │  │ (Research)   │          │  │
│  │  └──────┬───────┘  └──────────────┘          │  │
│  │         │                                          │  │
│  │  ┌──────┴───────┐  ┌──────────────┐          │  │
│  │  │ OpikAdapter   │  │ OpenAI      │          │  │
│  │  │ (Trace/Eval) │  │ Adapter     │          │  │
│  │  │              │  │ (Whisper)   │          │  │
│  │  └──────────────┘  └──────────────┘          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/gRPC
                      │
┌─────────────────────┴───────────────────────────────────────┐
│                 External Services                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐│
│  │  Groq API   │  │  Tavily API  │  │  OPIK    ││
│  │  (LLM)       │  │  (Search)    │  │  API     ││
│  └──────────────┘  └──────────────┘  └──────────┘│
│  ┌──────────────┐                                │
│  │  OpenAI API │                                │
│  │  (Whisper)   │                                │
│  └──────────────┘                                │
└───────────────────────────────────────────────────────────┘
```

## Detailed Component Architecture

### Presentation Layer

#### Next.js App Router

Located in `app/` directory:

```typescript
app/
├── page.tsx              // Main dashboard page
├── layout.tsx            // Root layout wrapper
├── globals.css           // Global styles
└── api/                 // API route handlers
    ├── generate/route.ts   // Re-exports from src/api
    ├── research/route.ts
    ├── transcribe/route.ts
    └── analyze-style/route.ts
```

**Responsibilities**:
- Route handling
- Server-side rendering
- API route definitions
- Global state management

#### React Components

Located in `src/components/`:

```typescript
src/components/
├── ui/                  // Reusable UI primitives
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── ...
├── features/             // Feature-specific components
│   ├── post-generator/
│   ├── voice-input/
│   ├── style-onboarding/
│   └── research/
├── layout/               // Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
└── help/                // Help system
    └── HelpModal.tsx
```

**Responsibilities**:
- UI rendering
- User interaction
- State management (local)
- API integration (via hooks)

### Business Logic Layer

#### API Handlers

Located in `src/api/`:

```typescript
src/api/
└── generate.ts          // Main generation API handler
```

**Responsibilities**:
- Request validation (Zod)
- Response formatting
- Error handling
- Orchestration coordination

#### Generation Orchestrator

Located in `src/services/orchestration/`:

```typescript
src/services/orchestration/
└── generationOrchestrator.ts
```

**Key Methods**:
- `generateTopics()`: Coordinate topic generation
- `generateHooks()`: Coordinate hook generation
- `generateBody()`: Coordinate body generation
- `generateCTA()`: Coordinate CTA generation
- `polishContent()`: Coordinate content polishing
- `generateCompletePost()`: Full post generation flow

**Responsibilities**:
- Coordinate between adapters
- Implement caching strategy
- Handle errors gracefully
- Manage request flow
- Integrate OPIK tracing

#### Validation Layer

Located in `src/schemas/` and `src/utils/`:

```typescript
src/schemas/
└── generation.ts        // Zod validation schemas

src/utils/
├── validation.ts       // Validation helpers
└── errorHandler.ts    // Error handling
```

**Responsibilities**:
- Input validation
- Type safety
- Error standardization
- Error recovery

### Integration Layer

#### Adapters

Located in `src/services/adapters/`:

```typescript
src/services/adapters/
├── groqAdapter.ts       // Groq LLM integration
├── tavilyAdapter.ts     // Tavily research integration
├── opikAdapter.ts       // OPIK AI observability
├── interfaces.ts        // Adapter interfaces
└── index.ts            // Adapter exports
```

**Adapter Interfaces**:

```typescript
interface IModelAdapter {
  generateTopics(input: TopicInput): Promise<GeneratedOption[]>;
  generateHooks(input: HookInput): Promise<GeneratedOption[]>;
  generateBody(input: BodyInput): Promise<GeneratedOption[]>;
  generateCTA(input: CTAInput): Promise<GeneratedOption[]>;
  polishContent(input: PolishInput): Promise<{content: string}>;
  healthCheck(): Promise<boolean>;
}

interface IResearchAdapter {
  search(query: string, maxResults?: number): Promise<ResearchResult[]>;
  getTrending(industry: string): Promise<ResearchResult[]>;
}

interface IObservabilityAdapter {
  trace(name: string, input: any, options?: TraceOptions): ITrace;
  logEvaluation(input: any, output: any, evaluations: any[]): void;
  flush(): Promise<void>;
}
```

**Responsibilities**:
- Abstract external service APIs
- Handle provider-specific logic
- Implement retry mechanisms
- Format requests/responses
- Handle provider errors

### Data Layer

#### Cache

Located in `src/cache/`:

```typescript
src/cache/
└── simpleCache.ts       // In-memory cache implementation
```

**Responsibilities**:
- Cache generation results
- Implement TTL (Time To Live)
- Cache invalidation
- Performance optimization

## Data Flow Architecture

### Request Flow

```
1. User Action (UI)
   ↓
2. React Component (Frontend)
   ↓
3. API Route (Next.js)
   ↓
4. Validation (Zod)
   ↓
5. Orchestrator (Business Logic)
   ↓
6. OPIK Trace (Observability)
   ↓
7. Cache Check (Optional)
   ↓
8. Adapter Call (External Service)
   ↓
9. External API (Groq/Tavily/OPIK)
   ↓
10. Response Processing
   ↓
11. OPIK Evaluation
   ↓
12. Cache Update (Optional)
   ↓
13. Response Formatting
   ↓
14. API Response
   ↓
15. UI Update (React)
```

### Generation Flow Example

```
User: Generate topics for "AI productivity"
   ↓
[UI] PostGeneratorWizard calls API
   ↓
[API Route] POST /api/generate with {type: "topics", input: "..."}
   ↓
[Validation] Zod validates TopicInputSchema
   ↓
[Orchestrator] generateTopics() called
   ↓
[OPIK] Trace started: "Generate_Topics"
   ↓
[Cache] Check if cached for this input
   ↓ (if not cached)
[Adapter] GroqAdapter.generateTopics()
   ↓
[Groq] API call to Groq LLM
   ↓
[Prompt] System + user prompt sent
   ↓
[LLM] Llama 3.3 70B generates
   ↓
[Response] JSON array of topics returned
   ↓
[Parser] JSON parsed and validated
   ↓
[Evaluation] Quality scores calculated
   ↓
[OPIK] Evaluation logged
   ↓
[OPIK] Trace ended
   ↓
[Cache] Result stored in cache
   ↓
[API Response] {success: true, data: {result: [...]}}
   ↓
[UI] Display topics to user
```

### Error Flow

```
Error occurs (e.g., Groq API fails)
   ↓
[Adapter] Catch error
   ↓
[Adapter] Generate fallback options
   ↓
[OPIK] Log error with context
   ↓
[Orchestrator] Return fallback options
   ↓
[API Response] {success: true, data: {result: [fallbacks]}}
   ↓
[UI] Display fallback options with notice
   ↓
[OPIK] Dashboard shows error trace
```

## State Management Architecture

### Client State

- **React State**: Component-level state with `useState`
- **Context API**: Global state (theme, user settings)
- **Custom Hooks**: `usePostGeneration` for complex state

### Server State

- **API Routes**: Stateless, request/response model
- **Caching**: In-memory cache in orchestrator
- **Session**: Not currently used (future enhancement)

### Data Flow Patterns

#### Unidirectional Flow

```
User Input → Component → API → Orchestrator → Adapter → External API
                                                    ↓
Response ← Component ← API ← Orchestrator ← Adapter ← External API
```

#### Caching Flow

```
Request → Orchestrator
   ↓
Cache Key Generated
   ↓
Check Cache
   ↓ (hit)
   Return Cached Result
   ↓ (miss)
   Call Adapter
   ↓
   Store in Cache
   ↓
   Return Result
```

## Security Architecture

### Input Validation

All inputs validated at multiple layers:

1. **Frontend**: TypeScript types
2. **API Route**: Zod schemas
3. **Service Layer**: Runtime checks
4. **Adapter Layer**: Provider-specific validation

### Error Handling

Multi-layer error handling:

```typescript
try {
  // Business logic
} catch (error) {
  // 1. Log to OPIK
  // 2. Log error details
  // 3. Return standardized error response
  // 4. Don't expose internal details
}
```

### API Security

- **Rate Limiting**: Prevent abuse
- **Environment Variables**: Sensitive data not in code
- **HTTPS Required**: Production deployment
- **CORS Policy**: Configured appropriately

## Performance Architecture

### Caching Strategy

- **In-Memory Cache**: Fast lookups
- **Configurable TTL**: Cache expiration
- **Cache Keys**: Deterministic key generation
- **Cache Invalidation**: Manual or time-based

### Optimization Techniques

1. **Lazy Loading**: Components loaded on demand
2. **Memoization**: `React.memo` for expensive components
3. **Code Splitting**: Dynamic imports for heavy features
4. **Parallel Requests**: Independent adapter calls run in parallel
5. **Debouncing**: Input debouncing to reduce API calls

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **API Response Time**: < 2s (cached), < 5s (uncached)
- **AI Generation Time**: < 3s per phase

## Observability Architecture

### OPIK Integration Points

1. **Request Tracing**: Every API request traced
2. **Generation Tracing**: Every AI generation traced
3. **Evaluation Logging**: Quality scores logged
4. **Error Tracking**: All errors logged with context
5. **Performance Metrics**: Latency and token usage tracked

### Trace Structure

```
Trace: Generate_Topics
├── Metadata
│   ├── Input: {topic: "AI productivity"}
│   ├── Tags: ["orchestrator", "topics", "groq"]
│   └── Timestamp: 2026-02-05T12:00:00Z
├── Spans
│   ├── Span 1: Cache Check
│   ├── Span 2: Groq API Call
│   └── Span 3: JSON Parsing
├── Output: [{content: "...", score: 85, ...}]
└── Evaluation: {virality: 0.85, engagement: 0.78}
```

## Scalability Architecture

### Horizontal Scaling

- **Serverless**: Vercel auto-scales
- **Stateless Services**: Easy to scale
- **External APIs**: Scaled by providers

### Vertical Scaling

- **Cache Size**: Configurable
- **Connection Pooling**: Reuse HTTP connections
- **Batch Processing**: Future enhancement

## Future Architecture Enhancements

### Planned Improvements

1. **Queue System**: Background job processing
2. **WebSocket**: Real-time updates
3. **Database**: Persistent storage for user data
4. **CDN**: Static asset delivery
5. **Edge Functions**: Geographic distribution

### Microservices Potential

- Split into separate services:
  - Generation Service
  - Research Service
  - Evaluation Service
  - User Service

## Summary

AlterEgo's architecture is:

- ✅ **Modular**: Clear separation of concerns
- ✅ **Scalable**: Ready for growth
- ✅ **Observable**: OPIK AI integrated throughout
- ✅ **Maintainable**: Clean code patterns
- ✅ **Performant**: Optimized for speed
- ✅ **Secure**: Multiple validation layers
- ✅ **Testable**: Easy to mock and test

The architecture demonstrates technical sophistication suitable for a hackathon winning submission, with OPIK AI integration as a key differentiator.

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI**

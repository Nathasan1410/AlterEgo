# Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js App Router (app/)                          │   │
│  │  - Pages & Routes                                   │   │
│  │  - Layout Components                                │   │
│  │  - API Route Handlers (re-exported from src/api/)  │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                      Business Logic Layer                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services Layer (src/services/)                      │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  Orchestration Layer                        │   │   │
│  │  │  - generationOrchestrator.ts               │   │   │
│  │  │  - Coordinates all AI services               │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  Adapters Layer (Adapter Pattern)          │   │   │
│  │  │  - GroqAdapter (LLM Generation)           │   │   │
│  │  │  - TavilyAdapter (Web Research)           │   │   │
│  │  │  - OpikAdapter (Observability)            │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  Prompts Layer                            │   │   │
│  │  │  - promptTemplates.ts                      │   │   │
│  │  │  - promptBuilder.ts                        │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                    External Services Layer                  │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────┐    │
│  │  Groq LLM     │  │   Tavily AI   │  │  Opik AI   │    │
│  │  Llama 3.3    │  │  Web Search    │  │  Observability│   │
│  │  70B          │  │               │  │             │    │
│  └────────────────┘  └──────────────┘  └─────────────┘    │
│  ┌────────────────┐                                     │    │
│  │  OpenAI       │                                     │    │
│  │  Whisper      │                                     │    │
│  │  (Transcribe) │                                     │    │
│  └────────────────┘                                     │    │
└───────────────────────────────────────────────────────────┘
```

## Component Structure

```
HACKATHON-OpikAI/
├── app/                          # Next.js app directory
│   ├── api/                    # API routes (re-exports)
│   │   ├── generate/           # Content generation
│   │   ├── research/           # Web research
│   │   ├── transcribe/        # Voice transcription
│   │   └── analyze-style/      # Style cloning
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main dashboard
│   └── globals.css            # Global styles
│
├── src/                        # Business logic & components
│   ├── api/                   # API implementations
│   │   └── generate.ts       # Generation API handler
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI primitives
│   │   │   ├── index.ts
│   │   │   └── ...
│   │   ├── features/         # Feature-specific components
│   │   │   ├── index.ts
│   │   │   └── ...
│   │   ├── layout/           # Layout components
│   │   └── help/            # Help system
│   ├── services/             # Business logic
│   │   ├── adapters/         # Adapter pattern for external services
│   │   │   ├── groqAdapter.ts
│   │   │   ├── tavilyAdapter.ts
│   │   │   ├── opikAdapter.ts
│   │   │   └── interfaces.ts
│   │   ├── orchestration/    # Orchestration layer
│   │   │   ├── generationOrchestrator.ts
│   │   │   └── index.ts
│   │   └── prompts/           # Prompt engineering
│   │       ├── promptTemplates.ts
│   │       ├── promptBuilder.ts
│   │       └── index.ts
│   ├── hooks/                # Custom React hooks
│   │   ├── usePostGeneration.ts
│   │   ├── useViewportCardCount.ts
│   │   └── index.ts
│   ├── lib/                  # Libraries and clients
│   │   ├── opik-client.ts   # OPIK AI client
│   │   ├── api-client.ts
│   │   ├── constants.ts
│   │   ├── scoring.ts
│   │   ├── style-analyzer.ts
│   │   └── tavily-client.ts
│   ├── utils/                # Utility functions
│   │   ├── jsonParser.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   ├── logger.ts
│   │   ├── className.ts
│   │   └── apiResponse.ts
│   ├── types/                # TypeScript types
│   │   ├── generated.ts
│   │   ├── api.ts
│   │   ├── errors.ts
│   │   └── index.ts
│   ├── schemas/              # Zod validation schemas
│   │   ├── generation.ts
│   │   └── index.ts
│   ├── models/               # Data models
│   │   ├── generated.ts
│   │   └── index.ts
│   ├── evaluators/           # Evaluation functions
│   │   └── index.ts
│   ├── config/               # Configuration
│   │   └── config.ts
│   ├── cache/                # Cache implementations
│   │   └── simpleCache.ts
│   └── middleware/           # Middleware
│       └── rateLimit.ts
```

## Data Flow

```
User Input (Topic/Settings)
         │
         ▼
┌─────────────────────┐
│  UI Component       │
│  (InputPhase)      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  API Route         │
│  /api/generate     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Orchestrator      │
│  Coordinates:      │
│  - Validate input  │
│  - Check cache     │
│  - Call adapters   │
└─────────┬───────────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌───────┐   ┌─────────┐
│ Cache │   │ Adapters│
└───────┘   └────┬────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌───────┐   ┌───────┐   ┌────────┐
│ Groq  │   │Tavily │   │ Opik   │
│  LLM  │   │ Search │   │ Trace  │
└───┬───┘   └───┬───┘   └───┬────┘
    │           │            │
    └─────┬─────┴────────────┘
          ▼
┌─────────────────────┐
│  AI Generation     │
│  - Generate topics │
│  - Generate hooks  │
│  - Generate body   │
│  - Generate CTAs   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  JSON Parser       │
│  - Parse LLM output│
│  - Validate format  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Score Calculator  │
│  - Viral score    │
│  - Quality metrics │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Cache Update      │
│  - Store results   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  OPIK Tracking     │
│  - Log evaluation  │
│  - Trace metrics   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  API Response      │
│  - Return to UI    │
└─────────┬───────────┘
          │
          ▼
    User Interface
```

## Key Design Patterns

### Adapter Pattern

External services (Groq, Tavily, Opik) are abstracted through adapters:

**Benefits:**
- Easy to swap providers
- Consistent interface
- Simplified testing
- Loose coupling

**Example:**
```typescript
// Interfaces define the contract
interface IModelAdapter {
  generateTopics(input: TopicInput): Promise<GeneratedOption[]>;
  generateHooks(input: HookInput): Promise<GeneratedOption[]>;
  // ...
}

// Multiple implementations possible
class GroqAdapter implements IModelAdapter { }
class OpenAIAdapter implements IModelAdapter { }
```

### Orchestration Pattern

Central orchestrator coordinates all services:

**Benefits:**
- Decoupled services
- Consistent flow
- Centralized error handling
- Easy to add new steps

**Implementation:**
```typescript
class GenerationOrchestrator {
  constructor(
    private modelAdapter: IModelAdapter,
    private researchAdapter: IResearchAdapter,
    private observabilityAdapter: IObservabilityAdapter
  ) {}

  async generateTopics(input: TopicInput) {
    const trace = this.observabilityAdapter.trace("Generate_Topics", input);
    const result = await this.modelAdapter.generateTopics(input);
    trace.end();
    return result;
  }
}
```

### Cache Strategy

Multi-level caching for performance:

- In-memory cache for hot data
- Configurable TTL
- Cache invalidation

**Implementation:**
```typescript
private async withCache<T>(key: string, generator: () => Promise<T>) {
  const cached = await this.cacheAdapter.get<T>(key);
  if (cached) return cached;

  const result = await generator();
  await this.cacheAdapter.set(key, result);
  return result;
}
```

## OPIK AI Integration

OPIK AI is integrated throughout the architecture:

- **Tracing**: Every AI generation request is traced
- **Evaluation**: Content quality is evaluated and logged
- **Monitoring**: Performance metrics are tracked
- **Debugging**: Issues can be identified and resolved

[Learn more about OPIK AI Integration](../06-observability/opik-ai-integration)

## Performance Considerations

- **Lazy Loading**: Components loaded on-demand
- **Memoization**: React.memo for child components
- **Code Splitting**: Dynamic imports for heavy components
- **Debouncing**: Input debouncing to reduce API calls
- **Parallel Requests**: Independent requests run in parallel

## Security

- **Input Validation**: Zod schemas for all inputs
- **Error Handling**: Custom error classes
- **Rate Limiting**: Prevent API abuse
- **Environment Variables**: Sensitive data in .env only
- **HTTPS**: Required for production

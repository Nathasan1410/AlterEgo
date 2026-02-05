# Project Structure

## Overview

Understanding the project structure is essential for navigating the codebase, making changes, and contributing effectively. This document provides a comprehensive overview of AlterEgo's file organization.

## Directory Structure

```
HACKATHON-OpikAI/
├── app/                          # Next.js app directory
│   ├── api/                    # API route handlers
│   │   ├── generate/route.ts   # Content generation endpoint
│   │   ├── research/route.ts   # Web research endpoint
│   │   ├── transcribe/route.ts # Voice transcription endpoint
│   │   └── analyze-style/route.ts # Style analysis endpoint
│   ├── page.tsx                  # Main dashboard page
│   ├── layout.tsx                # Root layout component
│   ├── globals.css               # Global styles
│   └── error.tsx                 # Error boundary
│
├── src/                          # Source directory
│   ├── api/                     # API implementations
│   │   └── generate.ts          # Main generation API handler
│   │
│   ├── components/               # React components
│   │   ├── ui/                # Reusable UI primitives
│   │   ├── features/           # Feature-specific components
│   │   ├── layout/             # Layout components
│   │   └── help/               # Help system
│   │
│   ├── services/                # Business logic
│   │   ├── adapters/           # Adapter pattern for external services
│   │   ├── orchestration/       # Orchestration layer
│   │   └── prompts/            # Prompt engineering
│   │
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Libraries and clients
│   ├── utils/                   # Utility functions
│   ├── types/                   # TypeScript types
│   ├── schemas/                 # Zod validation schemas
│   ├── models/                  # Data models
│   ├── evaluators/              # Evaluation functions
│   ├── config/                  # Configuration
│   ├── cache/                   # Cache implementations
│   └── middleware/              # Middleware
│
├── docs/                       # Documentation
├── gitbook-docs/              # GitBook documentation
├── public/                     # Static assets
├── .env.example                # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── next.config.ts            # Next.js configuration
├── postcss.config.js         # PostCSS configuration
├── prettier.config.js        # Prettier configuration
├── eslint.config.js          # ESLint configuration
├── jest.config.js            # Jest configuration
└── README.md                  # Project readme
```

## Detailed Breakdown

### 1. app/ - Next.js App Directory

**Purpose**: Next.js 16 App Router structure

**Files**:

#### api/ - API Routes

```
app/api/
├── generate/route.ts       # Re-exports from src/api/generate.ts
├── research/route.ts       # Web research endpoint
├── transcribe/route.ts    # Voice transcription endpoint
└── analyze-style/route.ts # Style analysis endpoint
```

**Purpose**: Define API endpoints that handle HTTP requests

**Pattern**: Routes re-export from `src/api/` for separation of concerns

#### page.tsx - Main Page

```typescript
// app/page.tsx
export default function HomePage() {
  return <PostGeneratorWizard />;
}
```

**Purpose**: Render the main application interface

#### layout.tsx - Root Layout

```typescript
// app/layout.tsx
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import '@/app/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Purpose**: Define root layout and providers

#### globals.css - Global Styles

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --foreground-rgb: 0, 0, 0;
    --background-start-rgb: 214, 219, 220;
    --background-end-rgb: 255, 255, 255;
  }
}
```

**Purpose**: Define global styles and Tailwind imports

### 2. src/ - Source Directory

**Purpose**: Contains all source code (components, services, utilities, etc.)

#### api/ - API Implementations

```
src/api/
└── generate.ts          # Main generation API handler
```

**Purpose**: Implement business logic for API routes

**Key Functions**:
```typescript
// src/api/generate.ts
export async function POST(request: NextRequest) {
  // Handle generation requests
}

export async function GET() {
  // Health check endpoint
}
```

#### components/ - React Components

##### ui/ - UI Primitives

```
src/components/ui/
├── index.ts           # Export all UI components
├── Button.tsx
├── Card.tsx
├── Input.tsx
├── Select.tsx
├── Textarea.tsx
├── Badge.tsx
└── ...
```

**Purpose**: Provide reusable, design system components

**Pattern**:
```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  const styles = `${baseStyles} ${variantStyles[variant]}`;
  return <button className={styles} onClick={onClick}>{children}</button>;
}
```

##### features/ - Feature Components

```
src/components/features/
├── index.ts                    # Export all features
├── post-generator/
│   ├── PostGeneratorWizard.tsx  # Main wizard component
│   ├── InputPhase.tsx          # Input phase
│   ├── BuildingPhase.tsx        # Selection phase
│   ├── ConfirmationPhase.tsx     # Review phase
│   └── ResultPhase.tsx         # Final result phase
├── voice-input/
│   └── VoiceInput.tsx
├── style-onboarding/
│   └── StyleOnboarding.tsx
└── research/
    └── ResearchResults.tsx
```

**Purpose**: Implement feature-specific UI and logic

**Pattern**: Each feature is self-contained with its own components

##### layout/ - Layout Components

```
src/components/layout/
├── index.ts           # Export all layout components
├── Header.tsx
├── Footer.tsx
├── Sidebar.tsx
└── ThemeProvider.tsx
```

**Purpose**: Provide application layout structure

##### help/ - Help System

```
src/components/help/
├── index.ts           # Export all help components
├── HelpModal.tsx      # Help modal dialog
├── HelpContent.tsx    # Help content renderer
└── helpTypes.ts       # Help content types
```

**Purpose**: Provide in-app help and documentation

#### services/ - Business Logic

##### adapters/ - External Service Adapters

```
src/services/adapters/
├── index.ts                    # Export all adapters
├── groqAdapter.ts             # Groq LLM integration
├── tavilyAdapter.ts           # Tavily research integration
├── opikAdapter.ts             # OPIK AI integration
└── interfaces.ts              # Adapter interfaces
```

**Purpose**: Abstract external services behind consistent interfaces

**Pattern**:
```typescript
// src/services/adapters/groqAdapter.ts
export class GroqAdapter implements IModelAdapter {
  readonly name = "Groq";
  readonly version = "llama-3.3-70b-versatile";

  async generateTopics(input: TopicInput): Promise<GeneratedOption[]> {
    // Implementation
  }
}
```

##### orchestration/ - Orchestration Layer

```
src/services/orchestration/
├── index.ts                    # Export orchestrator
└── generationOrchestrator.ts  # Main orchestrator
```

**Purpose**: Coordinate between adapters and manage request flow

**Key Methods**:
```typescript
// src/services/orchestration/generationOrchestrator.ts
export class GenerationOrchestrator {
  async generateTopics(input: TopicInput): Promise<GeneratedOption[]>
  async generateHooks(input: HookInput): Promise<GeneratedOption[]>
  async generateBody(input: BodyInput): Promise<GeneratedOption[]>
  async generateCTA(input: CTAInput): Promise<GeneratedOption[]>
  async polishContent(input: PolishInput): Promise<{content: string}>
  async generateCompletePost(topic: string, params: any): Promise<any>
}
```

##### prompts/ - Prompt Engineering

```
src/services/prompts/
├── index.ts                    # Export all prompts
├── promptTemplates.ts        # Prompt templates
└── promptBuilder.ts          # Prompt builder
```

**Purpose**: Centralize prompt management

**Pattern**:
```typescript
// src/services/prompts/promptTemplates.ts
export const PROMPT_TEMPLATES = {
  TOPICS: `Generate 6 topics...`,
  HOOKS: `Generate 3 hooks...`,
  BODY: `Generate 2 body posts...`,
  CTA: `Generate 4 CTAs...`,
};

// src/services/prompts/promptBuilder.ts
export class PromptBuilder {
  static buildTopicsPrompt(input: TopicInput): string {
    return PROMPT_TEMPLATES.TOPICS
      .replace("{{idea}}", input.input)
      .replace("{{researchDepth}}", input.researchDepth || 3);
  }
}
```

#### hooks/ - Custom React Hooks

```
src/hooks/
├── index.ts                    # Export all hooks
├── usePostGeneration.ts      # Post generation hook
└── useViewportCardCount.ts   # Responsive cards hook
```

**Purpose**: Encapsulate reusable stateful logic

**Pattern**:
```typescript
// src/hooks/usePostGeneration.ts
export function usePostGeneration() {
  const [topics, setTopics] = useState<GeneratedOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTopics = async (input: string) => {
    // Implementation
  };

  return { topics, loading, error, generateTopics };
}
```

#### lib/ - Libraries and Clients

```
src/lib/
├── index.ts                    # Export all libraries
├── opik-client.ts            # OPIK AI client
├── api-client.ts             # API client
├── constants.ts              # Application constants
├── scoring.ts               # Viral scoring logic
├── style-analyzer.ts         # Style analysis
└── tavily-client.ts          # Tavily client
```

**Purpose**: Provide reusable libraries and external service clients

**Key Files**:

**opik-client.ts**:
```typescript
// OPIK AI singleton client
let opikInstance: Opik | null = null;

export const getOpikClient = (): Opik => {
  if (!opikInstance) {
    opikInstance = new Opik({
      apiKey: process.env.OPIK_API_KEY,
      projectName: "commit-to-career",
    });
  }
  return opikInstance;
};
```

**constants.ts**:
```typescript
// Application constants
export const CONFIG = {
  MAX_TOKENS: 4096,
  DEFAULT_TEMPERATURE: 0.8,
  CACHE_TTL: 3600,
  GENERATION_COUNTS: {
    TOPICS: 6,
    HOOKS: 3,
    BODY: 2,
    CTA: 4,
  },
};
```

#### utils/ - Utility Functions

```
src/utils/
├── index.ts                    # Export all utilities
├── jsonParser.ts            # JSON parsing utilities
├── validation.ts            # Validation helpers
├── errorHandler.ts         # Error handling
├── logger.ts               # Logging
├── className.ts            # Class name utilities
└── apiResponse.ts          # API response builders
```

**Purpose**: Provide helper functions

**Key Files**:

**jsonParser.ts**:
```typescript
// Parse LLM JSON output
export class JSONParser {
  static parseGeneratedContent(content: string): GeneratedOption[] {
    // Implementation
  }
}
```

**errorHandler.ts**:
```typescript
// Handle errors consistently
export function handleGenerationError(error: Error): NextResponse {
  const apiError = {
    code: 'GENERATION_FAILED',
    message: error.message,
  };
  return createResponse(null, apiError, 0);
}
```

#### types/ - TypeScript Types

```
src/types/
├── index.ts                    # Export all types
├── generated.ts             # Generated content types
├── api.ts                   # API types
└── errors.ts                # Error types
```

**Purpose**: Provide type safety across application

**Key Types**:

**generated.ts**:
```typescript
export interface GeneratedOption {
  content: string;
  score: number; // 0-100
  reasoning: string;
}

export interface TopicInput {
  input: string;
  researchDepth?: number;
}

export interface HookInput {
  topic: string;
  intent?: string;
}

export interface BodyInput {
  hook: string;
  topic: string;
  intent?: string;
  length?: string;
  tone?: number;
  emojiDensity?: string;
  language?: string;
  styleProfile?: any;
  researchContext?: string;
}

export interface CTAInput {
  body: string;
  intent?: string;
}

export interface PolishInput {
  content: string;
  tone?: number;
  emojiDensity?: string;
  language?: string;
}
```

#### schemas/ - Zod Validation Schemas

```
src/schemas/
├── index.ts                    # Export all schemas
└── generation.ts            # Generation input schemas
```

**Purpose**: Provide runtime type validation

**Pattern**:
```typescript
// src/schemas/generation.ts
import { z } from 'zod';

export const TopicInputSchema = z.object({
  input: z.string().min(1, "Input is required").max(500, "Input too long"),
  researchDepth: z.number().min(1).max(5).optional(),
});

export const HookInputSchema = z.object({
  topic: z.string().min(1, "Topic is required").max(200),
  intent: z.string().optional(),
});
```

#### models/ - Data Models

```
src/models/
├── index.ts                    # Export all models
└── generated.ts             # Generated content models
```

**Purpose**: Define data models used across application

#### evaluators/ - Evaluation Functions

```
src/evaluators/
└── index.ts                    # Quality evaluators
```

**Purpose**: Evaluate content quality

**Key Functions**:
```typescript
// src/evaluators/index.ts
export const evaluateVirality = (content: string): EvaluationResult => {
  // Virality scoring logic
};

export const evaluateEngagement = (content: string): EvaluationResult => {
  // Engagement scoring logic
};

export const evaluateContent = async (content: string): Promise<EvaluationResult[]> => {
  return [evaluateVirality(content), evaluateEngagement(content)];
};
```

#### config/ - Configuration

```
src/config/
└── config.ts                   # App configuration
```

**Purpose**: Centralize configuration

**Pattern**:
```typescript
// src/config/config.ts
export const CONFIG = {
  APP_NAME: "AlterEgo",
  VERSION: "1.0.0",
  ENVIRONMENT: process.env.NODE_ENV || "development",
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
};
```

#### cache/ - Cache Implementations

```
src/cache/
└── simpleCache.ts             # In-memory cache
```

**Purpose**: Provide caching for performance

**Pattern**:
```typescript
// src/cache/simpleCache.ts
export class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  async get<T>(key: string): Promise<T | null> {
    // Implementation
  }

  async set<T>(key: string, data: T): Promise<void> {
    // Implementation
  }
}
```

#### middleware/ - Middleware

```
src/middleware/
└── rateLimit.ts              # Rate limiting
```

**Purpose**: Provide middleware for requests

### 3. docs/ - Documentation

**Purpose**: Internal documentation

**Files**:
- `README.md` - Project documentation
- Progress reports
- Task prioritization
- Clean code plan
- Implementation plans

### 4. gitbook-docs/ - GitBook Documentation

**Purpose**: Public-facing technical documentation

**Files**: All the GitBook documentation we're creating

### 5. public/ - Static Assets

**Purpose**: Serve static files

**Contents**:
- Images
- Icons
- Favicon
- Robots.txt

### 6. Configuration Files

#### package.json

```json
{
  "name": "commit-to-career",
  "version": "1.0.0",
  "description": "AI Agent for Professional Growth",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css,md}\"",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "evaluate": "npx tsx scripts/runEvaluation.ts"
  }
}
```

#### tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

#### next.config.ts

```typescript
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

## Best Practices

### File Organization

1. **Group by Functionality**: Related files in same directory
2. **Index Exports**: Export from index.ts for cleaner imports
3. **Consistent Naming**: Use kebab-case for files, PascalCase for components
4. **Logical Depth**: Keep directory structure shallow (3-4 levels max)

### Imports

**Good**:
```typescript
import { Button, Card } from '@/components/ui';
import { usePostGeneration } from '@/hooks';
import { GenerationOrchestrator } from '@/services/orchestration';
```

**Avoid**:
```typescript
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
// Use index.ts exports
```

### Type Safety

1. **Use Interfaces**: For object shapes
2. **Define Types**: For reusable types
3. **Runtime Validation**: Use Zod for runtime checks
4. **No Any**: Avoid using `any` type

### Code Reusability

1. **UI Primitives**: Generic, reusable components
2. **Custom Hooks**: Encapsulate stateful logic
3. **Utility Functions**: Pure functions for common tasks
4. **Service Layer**: Business logic separate from UI

## Navigation Guide

### Finding Files

| What You Want | Where to Look |
|---------------|---------------|
| UI components | `src/components/ui/` |
| Feature components | `src/components/features/` |
| API handlers | `src/api/` |
| Business logic | `src/services/` |
| External services | `src/services/adapters/` |
| Utilities | `src/utils/` |
| Types | `src/types/` |
| Config | `src/config/` |
| Hooks | `src/hooks/` |

### Common Tasks

**Add New UI Component**:
1. Create in `src/components/ui/` or `src/components/features/`
2. Export from `index.ts`
3. Use in other components

**Add New Service**:
1. Create in `src/services/`
2. Implement interface
3. Use in orchestrator

**Add New Hook**:
1. Create in `src/hooks/`
2. Export from `index.ts`
3. Use in components

**Add New API Endpoint**:
1. Create route in `app/api/`
2. Implement handler in `src/api/`
3. Re-export from route file

## Summary

AlterEgo's project structure is:

- ✅ **Organized**: Logical grouping by functionality
- ✅ **Modular**: Clear separation of concerns
- ✅ **Type-Safe**: Comprehensive TypeScript types
- ✅ **Scalable**: Easy to add new features
- ✅ **Maintainable**: Consistent patterns
- ✅ **Observable**: OPIK integrated at service level

This structure demonstrates best practices suitable for a winning hackathon submission.

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI**
